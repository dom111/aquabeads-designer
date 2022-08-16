import Element, { onEach, h, t } from './Element';
import Board from './Board';
import State from './State';

export class Actions extends Element {
  constructor(board: Board, state: State) {
    super('section.actions');

    const clear = h('button.clear[title="Clear"]', t('♻'));

    onEach(clear, ['mousedown', 'touchstart'], () => {
      board.clear();
      window.location.hash = '';
    });

    const link = h('button.link[title="Generate link"]', t('🔗'));

    onEach(
      link,
      ['mousedown', 'touchstart'],
      () => (window.location.hash = '#' + state.toString())
    );

    this.append(clear, link);
  }
}

export default Actions;
