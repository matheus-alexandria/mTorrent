import fs from 'fs';
import { decode } from './decode.js';

const torrent = decode(fs.readFileSync('puppy.torrent'), 'utf8');
console.log(torrent.announce.toString('utf8'));