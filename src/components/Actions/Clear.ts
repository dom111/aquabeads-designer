import Element, { t } from '../Element';
import Board from '../Board';

export class Clear extends Element {
  constructor(board: Board) {
    super('button.clear[title="Clear"]', t('❌'));

    this.onEach(['mousedown', 'touchstart'], () => {
      board.clear();

      window.location.hash = '';
    });
  }
}

export default Clear;
