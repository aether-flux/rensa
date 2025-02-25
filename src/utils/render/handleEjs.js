import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

export function renderEjs (filePath, data, callback) {
  fs.readFile(filePath, "utf8", (err, fileContent) => {
    if (err) return callback(err);

    const renderedHtml = ejs.render(fileContent, data);
    callback(null, renderedHtml);
  })
}
