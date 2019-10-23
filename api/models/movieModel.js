import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const MovieSchema = new Schema({
  imdb_code: String,
  title: String,
  year: Number,
  rating: Number,
  trailer: String,
  genres: Array,
  synopsis: String,
  lastViewed: Date,
  thumbview: String,
  background: String,
  source: {
    name: String,
    id: Number,
  },
  torrents: Array({
    url: String,
    hash: String,
    quality: String,
    seeds: Number,
    Peers: Number,
    size: String,
    size_bytes: Number,
    date_uploaded: Date,
  }),
  comments: Array({
    uid: String,
    picture: String,
    username: String,
    comment: String,
    dateComment: Date
  })
});

export const Movie = mongoose.model("Movie", MovieSchema);