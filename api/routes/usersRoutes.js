import { Router } from 'express';
import userController from '../controllers/userController';

export const userRouter = Router();

userRouter.post('/follow', async (req, res) => userController.follow(req, res));
userRouter.post('/uploadAvatar', async (req, res) => userController.uploadAvatar(req, res));
userRouter.post('/updateNames', async (req, res) => userController.updateNames(req, res));
userRouter.post('/updateEmailReq', async (req, res) => userController.updateEmailReq(req, res));
userRouter.post('/updateEmail', async (req, res) => userController.updateEmail(req, res));
userRouter.post('/updateBookmark', async (req, res) => userController.updateBookmark(req, res));
userRouter.post('/updatePassword', async (req, res) => userController.updatePassword(req, res));
userRouter.post('/updateLang', async (req, res) => userController.updateLang(req, res));
userRouter.post('/updateList', async (req, res) => userController.updateList(req, res));
userRouter.get('/getUserDetails/:id', async (req, res) => userController.getUserDetails(req, res));
userRouter.post('/getFollowsDetails', async (req, res) => userController.getFollowsDetails(req, res));
