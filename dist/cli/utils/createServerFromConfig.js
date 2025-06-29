export const createServerFromConfig = async (app, config) => {
    const { viewEngine, views, staticDir, routesDir, layersDir, layers, builtins } = config;
    layers?.forEach(l => {
        if (l[1]) {
            app.use(l[0], l[1]);
        }
        else {
            app.use(l[0]);
        }
    });
    await app.compose({
        routes: routesDir,
        layers: layersDir,
        builtins: builtins,
        viewEngine,
        views,
        staticDir,
    });
};
