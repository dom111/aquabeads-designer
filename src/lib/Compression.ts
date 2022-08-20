// This reduces the hash length by ~80%
// see: https://developer.mozilla.org/en-US/docs/Web/API/Compression_Streams_API
// TODO: poly/ponyfill
export class Compression {
  static compress(
    data: string,
    encoding: string = 'deflate'
  ): Promise<Uint8Array> {
    const byteArray = new TextEncoder().encode(data),
      // @ts-ignore
      cs = new CompressionStream(encoding),
      writer = cs.writable.getWriter();

    writer.write(byteArray);
    writer.close();

    return new Response(cs.readable)
      .arrayBuffer()
      .then((data) => new Uint8Array(data));
  }

  static decompress(
    byteArray: ArrayBuffer,
    encoding: string = 'deflate'
  ): Promise<string> {
    // @ts-ignore
    const cs = new DecompressionStream(encoding),
      writer = cs.writable.getWriter();

    writer.write(byteArray);
    writer.close();

    return new Response(cs.readable)
      .arrayBuffer()
      .then((arrayBuffer) => new TextDecoder().decode(arrayBuffer));
  }

  static isAvailable(): boolean {
    return 'CompressionStream' in window && 'DecompressionStream' in window;
  }
}

export default Compression;
