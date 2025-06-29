import { loadEnv } from "../../middlewares/envars.js";
export function env(file) {
    loadEnv(file);
}
