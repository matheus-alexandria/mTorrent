import fs from 'node:fs';
import { getPeers } from './tracker';
import { decode } from './utils/decode.js';

const torrent = decode(fs.readFileSync('puppy.torrent'), 'utf8');

getPeers(torrent, (peers) => {
  console.log('list of peers: ', peers);
})