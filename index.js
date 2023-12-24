const fs = require('fs');
const { decode } = require('./decode');

const torrent = bencode.decode(fs.readFileSync('puppy.torrent'));
console.log(torrent.announce.toString('utf8'));