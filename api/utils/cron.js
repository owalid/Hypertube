import { Movie } from '../models/movieModel';
import * as cp from 'child_process';


export const deleteMovieCron = async () => {
    const k = cp.spawn('bash');
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    const movies = await Movie.find({ lastViewed: { "$lt": date } });
    movies.map(async (value) => {
        value.torrents.map((v) => {
            k.stdin.end(`rm -rf "./tmp/${v.hash}"`);
        })
    })
}