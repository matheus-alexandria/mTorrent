import dgram from 'node:dgram';
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
  // ...
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