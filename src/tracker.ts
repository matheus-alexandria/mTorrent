import dgram from 'node:dgram';
import crypto from 'node:crypto';
import { decode } from './utils/decode.js';

export function getPeers(torrent: any, callback: (peers: any) => any) {
  const socket = dgram.createSocket('udp4');
  const url: string = torrent.announce.toString('utf8');

  udpSend(socket, buildConnReq(), url);

  socket.on('message', response => {
    if (respType(response) === 'connect') {
      const connResp = parseConnResp(response);

      const announceReq = buildAnnounceReq(connResp.connectionId);
      udpSend(socket, announceReq, url);
    } else if (respType(response) === 'announce') {
      const announceResp = parseAnnounceResp(response);
      callback(announceResp.peers);
    }
  });
}

function udpSend(socket: dgram.Socket, message: any, rawUrl: string, callback=()=>{}) {
  const url = new URL(rawUrl);
  socket.send(message, Number(url.port), url.host, callback);
}

function respType(resp) {
  // ...
}

function buildConnReq() {
  const buf = Buffer.alloc(16);

  buf.writeUInt32BE(0x417, 0);
  buf.writeUInt32BE(0x27101980, 4);

  buf.writeUInt32BE(0, 8);

  crypto.randomBytes(4).copy(buf, 12);

  return buf;
}

function parseConnResp(resp) {
  // ...
}

function buildAnnounceReq(connId) {
  // ...
}

function parseAnnounceResp(resp) {
  // ...
}