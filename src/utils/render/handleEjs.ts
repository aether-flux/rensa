import fs from 'fs';
import path from 'path';
import ejs from 'ejs';

export function renderEjs (filePath: string, data: Record<string, any>, callback: (err: NodeJS.ErrnoException | null, html?: string) => void): void {
  fs.readFile(filePath, "utf8", (err, fileContent) => {
    if (err) return callback(err);

    try {
      const renderedHtml = ejs.render(fileContent, data);
      callback(null, renderedHtml);
    } catch (renderErr) {
      callback(renderErr as NodeJS.ErrnoException);
    }
  })
}
