import { makeURL } from "@nauverse/make-url";
import type Elysia from "elysia";
import { redirect } from "elysia";
import { config } from "../config";

// The node_modules/@bull-board/ui package tries to look for "en" locale, but it is not available, so we use "en-US" instead
const wrongDefaultLocaleURL = makeURL(
	config.app.basePath,
	"static/locales/en/messages.json",
	{
		config: {
			trailingSlash: "remove",
		},
	},
);

const validDefaultLocaleURL = makeURL(
	config.app.basePath,
	"static/locales/en-US/messages.json",
	{
		config: {
			trailingSlash: "remove",
		},
	},
);

/**
 * Applies a patch to the BullBoard locale.
 *
 * @param app - The Elysia application instance.
 */
const bullBoardLocalePatch = (app: Elysia) => {
	return app.get(wrongDefaultLocaleURL, async () => {
		redirect(validDefaultLocaleURL, 301);
	});
};

export default bullBoardLocalePatch;
