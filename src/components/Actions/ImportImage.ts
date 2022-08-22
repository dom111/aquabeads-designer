import Element, { h, t } from '../Element';
import {
  brighterAndDarker,
  brightest,
  darkest,
  highestFrequency,
} from '../../lib/colourSamplers';
import Board from '../Board';
import ImageToGridData from '../../lib/ImageToGridData';
import State from '../../lib/State';
import { TOTAL_RECENT_COLOURS } from '../Picker';

export class ImportImage extends Element {
  constructor(board: Board, state: State) {
    super(
      'span.import-image-wrapper',
      h('button.import-image[title="Import image"][tabindex="-1"]', t('🖼'))
    );

    const imageInput = h<HTMLInputElement>(
      'input[type="file"][accept="image/*"]'
    );

    this.onEach(['mousedown', 'touchstart'], () => imageInput.click());

    imageInput.addEventListener('change', async () => {
      const [file] = imageInput.files;

      if (!file.type.match(/image/)) {
        // TODO: alert the user
        return;
      }

      ImageToGridData.processFile(file, state.board(), brighterAndDarker).then(
        (colours) => {
          const entries = [],
            lookup = [],
            frequency: { [key: string]: number } = {};

          imageInput.value = '';

          colours.forEach((colour, index) => {
            if (!lookup.includes(colour)) {
              lookup.push(colour);
            }

            entries.push(lookup.indexOf(colour));

            if (!(colour in frequency)) {
              frequency[colour] = 0;
            }

            frequency[colour]++;
          });

          state
            .toString({
              board: state.board(),
              entries,
              lookup,
              palette: Object.entries(frequency)
                .sort(([, a], [, b]) => a - b)
                .map(([hex]) => hex)
                .slice(0, TOTAL_RECENT_COLOURS),
            })
            .then((stateString) => (window.location.hash = '#' + stateString));
        }
      );
    });

    this.append(imageInput);
  }
}

export default ImportImage;
