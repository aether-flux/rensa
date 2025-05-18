import { RouteStore } from "../rust/index.js";

const store = new RouteStore();
store.insert("/user/:id");
const result = store.search("/user/123");
console.log(result);
