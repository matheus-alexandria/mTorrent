import fs from 'fs';
// import decode from './decode.js';

const torrent = fs.readFileSync('puppy.torrent');
console.log(torrent.toString('utf8'));

// const torrent = decode(fs.readFileSync('puppy.torrent'), 'utf8');
// console.log(torrent.announce.toString('utf8'));