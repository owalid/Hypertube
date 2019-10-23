const jwt = require('jsonwebtoken');

require('dotenv').config();

export const tokenforOAuth = (user) => {
    const timestamp = new Date().getTime();
    return jwt.sign({
        uid: user._id, firstname: user.firstname, username: user.username || "", lang: user.lang || 'us',
        lastname: user.lastname, email: user.email, picture: user.picture, follows: user.follows || [],
        bookmarks: user.bookmarks || [], strategy: user.strategy, iat: timestamp
    },
        process.env.JWT_SECRET, { expiresIn: '4h' });
}
