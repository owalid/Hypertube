import { Router } from 'express'
import { userRouter } from './usersRoutes';
import { authRouter } from './authRoutes';
import { movieRouter } from './moviesRoutes';
import { oauthRouter } from './oauthRoutes';
import {playerRouter} from './playerRoutes';
import { authMiddleware } from '../middleware/authMiddleware';

export const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/oauth', oauthRouter);
apiRouter.use('/player', playerRouter);
apiRouter.use('/movies', (authMiddleware), movieRouter);
apiRouter.use('/users', (authMiddleware), userRouter);
