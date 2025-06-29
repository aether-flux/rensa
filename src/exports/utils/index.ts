import { loadEnv } from "../../middlewares/envars.js";

export function env (file?: string) {
  loadEnv(file);
}
