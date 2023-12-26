// example.d.ts
declare module 'decode' {
  interface Decode {
    decode(data: Buffer, encoding?: string): any;
  }

  const decode: Decode;
  export = decode;
}
