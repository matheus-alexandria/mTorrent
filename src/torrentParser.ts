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