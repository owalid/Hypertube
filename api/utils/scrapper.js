import axios from 'axios';
import { cologn, colog } from './color';
import { Movie } from '../models/movieModel';
import { connectDb } from '../config/database';

const scrapYTS = async () => {
  let movies = [];
  for (let i = 1; i < 10; i++) {
    try {
      const res = await axios.get(`https://yts.lt/api/v2/list_movies.json?limit=50&page=${i}`);
      movies.push(...res.data.data.movies);
      cologn(' ', 'white', 'lgray');
    } catch (err) {
      colog(`Error : Failed to retrieve data from YTS api \n ${err}`, 'black', 'red');
    }
  }
  // Serialize data for movie model
  const serializeMovies = movies.map(movie => {
    let torrents = [];
    for (const index in movie.torrents) {
      torrents.push({
        url: movie.torrents[index].url,
        hash: movie.torrents[index].hash,
        quality: movie.torrents[index].quality,
        seeds: movie.torrents[index].seeds,
        peers: movie.torrents[index].peers,
        size: movie.torrents[index].size,
        size_bytes: movie.torrents[index].size_bytes,
        date_uploaded: movie.torrents[index].date_uploaded
      });
    }
    if (movie.large_cover_image && movie.background_image) {
      return ({
        imdb_code: movie.imdb_code,
        title: movie.title.toLowerCase(),
        year: movie.year,
        rating: movie.rating,
        trailer: (movie.yt_trailer_code) ? `http://youtube.com/watch?${movie.yt_trailer_code}` : null,
        genres: movie.genres,
        synopsis: movie.synopsis,
        lastViewed: null,
        torrents: torrents,
        thumbview: movie.large_cover_image,
        background: movie.background_image,
        source: {
          name: 'YTS',
          id: movie.id
        }
      });
    }
  });
  colog(`\nMovies added : ${serializeMovies.length}`, 'lgray');
  return (serializeMovies);
}

const scrapPopcorn = async () => {
  let movies = [];
  for (let i = 1; i < 10; i++) {
    try {
      const res = await axios.get(`https://tv-v2.api-fetch.website/movies/${i}`);
      movies.push(...res.data);
      cologn(' ', 'white', 'lgray');
    } catch (err) {
      colog(`Error : Failed to retrieve data from YTS api \n ${err}`, 'black', 'red');
    }
  }
  // Serialize data for movie model
  const serializeMovies = movies.map(movie => {
    let torrents = [];
    for (let language in movie.torrents) {
      for (let quality in movie.torrents[language]) {
        torrents.push({
          url: movie.torrents[language][quality].url,
          hash: null,
          quality: quality,
          seeds: movie.torrents[language][quality].seed,
          peers: movie.torrents[language][quality].peer,
          size: movie.torrents[language][quality].size,
          size_bytes: null,
          date_uploaded: null
        });
      }
    }
    if (movie.images.poster && movie.images.banner) {
      return ({
        imdb_code: movie.imdb_id,
        title: movie.title.toLowerCase(),
        year: movie.year,
        rating: movie.rating.percentage / 10,
        trailer: (movie.trailer) ? movie.trailer : null,
        genres: movie.genres,
        synopsis: movie.synopsis,
        lastViewed: null,
        torrents,
        thumbview: movie.images.poster,
        background: movie.images.banner,
        source: {
          name: 'Popcorn',
          id: null
        }
      });
    }
  });
  colog(`\nMovies added : ${serializeMovies.length}`, 'lgray');
  return (serializeMovies);
};

const scrapMovies = async () => {
  try {
    colog('Start to scrap databases', 'lgray');
    const ytsMovies = await scrapYTS();
    const popMovies = await scrapPopcorn();
    const movies = ytsMovies.concat(popMovies);
    let feed = [];
    movies.map(movie => {
      for (let i = 0; i < feed.length; i++) {
        if (!movie.imdb_code) return null;
        if (feed[i].imdb_code === movie.imdb_code) {
          feed[i].torrents = [
              ...movie.torrents,
              ...feed[i].torrents,
          ]
          return null
        }
      }
      feed.push(movie);
    });
    await Movie.insertMany(feed);
  } catch (err) {
    colog('Error : ' + err, ' black', 'red');
  }
};

connectDb();
scrapMovies();