import {
	createPinoLogger,
	formatters,
	isContext,
} from "@bogeychan/elysia-logger";
import anonymizeIP from "ip-anonymize";
import pino from "pino";

import { config } from "../config";
import type { AppContext } from "./types";

/**
 * Creates a logger instance with custom configuration.
 *
 * @returns The configured logger instance.
 */
export const log = createPinoLogger({
	level: config.log.level,
	timestamp: pino.stdTimeFunctions.isoTime,
	formatters: {
		...formatters,
		level: (label) => {
			return {
				level: label.toUpperCase(),
			};
		},
		log(object) {
			if (isContext(object)) {
				const appContext = object as AppContext;
				return {
					// ip: appContext.ip,
					request: appContext.request,
					path: appContext.path,
					query: appContext.query,
					params: appContext.params,
					body: appContext.body,
					headers: appContext.headers,
				} as Record<string, unknown>;
			}

			return formatters.log(object);
		},
	},
	redact: {
		paths: [
			"headers.authorization",
			"body.password",
			"body.passwordConfirmation",
			"headers.cookie",
			"body.sessionID",
			...(config.log.anonymizeIP ? ["ip"] : []),
		],
		censor(value, path) {
			if (config.log.anonymizeIP && path.includes("ip")) {
				return anonymizeIP(value);
			}

			return "[REDACTED]";
		},
	},
});

export default log;
