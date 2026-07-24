import crypto from "crypto";

const CSRF_COOKIE_NAME = "csrf-token";
const CSRF_HEADER_NAME = "x-csrf-token";

const setCsrfCookie = (res) => {
    const token = crypto.randomUUID();
    res.cookie(CSRF_COOKIE_NAME, token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 24 * 60 * 60 * 1000,
    });
    return token;
};

const csrfProtection = (req, res, next) => {
    const safeMethods = ["GET", "HEAD", "OPTIONS"];

    if (safeMethods.includes(req.method)) {
        if (!req.cookies || !req.cookies[CSRF_COOKIE_NAME]) {
            setCsrfCookie(res);
        }
        return next();
    }

    const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];
    const headerToken = req.headers[CSRF_HEADER_NAME];

    if (!cookieToken || !headerToken) {
        return res.status(403).json({ success: false, message: "CSRF token missing" });
    }

    if (cookieToken !== headerToken) {
        return res.status(403).json({ success: false, message: "CSRF token mismatch" });
    }

    next();
};

export { setCsrfCookie };
export default csrfProtection;
