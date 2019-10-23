import jwt from 'jsonwebtoken';

require('dotenv').config();
export const veriftoken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        return (err) ? false : true
    });
}
