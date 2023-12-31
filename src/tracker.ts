import dgram from "node:dgram";
import crypto from "node:crypto";
import { infoHash, size } from "./torrentParser";
import { generateId } from "./utils/generateId.js";

export function getPeers(torrent: any, callback: (peers: Peer[]) => any) {
  const socket = dgram.createSocket("udp4");
  const url: string = torrent.announce.toString("utf8");

  udpSend(socket, buildConnRequest(), url);

  socket.on("message", (response) => {
    console.log(response);
    if (respType(response) === "connect") {
      const connResp = parseConnResponse(response);

      const announceReq = buildAnnounceReq(connResp.connectionId, torrent);
      udpSend(socket, announceReq, url);
    } else if (respType(response) === "announce") {
      const announceResp = parseAnnounceResp(response);
      callback(announceResp.peers);
    }
  });
}

function udpSend(
  socket: dgram.Socket,
  message: Buffer,
  rawUrl: string,
  callback = (err: any) => { console.log(err) }
) {
  const url = new URL(rawUrl);
  console.log(message);
  socket.send(message, 0, message.length, Number(url.port), url.host, callback);
}

function respType(resp: Buffer): string {
  const action = resp.readUInt32BE(0);
  if (action === 0) return "connect";
  if (action === 1) return "announce";
  return "";
}

function buildConnRequest(): Buffer {
  const buf = Buffer.alloc(16);

  buf.writeBigUInt64BE(BigInt(0x41727101980), 0);

  buf.writeUInt32BE(0, 8);

  crypto.randomBytes(4).copy(buf, 12);

  return buf;
}

function parseConnResponse(response: Buffer): parseConnResponseResult {
  return {
    action: response.readUint32BE(0),
    transactionId: response.readUint32BE(4),
    connectionId: response.subarray(8),
  };
}

function buildAnnounceReq(connId: Buffer, torrent: any, port = 6881): Buffer {
  const buf = Buffer.allocUnsafe(98);

  // connection id
  connId.copy(buf, 0);
  // action
  buf.writeUInt32BE(1, 8);
  // transaction id
  crypto.randomBytes(4).copy(buf, 12);
  // info hash
  infoHash(torrent).copy(buf, 16);
  // peerId
  generateId().copy(buf, 36);
  // downloaded
  Buffer.alloc(8).copy(buf, 56);
  // left
  size(torrent).copy(buf, 64);
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

function parseAnnounceResp(resp: Buffer): parseAnnounceResponseResult {
  function group(iterable: Buffer, groupSize: number): Buffer[] {
    let groups: Buffer[] = [];
    for (let i = 0; i < iterable.length; i += groupSize) {
      groups.push(iterable.subarray(i, i + groupSize));
    }
    return groups;
  }

  return {
    action: resp.readUInt32BE(0),
    transactionId: resp.readUInt32BE(4),
    leechers: resp.readUInt32BE(8),
    seeders: resp.readUInt32BE(12),
    peers: group(resp.subarray(20), 6).map((address) => {
      return {
        ip: address.subarray(0, 4).join("."),
        port: address.readUInt16BE(4),
      };
    }),
  };
}

type parseConnResponseResult = {
  action: number;
  transactionId: number;
  connectionId: Buffer;
};

type parseAnnounceResponseResult = {
  action: number;
  transactionId: number;
  leechers: number;
  seeders: number;
  peers: Peer[];
};

type Peer = {
  ip: string;
  port: number;
};
