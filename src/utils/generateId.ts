import crypto from 'node:crypto';

let id: Buffer | null = null;

export function generateId(): Buffer {
  if (!id) {
    id = crypto.randomBytes(20);
    Buffer.from('-MT0001-').copy(id, 0);
  }
  return id;
};