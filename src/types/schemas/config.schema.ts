import { z } from "zod";

export const BullModeSchema = z.enum(["BULL", "BULLMQ"]);
export type BullMode = z.infer<typeof BullModeSchema>;

export const LogLevelSchema = z.enum([
	"trace",
	"debug",
	"info",
	"warn",
	"error",
	"fatal",
]);
export type LogLevel = z.infer<typeof LogLevelSchema>;

export const ConfigSchema = z.object({
	redis: z.object({
		url: z.string().url(),
	}),
	bull: z.object({
		prefix: z.string(),
		version: BullModeSchema,
	}),
	app: z.object({
		port: z.number().int().gt(0),
		auth: z.object({
			username: z.string().optional(),
			password: z.string().optional(),
			enabled: z.boolean(),
		}),
		basePath: z.string(),
	}),
	log: z.object({
		level: LogLevelSchema,
		anonymizeIP: z.boolean(),
	}),
});
export type Config = z.infer<typeof ConfigSchema>;
