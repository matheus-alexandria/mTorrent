import dgram from 'node:dgram';
import crypto from 'node:crypto';
import { decode } from './utils/decode.js';

export function getPeers(torrent: any, callback: (peers: any) => any) {
  const socket = dgram.createSocket('udp4');
  const url: string = torrent.announce.toString('utf8');

  udpSend(socket, buildConnRequest(), url);

  socket.on('message', response => {
    if (respType(response) === 'connect') {
      const connResp = parseConnResponse(response);

      const announceReq = buildAnnounceReq(connResp.connectionId);
      udpSend(socket, announceReq, url);
    } else if (respType(response) === 'announce') {
      const announceResp = parseAnnounceResp(response);
      callback(announceResp.peers);
    }
  });
}

function udpSend(socket: dgram.Socket, message: Buffer, rawUrl: string, callback=()=>{}) {
  const url = new URL(rawUrl);
  socket.send(message, Number(url.port), url.host, callback);
}

function respType(resp) {
  // ...
}

function buildConnRequest(): Buffer {
  const buf = Buffer.alloc(16);

  // buf.writeBigUInt64BE(BigInt(0x41727101980), 0)

  buf.writeUInt32BE(0x417, 0);
  buf.writeUInt32BE(0x27101980, 4);

  buf.writeUInt32BE(0, 8);

  crypto.randomBytes(4).copy(buf, 12);

  return buf;
}

function parseConnResponse(response: Buffer): parseConnResponseResult {
  return {
    action: response.readUint32BE(0),
    transactionId: response.readUint32BE(4),
    connectionId: response.subarray(8)
  }
}

function buildAnnounceReq(connId: Buffer) {
  const buf = Buffer.allocUnsafe(98);

  // connection id
  connId.copy(buf, 0);
  // action
  buf.writeUInt32BE(1, 8);
  // transaction id
  crypto.randomBytes(4).copy(buf, 12);
  // info hash
  torrentParser.infoHash(torrent).copy(buf, 16);
  // peerId
  util.genId().copy(buf, 36);
  // downloaded
  Buffer.alloc(8).copy(buf, 56);
  // left
  torrentParser.size(torrent).copy(buf, 64);
  // uploaded
  Buffer.alloc(8).copy(buf, 72);
  // event
  buf.writeUInt32BE(0, 80);
  // ip address
  buf.writeUInt32BE(0, 80);
  // key
  crypto.randomBytes(4).copy(buf, 88);
  // num want
  buf.writeInt32BE(-1, 92);
  // port
  buf.writeUInt16BE(port, 96);

  return buf;
}

function parseAnnounceResp(resp) {
  // ...
}

type parseConnResponseResult = {
  action: number; 
  transactionId: number;
  connectionId: Buffer;
}