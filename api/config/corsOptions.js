const whitelist = ['http://localhost:8080', 'http://localhost:8080/store', 'http://localhost:5000', 'https://hightube.cf', , 'http://localhost:8080/', 'http://127.0.0.1:8080', 'http://127.0.0.1:5000', 'https://api.intra.42.fr', 'http://localhost:5000/api/player/player/', 'http://localhost:5000'];
export const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }, credentials: true
}
