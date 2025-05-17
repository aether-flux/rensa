import path from 'path';

export const fileParser = (files: string[], routes: string) => {
  return files.map(file => {
    const relative = path.relative(routes, file).replace(/\\/g, "/");
    const parts = relative.split("/");

    const methodPart = parts.pop()!;
    const method = methodPart.split("[")[0].split(".")[0].toLowerCase();

    const route = "/" + parts
      .concat(methodPart.replace(/\..*$/, "").slice(method.length))
      .map(p => p.replace(/\[([^\]]+)\]/g, ":$1"))    // [id] -> :id
      .join("/");

    return { method, route, file };
  });
}
