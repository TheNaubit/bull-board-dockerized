import Elysia from "elysia";

import etagPlugin from "../plugins/etag.plugin";
import helmetPlugin from "../plugins/helmet.plugin";
import ipPlugin from "../plugins/ip.plugin";
import loggerPlugin from "../plugins/logger.plugin";
import requestIDPlugin from "../plugins/requestID.plugin";
import authPlugin from "./auth.plugin";

export const pluginsWithoutLogger = new Elysia({
	name: "plugins-without-logger",
})
	.use(authPlugin)
	.use(helmetPlugin)
	.use(etagPlugin)
	.use(ipPlugin)
	.use(requestIDPlugin);

const plugins = new Elysia({
	name: "plugins",
})
	.use(loggerPlugin.into())
	.use(pluginsWithoutLogger);

export const baseApp = new Elysia().use(pluginsWithoutLogger);

export default plugins;
