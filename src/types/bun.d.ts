declare module "bun" {
	interface Env {
		REDIS_URL?: string;
		BULL_PREFIX?: string;
		BULL_VERSION?: "BULL" | "BULLMQ";
		PORT?: string;
		USER_USERNAME?: string;
		USER_PASSWORD?: string;
		BASE_PATH?: string;
		LOG_LEVEL?: "trace" | "debug" | "info" | "warn" | "error" | "fatal";
		LOG_ANONYMIZE_IP?: string;
	}
}
