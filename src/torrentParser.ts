import fs from 'node:fs';
import { createHash } from 'node:crypto';
import { decode } from './libs/decode';
import { encode } from './libs/encode';

export function open(filePath: string) {
  return decode(fs.readFileSync(filePath), 'utf8');
}

export function infoHash(torrent: any) {
  const info = encode(torrent.info);
  return createHash('sha1').update(info).digest();
}

export function size(torrent: Record<string, any>): Buffer {
  const size = torrent.info.files ?
    torrent.info.files.map((file: Buffer) => file.length).reduce((a: number, b: number) => a + b) :
    torrent.info.length;

  const buf = Buffer.alloc(8);
  buf.writeBigInt64BE(BigInt(size));

  return buf;
}
