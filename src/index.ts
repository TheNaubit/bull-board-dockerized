import { createBullBoard } from "@bull-board/api";
import { BullAdapter } from "@bull-board/api/bullAdapter";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import BullQueue from "bull";
import { Queue as BullMQQueue } from "bullmq";
import Elysia from "elysia";
import { Redis } from "ioredis";
import { ElysiaAdapter } from "./adapters/ElysiaAdapter";
import { config } from "./config";
import bullBoardLocalePatch from "./patches/bullboardlocale.patch";
import plugins from "./plugins";
import log from "./plugins/logger.plugin";

log.info("Starting the server...");
log.info("Connecting to Redis...");
const client = new Redis(config.redis.url, {
	retryStrategy(times) {
		// It is same as the internally used by BullMQ
		return Math.max(Math.min(Math.exp(times), 20000), 1000);
	},
	// This is the default value of `maxRetriesPerRequest` in BullMQ
	maxRetriesPerRequest: null,
});

const serverAdapter = new ElysiaAdapter(
	// Bull Board fails if the adapter's base path is "/" for the root
	// It wants the base path to be empty for the root
	config.app.basePath === "/" ? "" : config.app.basePath,
);

const { setQueues } = createBullBoard({
	queues: [],
	serverAdapter,
	// We need to specify the UI path because the automatic detection is not working if
	// we use it inside a single-file standalone executable build in Bun
	// (because the node_modules/@bull-board/api tries to use a eval(require(...)) of the package.json file of the node_modules/@bull-board/ui package, which fails in the single-file executable build in Bun)
	// @ts-ignore - Ignored because even if it is valid, for some reason it is not recognized
	options: {
		uiBasePath: "node_modules/@bull-board/ui/",
	},
});

// Since our entire server relies on the queues, we need to wait for the connection to be established
client.on("connect", async () => {
	log.info("Connected to Redis");

	try {
		log.info("Fetching queue list, please wait...");
		const keys = await client.keys(`${config.bull.prefix}:*`);

		const uniqKeys = new Set(
			(keys ?? []).map((key) => key.replace(/^.+?:(.+?):.+?$/, "$1")),
		);
		const queueList = Array.from(uniqKeys)
			.sort()
			.map((item) => {
				if (config.bull.version === "BULLMQ") {
					return new BullMQAdapter(
						new BullMQQueue(item, {
							connection: client,
							...(config.bull.prefix ? { prefix: config.bull.prefix } : {}),
						}),
					);
				}

				return new BullAdapter(
					new BullQueue(item, {
						redis: config.redis.url, // Bull does not accept a Redis instance, so we need to pass the Redis URL
						...(config.bull.prefix ? { prefix: config.bull.prefix } : {}),
					}),
				);
			});

		setQueues(queueList);
		log.info("Done!");
	} catch (err) {
		log.error(err);
		throw new Error(
			"There was a problem connecting to the Redis instance so the server could not be started",
		);
	}

	const app = new Elysia()
		.use(plugins)
		.use(bullBoardLocalePatch)
		.use(serverAdapter.registerPlugin());

	app.listen(config.app.port, ({ port, hostname }) => {
		log.warn(`Server is running on ${hostname}:${port}`);

		if (config.app.auth.enabled) {
			log.warn("The server is running with authentication enabled.");
			log.info("To access it, enter your credentials in the browser prompt.");
			log.info(
				`Or navigate to your_username:your_password@${hostname}:${port} in your browser.`,
			);
		}
	});
});
