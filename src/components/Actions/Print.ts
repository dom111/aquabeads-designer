import Element, { t } from '../Element';

export class Print extends Element {
  constructor() {
    super('button.print[title="Print design"]', t('🖨'));

    this.onEach(['mousedown', 'touchstart'], () => window.print());
  }
}

export default Print;
