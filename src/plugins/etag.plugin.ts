import { etag } from "@bogeychan/elysia-etag";

/**
 * Middleware plugin for generating and validating ETags.
 */
const etagPlugin = etag();

export default etagPlugin;
