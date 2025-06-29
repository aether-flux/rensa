import path from 'path';
export const fileParser = (files, routes) => {
    return files.map(file => {
        const relative = path.relative(routes, file).replace(/\\/g, "/");
        // Check for routes/notFound.js (or .ts)
        if (relative === "notFound.js" || relative === "notFound.ts") {
            return { method: "notFound", route: null, file };
        }
        const parts = relative.split("/");
        const methodPart = parts.pop();
        const method = methodPart.split("[")[0].split(".")[0].toLowerCase();
        // const route = "/" + parts
        //   .concat(methodPart.replace(/\..*$/, "").slice(method.length))
        //   .map(p => p.replace(/\[([^\]]+)\]/g, ":$1"))    // [id] -> :id
        //   .join("/");
        const route = "/" + parts
            .concat(...methodPart
            .replace(/\..*$/, "") // remove extension
            .slice(method.length) // remove "get" or "post"
            .match(/\[[^\]]+\]/g) || [] // extract all [param] individually
        )
            .map(p => p.replace(/\[([^\]]+)\]/g, ":$1"))
            .join("/");
        return { method, route, file };
    });
};
