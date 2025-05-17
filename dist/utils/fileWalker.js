import fs from 'fs';
import path from 'path';
export const walk = async (dir) => {
    let files = [];
    for (const entry of await fs.promises.readdir(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            files = files.concat(await walk(fullPath));
        }
        else {
            files.push(fullPath);
        }
    }
    return files;
};
