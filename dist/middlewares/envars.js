import fs from 'fs';
import path from 'path';
export function loadEnv() {
    try {
        const envdata = fs.readFileSync(path.join(process.cwd(), ".env"), { encoding: 'utf8' });
        const envfields = envdata.split(/\r?\n/);
        envfields.forEach((f) => {
            const [key, val] = f.split("=");
            if (key && val)
                process.env[key.trim()] = val.trim();
        });
        console.log("✅ Env loaded!");
    }
    catch (e) {
        console.error("❌ Failed to load .env:", e);
    }
}
export function envars() {
    return (req, res, next) => {
        loadEnv();
        next();
    };
}
