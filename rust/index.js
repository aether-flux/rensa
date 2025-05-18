import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const native = require('./index.node');

export const RouteStore = native.RouteStore;
export const shout = native.shout;
