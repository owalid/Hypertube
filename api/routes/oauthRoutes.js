import { Router } from 'express';
import passport from 'passport';

export const oauthRouter = Router();


oauthRouter.get('/authfb', passport.authenticate('facebook', { scope: 'email' }));
oauthRouter.get('/authfb/callback',
  passport.authenticate('facebook', { session: false }),
  (req, res) => {
    res.redirect(`${((process.env.NODE_ENV === "prod") ? process.env.URL_PROD : process.env.URL_DEV)}/loginoauth/${req.user}`);
  });

oauthRouter.get('/authgoogle',
  passport.authenticate('google', {
    scope: ['email', 'profile']
  })
);
oauthRouter.get('/authgoogle/callback',
  passport.authenticate('google', { session: false }),
  (req, res) => {
    res.redirect(`${((process.env.NODE_ENV === "prod") ? process.env.URL_PROD : process.env.URL_DEV)}/loginoauth/${req.user}`);
  });

oauthRouter.get('/authgh', passport.authenticate('github'));
oauthRouter.get('/authgh/callback',
  passport.authenticate('github', { session: false }),
  (req, res) => {
    res.redirect(`${((process.env.NODE_ENV === "prod") ? process.env.URL_PROD : process.env.URL_DEV)}/loginoauth/${req.user}`);
  });

oauthRouter.get('/authintra', passport.authenticate('42'));
oauthRouter.get('/authintra/callback',
  passport.authenticate('42', { session: false }),
  (req, res) => {
    res.redirect(`${((process.env.NODE_ENV === "prod") ? process.env.URL_PROD : process.env.URL_DEV)}/loginoauth/${req.user}`);
  });
