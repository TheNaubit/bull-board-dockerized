import type { InferContext } from "@bogeychan/elysia-logger";
import type { baseApp } from ".";

export type ElysiaWithPlugins = typeof baseApp;
export type AppContext = InferContext<ElysiaWithPlugins>;
