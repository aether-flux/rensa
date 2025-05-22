export const route = (handler, config) => {
    return { handler, config };
};
export const layer = (layerFn, config) => {
    return { layerFn, config };
};
