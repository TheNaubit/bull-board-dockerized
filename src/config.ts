import { z } from "zod";
import {
	BullModeSchema,
	ConfigSchema,
	LogLevelSchema,
} from "./types/schemas/config.schema";

export const config = ConfigSchema.parse({
	redis: {
		url: z
			.string()
			.url()
			.parse(Bun.env.REDIS_URL || "redis://localhost:6379"),
	},
	bull: {
		prefix: Bun.env.BULL_PREFIX || "bull",
		version: BullModeSchema.catch("BULLMQ").parse(Bun.env.BULL_VERSION),
	},
	app: {
		port: Number.parseInt(Bun.env.PORT || "3000"),
		auth: {
			username: Bun.env.USER_USERNAME,
			password: Bun.env.USER_PASSWORD,
			enabled: Boolean(Bun.env.USER_USERNAME && Bun.env.USER_PASSWORD),
		},
		basePath: Bun.env.BASE_PATH || "/",
	},
	log: {
		level: LogLevelSchema.catch("info").parse(Bun.env.LOG_LEVEL),
		anonymizeIP:
			(Bun.env.LOG_ANONYMIZE_IP ?? "").trim().toLowerCase() === "true",
	},
});
