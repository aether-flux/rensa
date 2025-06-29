import fs from 'fs';
import path from 'path';
import { errorHandler } from '../utils/errorHandler.js';
export function loadEnv(file) {
    try {
        const envFilePath = file ? path.join(process.cwd(), file) : path.join(process.cwd(), ".env");
        const envdata = fs.readFileSync(envFilePath, { encoding: 'utf8' });
        const envfields = envdata.split(/\r?\n/);
        envfields.forEach((f) => {
            const [key, val] = f.split("=");
            if (key && val)
                process.env[key.trim()] = val.trim();
        });
    }
    catch (e) {
        errorHandler(e);
    }
}
