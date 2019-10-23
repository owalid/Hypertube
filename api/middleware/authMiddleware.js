import { veriftoken } from "../utils/checkJwt";

export const authMiddleware = (req, res, next) => {
    if (typeof req.headers.token === 'undefined' || req.headers.token === null) {
        res.status(500).json({ error: "error no token" });
    } else {
        if (veriftoken(req.headers.token)) {
            next();
        } else {
            res.status(200).json({ error: "token expired" })
        }
    }
}