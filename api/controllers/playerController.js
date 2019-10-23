import torrentStream from 'torrent-stream';
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
import path from 'path';
import fs from 'fs';
import yifysubtitles from '@amilajack/yifysubtitles';
import { verifParams } from '../utils/verifParams';
require('dotenv').config();

const langSub = [
    'sq', 'ar', 'bn', 'pb',
    'bg', 'zh', 'hr', 'cs',
    'da', 'nl', 'en', 'et',
    'fa', 'fi', 'fr', 'de',
    'el', 'he', 'hu', 'id',
    'it', 'ja', 'ko', 'lt',
    'mk', 'ms', 'no', 'pl',
    'pt', 'ro', 'ru', 'sr',
    'sl', 'es', 'sv', 'th',
    'tr', 'ur', 'uk', 'vi'
];

const extPlayer = ['.mp4', '.webm'];

const ext = [
    '.mkv', '.m4a', '.m4v', '.f4v', '.f4a',
    '.m4b', '.m4r', '.f4b', '.mov',
    '.3gp', '.3gp2', '.3g2', '.3gpp',
    '.3gpp2', '.ogg', '.oga', '.ogv',
    '.ogx', '.avi', '.mpg', '.mp2',
    '.mpeg', '.mpe', '.mpv', '.mpg',
    '.mpeg', '.m2v'
];

const isGoodLang = (lang) => {
    return langSub.includes(lang);
}

const isVideo = (extFile) => {
    return ext.includes(extFile);
}

const isStreamable = (extFile) => {
    return extPlayer.includes(extFile);
}

const convertFile = (file, req, res, pathFile) => {
    const fileStream = file.createReadStream();
    const newPathFile = `${pathFile}/${path.parse(file.path).dir}/${path.parse(file.path).name}.mp4`;
    const oldPathFile = `${pathFile}/${file.path}`
    ffmpeg(fileStream)
        .format('mp4')
        .save(newPathFile)
        .on('error', err => {
            console.error('An error occurred: ' + err.message);
        })
        .on('end', () => {
            fs.unlinkSync(oldPathFile); //delete file
        })
    const head = {
        'Content-Length': file.length,
        'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fileStream.pipe(res)
}

const streamTor = async (file, fileSize, req, res) => {
    const range = req.headers.range;
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1]
            ? parseInt(parts[1], 10)
            : fileSize - 1
        const chunksize = (end - start) + 1;
        const fileStream = (typeof file !== "object") ?
            fs.createReadStream(file, { start, end }) : file.createReadStream({ start, end });
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': 'POST, GET, OPTIONS',
        }
        res.writeHead(206, head);
        fileStream.pipe(res);
    }
    else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(file).pipe(res)
    }
}

const downloadTorrent = async (req, res) => {
    if (verifParams(req.params, 1)) {
        let option = {
            connections: 100,
            uploads: 10,
            tmp: './tmp',
            path: `./tmp/${req.params.hash}`,
            verify: true,
            dht: true,
            tracker: true,
        }
        let engine = torrentStream(req.params.hash, option);
        engine.on('ready', () => {
            engine.files.forEach((file) => {
                if (isStreamable(path.extname(file.name))) {
                    file.select();
                    streamTor(file, file.length, req, res);
                } else if (isVideo(path.extname(file.name))) {
                    file.select();
                    convertFile(file, req, res, option.path);
                } else {
                    file.deselect();
                }
            });
        })
        engine.on("download", () => {
            console.log("on downloa...");
        });
    } else {
        res.status(500).json({ message: 'error params' });
    }
}

const getSubtitle = async (req, res) => {
    if (verifParams(req.body, 2)) {
        let { idimdb, lang } = req.body;
        lang = (!isGoodLang(lang) || lang == 'us') ? 'en' : lang;
        const isFolderProd = (process.env.NODE_ENV === 'prod') ? 'dist' : 'src';
        try {
            fs.mkdir(`../app/${isFolderProd}/assets/subtitle`, { recursive: true }, (err) => {
                if (err) throw err;
            });
            const resp = await yifysubtitles(idimdb, { path: `../app/src/assets/subtitle`, langs: ['en', lang], format: "vtt" });
            let err = 0;
            resp.map((k) => {
                if (!fs.existsSync(k.path)) {
                    err = 1;
                }
            })
            if (err === 0) {
                return res.json({ success: true, path: resp }).status(200);
            } else {
                getSubtitle(req, res);
            }

        } catch (error) {
            console.log(error)
            return res.json({ success: true, msg: "no subtitle" }).status(200);
        }
    } else {
        res.status(500).json({ message: 'error params' });
    }
}

export default {
    downloadTorrent,
    getSubtitle
}