import type Elysia from "elysia";
import { basicAuth } from "../adapters/BasicAuth";
import { config } from "../config";

/**
 * Registers the authentication plugin for the Elysia app.
 * @param app - The Elysia app instance.
 * @returns The modified Elysia app instance with the authentication plugin registered.
 */
const authPlugin = (app: Elysia) => {
	const appConfig = config;

	return app.use(
		basicAuth({
			credentials: [
				{
					username: config.app.auth.username ?? "",
					password: config.app.auth.password ?? "",
				},
			],
			scope: ["/"],
			skipCorsPreflight: true,
			unauthorizedMessage: "Unauthorized",
			unauthorizedStatus: 401,
			enabled: appConfig.app.auth.enabled,
		}),
	);
};

export default authPlugin;
