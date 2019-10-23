import { Strategy as intraStrat} from 'passport-42';
import { User } from '../models/userModel';
import { tokenforOAuth } from '../utils/tokenForOauth';

require('dotenv').config();

export const initPassportIntra = new intraStrat({
    clientID: (process.env.NODE_ENV === "prod") ? process.env.INTRA_API_KEY_PROD : process.env.INTRA_API_KEY_DEV,
    clientSecret: (process.env.NODE_ENV === "prod") ? process.env.INTRA_API_SECRET_PROD : process.env.INTRA_API_SECRET_DEV,
    callbackURL: (process.env.NODE_ENV === "prod") ? process.env.INTRA_CALLBACK_URI_PROD : process.env.INTRA_CALLBACK_URI_DEV
},
async (req, accessToken, refreshToken, profile, done) => {
    const { id, email, login, first_name, last_name, image_url} = profile._json;
    const user = await User.findOne({ strategyId: id, strategy: profile.provider });
    if (user && user._id != '') {
        const token = tokenforOAuth(user);
        return done(null, token)
    } else {
        let picture = image_url;
        let username = login;
        let firstname = first_name;
        let lastname = last_name;
        let strategyId = id
        let strategy = profile.provider
        const newb = new User({
            username, strategyId, strategy, firstname, lastname, picture, email
        });
        await User.collection.insertOne(newb);
        const token = tokenforOAuth(newb);
        return done(null, token)
    }
  });