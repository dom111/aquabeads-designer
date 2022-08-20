export class Base64 {
  // from: https://stackoverflow.com/a/66046176/3145856
  public static async encode(data: Uint8Array): Promise<string> {
    // Use a FileReader to generate a base64 data URI
    return (
      new Promise((resolve: (base64Url: string) => any) => {
        const reader = new FileReader();

        reader.addEventListener('load', () => resolve(reader.result as string));

        // initiate the read read
        reader.readAsDataURL(new Blob([data]));
      })
        /**
         * The result looks like
         * "data:application/octet-stream;base64,<your base64 data>",
         * so we split off the beginning:
         */
        .then((base64Url) => base64Url.split(',', 2)[1])
    );
  }

  // from: https://stackoverflow.com/a/54123275/3145856
  public static decode(data: string): Promise<Uint8Array> {
    const dataUrl = `data:application/octet-binary;base64,${data}`;

    return fetch(dataUrl)
      .then((response) => response.arrayBuffer())
      .then((buffer) => new Uint8Array(buffer));
  }
}

export default Base64;
