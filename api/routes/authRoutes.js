import { Router } from 'express';
import userController from '../controllers/userController';

export const authRouter = Router();

authRouter.post('/register', async (req, res) => userController.register(req, res));
authRouter.post('/login', async (req, res) => userController.login(req, res));
authRouter.post('/confirmAccount', async (req, res) => userController.confirmAccount(req, res));
authRouter.post('/resetPassword', async (req, res) => userController.resetPassword(req, res));
authRouter.get('/resetPasswordReq/:email', async (req, res) => userController.resetPasswordReq(req, res));
