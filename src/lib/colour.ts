export type RGB = [number, number, number];

export const rgbToHex = ([r, g, b]: RGB): string =>
  '#' + (r * 256 ** 2 + g * 256 + b).toString(16).padStart(6, '0');

export const hexToRgb = (hex: string): RGB =>
  hex
    .slice(1)
    .match(/../g)
    .map((chunk) => parseInt(chunk, 16)) as RGB;

const brightnessCache: { [key: string]: number } = {};

// from https://www.nbdtech.com/Blog/archive/2008/04/27/Calculating-the-Perceived-Brightness-of-a-Color.aspx
export const perceivedBrightness = (hex: string): number => {
  if (!(hex in brightnessCache)) {
    const [r, g, b] = hexToRgb(hex);

    brightnessCache[hex] = Math.floor(
      Math.sqrt(r * r * 0.241 + g * g * 0.691 + b * b * 0.068)
    );
  }

  return brightnessCache[hex];
};
