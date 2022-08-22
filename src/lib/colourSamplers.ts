import { perceivedBrightness, rgbToHex } from './colour';
import { ColourSampler } from './ImageToGridData';

const colourSampler =
  (sort: ([aHex, aFrequency], [bHex, bFrequency]) => number): ColourSampler =>
  ({ data }): string => {
    const colours: { [key: string]: number } = {};

    for (let i = 0, end = data.length; i < end; i += 4) {
      const isTransparent = data[i + 3] === 0,
        hex = isTransparent
          ? 'transparent'
          : rgbToHex([data[i], data[i + 1], data[i + 2]]);

      if (!(hex in colours)) {
        colours[hex] = 0;
      }

      colours[hex]++;
    }

    const [chosen] = Object.entries(colours).sort(sort);

    return chosen[0];
  };

export const brighterAndDarker: ColourSampler = colourSampler(
  ([aHex, a], [bHex, b]) =>
    (bHex === 'transparent' ? 0 : Math.abs(perceivedBrightness(bHex) - 127)) -
    (aHex === 'transparent' ? 0 : Math.abs(perceivedBrightness(aHex) - 127))
);

export const brightest: ColourSampler = colourSampler(
  ([aHex, a], [bHex, b]) =>
    (bHex === 'transparent' ? 0 : perceivedBrightness(bHex)) -
    (aHex === 'transparent' ? 0 : perceivedBrightness(aHex))
);

export const darkest: ColourSampler = colourSampler(
  ([aHex, a], [bHex, b]) =>
    (aHex === 'transparent' ? 255 : perceivedBrightness(aHex)) -
    (bHex === 'transparent' ? 255 : perceivedBrightness(bHex))
);

export const highestFrequency: ColourSampler = colourSampler(
  ([aHex, a], [bHex, b]) =>
    b - a ||
    (aHex === 'transparent' ? 0 : perceivedBrightness(aHex)) -
      (bHex === 'transparent' ? 0 : perceivedBrightness(bHex))
);
