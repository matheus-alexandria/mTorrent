import fs from 'node:fs';
import { decode } from './index/decode.js';

export function open(filePath: string) {
  return decode(fs.readFileSync(filePath), 'utf8');
}