import { Movie } from '../models/movieModel';
import mongoose from 'mongoose';
import { verifParams } from '../utils/verifParams';

const getMovies = async (req, res) => {
  try {
    const { keywords, page, ratings, years, genre } = req.body;
    let where;
    if (keywords !== '') {
      where = [{
        $match: {
          title: { $regex: keywords.toLowerCase() }
        }
      },
      { $sort: {title: 1}},
      { $limit: 1 * 30 },
      { $skip: 30 * (page - 1) }
      ];
    } else if (genre !== '') {
      where = [{
        $match: {
          year: { $gte: years[0], $lte: years[1] },
          rating: { $gte: ratings[0], $lte: ratings[1] },
          genres: { $regex: genre }
        }
      },
      { $sort: {title: 1}},
      { $limit: page * 30 },
      { $skip: 30 * (page - 1) }
      ];
    } else {
      where = [{
        $match: {
          year: { $gte: years[0], $lte: years[1] },
          rating: { $gte: ratings[0], $lte: ratings[1] },
        }
      },
      { $sort: {title: 1}},
      { $limit: page * 30 },
      { $skip: 30 * (page - 1) }
      ];
    }
    const movies = await Movie.aggregate(where);
    res.status(200).json({ success: true, movies });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: `Internal server error: ${err}` });
  }
};

const getSuggestions = async (req, res) => {
  try {
    const news = await Movie.aggregate([{
      $match: {
        year: { $gte: 2019 },
      }
    },
    { $limit: 15 },
    ]);
    const popular = await Movie.aggregate([{
      $match: {
        rating: { $gte: 8 },
      }
    },
    { $limit: 15 },
    ]);
    const bookmarks = await Movie.find({
      _id: { $in: req.body.bookmarks }
    });
    res.status(200).json({ success: true, news, popular, bookmarks });
  } catch (err) {
    res.status(500).json({ message: `Internal server error: ${err}` });
  }
};

const getMovie = async (req, res) => {
  if (verifParams(req.params, 1)) {
    try {
      const { id } = req.params;
      if (mongoose.Types.ObjectId.isValid(id)) {
        const movie = await Movie.findOne({ _id: mongoose.Types.ObjectId(id) });
        if (movie) {
          res.status(200).json({ success: true, movie: movie });
        } else {
          res.status(200).json({ success: true, movie: "no movie" });
        }
      } else {
        res.status(200).json({ success: true, movie: "no movie" });
      }
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  } else {
    res.status(500).json({ message: 'error params' });
  }
};

const getMovieImdb = async (req, res) => {
  if (verifParams(req.params, 1)) {
    try {
      const { imdbcode } = req.params;
      const movie = await Movie.findOne({ imdb_code: imdbcode });
      res.status(200).json({ success: true, movie: movie });
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  } else {
    res.status(500).json({ message: 'error params' });
  }
};

const postComment = async (req, res) => {
  if (verifParams(req.body, 6)) {
    try {
      const { id, uid, picture, username, comment, dateComment } = req.body;
      await Movie.findOneAndUpdate(
        { _id: id },
        {
          $push: {
            comments:
              [{ uid, picture, username, comment, dateComment }]
          }
        });
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}` });
    }
  } else {
    res.status(500).json({ message: 'error params' });
  }
}

const updateLastViewed = async (req, res) => {
  if (verifParams(req.body, 1)) {
    try {
      const { id } = req.body;
      if (mongoose.Types.ObjectId.isValid(id)) {
      await Movie.findOneAndUpdate(
        { _id: id },
        { $set: { lastViewed: new Date() } }
      );
    }
      res.status(200).json({ success: true });
    } catch (err) {
      res.status(500).json({ message: `Internal server error: ${err}`});
    }
  } else {
    res.status(500).json({ message: 'error params' });
  }
}

export default {
  getMovies,
  getMovie,
  postComment,
  getSuggestions,
  updateLastViewed,
  getMovieImdb
}