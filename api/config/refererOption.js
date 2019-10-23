export const refererOption = (req, res, next) => {
    res.setHeader("Set-Cookie", "HttpOnly;Secure;SameSite=Strict");
    if (!req.headers.origin && req.headers.referer) {
        const splitedUrl = req.headers.referer.split('/');
        if (splitedUrl[3] === "movie") {
            req.headers["origin"] = `${splitedUrl[0]}//${splitedUrl[2]}`
        } else {
            req.headers["origin"] = req.headers.referer
        }
    }
    next();
}