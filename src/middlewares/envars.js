import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export function envars () {
  return (req, res, next) => {
    try {
      const envdata = fs.readFileSync(path.join(process.cwd(), ".env"), { encoding: 'utf8' });
      const envfields = envdata.split("\n");
      
      envfields.forEach((f) => {
        let items = f.split("=");
        process.env[items[0]] = items[1];
      });

      next();
    } catch (e) {
      console.error("Error parsing .env: ", e);
      next();
    }
  }
}
