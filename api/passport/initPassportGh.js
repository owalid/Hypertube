import { Strategy as ghStrat } from 'passport-github';
import { User } from '../models/userModel';
import { tokenforOAuth } from '../utils/tokenForOauth';

require('dotenv').config();

export const initPassportGithub = new ghStrat({
    clientID: (process.env.NODE_ENV === "prod") ? process.env.GH_API_KEY_PROD : process.env.GH_API_KEY_DEV,
    clientSecret: (process.env.NODE_ENV === "prod") ? process.env.GH_API_SECRET_PROD : process.env.GH_API_SECRET_DEV,
    callbackURL: (process.env.NODE_ENV === "prod") ? process.env.GH_CALLBACK_URI_PROD : process.env.GH_CALLBACK_URI_DEV,
    scope: 'user:email'
},
    async (accessToken, refreshToken, profile, done) => {
        const user = await User.findOne({ strategyId: profile.id, strategy: profile.provider });
        if (user && user._id != '') {
            const token = tokenforOAuth(user);
            return done(null, token)
        } else {
            let picture = profile.photos[0].value;
            let username = profile.username;
            let firstname = username;
            let lastname = username;
            let email = profile.emails[0].value
            let strategyId = profile.id
            let strategy = profile.provider
            const newb = new User({
                strategyId, strategy, firstname, lastname, username, picture, email
            });
            await User.collection.insertOne(newb);
            const token = tokenforOAuth(newb);
            return done(null, token)
        }
    });