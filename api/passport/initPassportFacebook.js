import FacebookStrategy from 'passport-facebook';
import { User } from '../models/userModel';
import { tokenforOAuth } from '../utils/tokenForOauth';


require('dotenv').config();
let fbstrat = FacebookStrategy.Strategy;

export const initPassportFacebook = new fbstrat({
  clientID: process.env.FB_API_KEY,
  clientSecret: process.env.FB_API_SECRET,
  callbackURL: process.env.FB_CALLBACK_URI,
  profileFields: ['id', 'emails', 'name', 'picture.type(large)']
},
  async (accessToken, refreshToken, profile, done) => {
    const user = await User.findOne({ strategyId: profile.id, strategy: profile.provider });
    if (user && user._id != '') {
      const token = tokenforOAuth(user);
      return done(null, token)
    } else {
      let picture = profile.photos[0].value;
      let firstname = profile._json.first_name;
      let lastname = profile._json.last_name;
      let email = profile._json.email;
      let strategyId = profile.id;
      let strategy = profile.provider;
      let username = firstname.charAt(0) + lastname.slice(1, 7);
      let i = 0;
      while (await User.findOne({ username })) {
        username = `${username}${i.toString}`;
        i++;
      }
      const newb = new User({
        strategyId, strategy, firstname, username, lastname, picture, email
      });
      await User.collection.insertOne(newb);
      const token = tokenforOAuth(newb);
      return done(null, token)
    }
  });