import fs from 'fs';
import decode from './decode.js';

const torrent = decode(fs.readFileSync('puppy.torrent'));
console.log(torrent.announce.toString('utf8'));