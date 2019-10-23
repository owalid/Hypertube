import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import passport from 'passport';
import { corsOptions } from './config/corsOptions';
import { apiRouter } from './routes/index';
import { connectDb } from './config/database';
import { initPassportFacebook } from './passport/initPassportFacebook';
import { initPassportGithub } from './passport/initPassportGh';
import { initPassportGoogle } from './passport/initPassportGoogle';
import { initPassportIntra } from './passport/initPassportIntra';
import { refererOption } from './config/refererOption';
import { excludeOauth } from './utils/exceptCors';
import cron from 'node-cron'
import { deleteMovieCron } from './utils/cron';
require('dotenv').config();

const app = express();

const server = require('http').createServer(app);

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((obj, done) => {
    done(null, obj);
});
passport.use(initPassportFacebook);
passport.use(initPassportGithub);
passport.use(initPassportGoogle);
passport.use(initPassportIntra);

server.listen(process.env.port || process.env.PORT_DEV_SERVER, () => console.log(`Server running on port ${process.env.port || process.env.PORT_DEV_SERVER}`));

connectDb();
console.log(`Server in ${process.env.NODE_ENV} mode`);
cron.schedule('0 1 * * *', async () => {
    await deleteMovieCron();
    console.log("delete")
});
app.all('*', (req, res, next) => refererOption(req, res, next));
app.use(excludeOauth(cors(corsOptions)))
app.use(passport.initialize());
app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.use('/api', apiRouter);
