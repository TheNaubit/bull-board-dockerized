import { helmet } from "elysia-helmet";

/**
 * Helmet plugin configuration for setting Content Security Policy (CSP) directives.
 */
const helmetPlugin = helmet({
	contentSecurityPolicy: {
		directives: {
			"script-src": ["'self'"],
			"style-src": [
				"'self'",
				"fonts.gstatic.com",
				"fonts.googleapis.com",
				"'unsafe-inline'",
			],
			"img-src": ["'self'", "https: data:"],
			"font-src": ["'self'", "fonts.gstatic.com"],
		},
	},
});

export default helmetPlugin;
