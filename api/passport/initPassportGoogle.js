import GoogleStrategy from 'passport-google-oauth2';
import { User } from '../models/userModel';
import { tokenforOAuth } from '../utils/tokenForOauth';

require('dotenv').config();
let googleStrat = GoogleStrategy.Strategy;

export const initPassportGoogle = new googleStrat({
    clientID: (process.env.NODE_ENV === "prod") ? process.env.GOOGLE_API_KEY_PROD : process.env.GOOGLE_API_KEY_DEV,
    clientSecret: (process.env.NODE_ENV === "prod") ? process.env.GOOGLE_API_SECRET_PROD : process.env.GOOGLE_API_SECRET_DEV,
    callbackURL: (process.env.NODE_ENV === "prod") ? process.env.GOOGLE_CALLBACK_URI_PROD : process.env.GOOGLE_CALLBACK_URI_DEV,
    scope: 'email:profile'
},
async (accessToken, refreshToken, profile, done) => {
    const user = await User.findOne({ strategyId: profile.id, strategy: profile.provider });
    if (user && user._id != '') {
        const token = tokenforOAuth(user);
        return done(null, token)
    } else {
        let picture = profile.photos[0].value;
        let firstname = profile.given_name;
        let lastname = profile.family_name;
        let email = profile._json.email
        let strategyId = profile.id
        let strategy = profile.provider
        let confirmed = profile.verified;
        let username = firstname.charAt(0) + lastname.slice(1, 7);
        let i = 0;
        while (await User.findOne({ username })) {
          username = `${username}${i.toString}`;
          i++;
        }
        const newb = new User({
            confirmed, strategyId, strategy, username, firstname, lastname, picture, email
        });
        await User.collection.insertOne(newb);
        const token = tokenforOAuth(newb);
        return done(null, token)
    }
  });