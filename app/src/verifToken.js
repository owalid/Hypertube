const jwt = require('jsonwebtoken')

require('dotenv').config();

export const veriftoken = (token) => {
    if (!token) { return false; }
    return jwt.verify(token, process.env.VUE_APP_JWT_SECRET, (err, decoded) => {
        return (err) ? false : true
    });
}

export const decodeToken = (token) => {
    return (jwt.verify(
        token,
        process.env.VUE_APP_JWT_SECRET
    ));
}
