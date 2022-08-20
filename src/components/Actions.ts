import Board from './Board';
import Element, { onEach, h, t } from './Element';
import State from '../State';

export class Actions extends Element {
  constructor(board: Board, state: State) {
    super('section.actions');

    const clear = h('button.clear[title="Clear"]', t('❌'));

    onEach(clear, ['mousedown', 'touchstart'], () => {
      board.clear();
      window.location.hash = '';
    });

    const link = h('button.link[title="Generate link"]', t('🔗'));

    onEach(link, ['mousedown', 'touchstart'], () =>
      state.toString().then((hash) => (window.location.hash = '#' + hash))
    );

    const print = h('button.print[title="Print design"]', t('🖨'));

    onEach(print, ['mousedown', 'touchstart'], () => window.print());

    const share = h('button.print[title="Share design"]');

    share.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><path d="M23 3a4 4 0 0 0-4 4 4 4 0 0 0 .094.836l-9.082 4.541A4 4 0 0 0 7 11a4 4 0 0 0-4 4 4 4 0 0 0 4 4 4 4 0 0 0 3.014-1.375l9.076 4.54A4 4 0 0 0 19 23a4 4 0 0 0 4 4 4 4 0 0 0 4-4 4 4 0 0 0-4-4 4 4 0 0 0-3.014 1.375l-9.076-4.54A4 4 0 0 0 11 15a4 4 0 0 0-.094-.834l9.082-4.541A4 4 0 0 0 23 11a4 4 0 0 0 4-4 4 4 0 0 0-4-4z"/></svg>';

    onEach(share, ['mousedown', 'touchstart'], async () =>
      navigator.share({
        text: 'Check out my Aquabeads® design!',
        title: 'Aquabeads® Designer',
        url: '#' + (await state.toString()),
      })
    );

    this.append(clear, link, print);

    if (navigator.share) {
      this.append(share);
    }
  }
}

export default Actions;
