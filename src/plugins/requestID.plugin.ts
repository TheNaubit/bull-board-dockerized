import { requestID } from "elysia-requestid";

/**
 * The requestIDPlugin is a plugin that generates a unique request ID for each incoming request.
 * It can be used to track and correlate requests across different parts of the system.
 */
const requestIDPlugin = requestID();

export default requestIDPlugin;
