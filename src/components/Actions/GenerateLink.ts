import Element, { on, t } from '../Element';
import State from '../../lib/State';

export class GenerateLink extends Element {
  #state: State;

  constructor(state: State) {
    super('button.link[title="Generate link"]', t('🔗'));

    this.#state = state;

    this.bindEvents();
  }

  private bindEvents(): void {
    this.onEach(['mousedown', 'touchstart'], () => this.saveState());

    on(document, 'keydown', (event) => {
      if (['S', 's'].includes(event.key) && event.ctrlKey) {
        this.saveState();

        event.preventDefault();
        event.stopPropagation();
      }
    });
  }

  private saveState(): void {
    this.#state.toString().then((hash) => (window.location.hash = '#' + hash));
  }
}

export default GenerateLink;
