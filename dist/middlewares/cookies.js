export function cookieParser() {
    return (req, res, next) => {
        const cookies = req.headers.cookie;
        req.cookies = {};
        if (cookies) {
            cookies.split(";").forEach((cookie) => {
                const [key, value] = cookie.trim().split("=");
                req.cookies[key ?? ""] = decodeURIComponent(value);
            });
        }
        next();
    };
}
