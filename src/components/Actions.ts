import Board from './Board';
import Clear from './Actions/Clear';
import Element from './Element';
import GenerateLink from './Actions/GenerateLink';
import ImportImage from './Actions/ImportImage';
import Print from './Actions/Print';
import Share from './Actions/Share';
import State from '../lib/State';

export class Actions extends Element {
  constructor(board: Board, state: State) {
    super('section.actions');

    const clear = new Clear(board),
      link = new GenerateLink(state),
      print = new Print(),
      image = new ImportImage(board, state),
      share = new Share(state);

    this.append(clear, link, print, image);

    if (navigator.share) {
      this.append(share);
    }
  }
}

export default Actions;
