import movieController from '../controllers/movieController'
import { Router } from 'express';

export const movieRouter = Router();

movieRouter.post('/', async (req, res) => movieController.getMovies(req, res));
movieRouter.post('/getSuggestions', async (req, res) => movieController.getSuggestions(req, res));
movieRouter.get('/movie/:id', async (req, res) => movieController.getMovie(req, res));
movieRouter.get('/movieImdb/:imdbcode', async (req, res) => movieController.getMovieImdb(req, res));
movieRouter.post('/comment', async (req, res) => movieController.postComment(req, res));
movieRouter.post('/updateLastViewed', async (req, res) => movieController.updateLastViewed(req, res));
