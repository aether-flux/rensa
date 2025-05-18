import { Rensa } from "../../index.js"
import { RensaConfig } from "../../types/configTypes.js"

export const createServerFromConfig = (app: Rensa, config: RensaConfig) => {
  const { routesDir, layersDir, layers, builtins } = config;

  app.compose({
    routes: routesDir,
    layers: layersDir,
    builtins: builtins,
  });

  layers?.forEach(l => {
    if (l.config) {
      app.use(l.fn, l.config);
    } else {
      app.use(l.fn);
    }
  });
}
