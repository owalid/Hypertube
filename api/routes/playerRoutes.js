import { Router } from 'express';
import playerController from '../controllers/playerController';
import { authMiddleware } from '../middleware/authMiddleware';

export const playerRouter = Router();

playerRouter.get('/player/:hash', async (req, res) => playerController.downloadTorrent(req, res));
playerRouter.post('/subtitle', (authMiddleware), async (req, res) => await playerController.getSubtitle(req, res));