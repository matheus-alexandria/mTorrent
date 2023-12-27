import fs from 'node:fs';
import dgram from 'node:dgram';
import { decode } from './decode.js';

const torrent = decode(fs.readFileSync('puppy.torrent'), 'utf8');
const url = new URL(torrent.announce.toString('utf8'));

const socket = dgram.createSocket('udp4');

const myMsg = Buffer.from('hi, guys?', 'utf8');

socket.send(myMsg, Number(url.port), url.host, () => {});

socket.on('message', msg => {
  console.log('message is', msg);
});