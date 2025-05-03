import fs from 'fs';
import ejs from 'ejs';
export function renderEjs(filePath, data, callback) {
    fs.readFile(filePath, "utf8", (err, fileContent) => {
        if (err)
            return callback(err);
        try {
            const renderedHtml = ejs.render(fileContent, data);
            callback(null, renderedHtml);
        }
        catch (renderErr) {
            callback(renderErr);
        }
    });
}
