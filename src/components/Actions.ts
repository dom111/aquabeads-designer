import Element, { addEventListeners, h, t } from './Element';
import Board from './Board';

export class Actions extends Element {
  constructor(board: Board) {
    super('section.actions');

    const clear = h('button.clear', t('♻'));

    addEventListeners(clear, ['mousedown', 'touchstart'], () => board.clear());

    this.append(clear);
  }
}

export default Actions;
