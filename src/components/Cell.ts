import Element from './Element';
import Picker from './Picker';
import State from './State';

export class Cell extends Element {
  #colour: string = 'transparent';
  #picker: Picker;
  #state: State;
  #x: number;
  #y: number;

  constructor(x: number, y: number, picker: Picker, state: State) {
    super('.cell');

    this.#picker = picker;
    this.#state = state;
    this.#x = x;
    this.#y = y;

    this.bindEvents();
    this.paint(state.getEntry(x, y));
  }

  private bindEvents(): void {
    this.on('paint', () => this.paint());
  }

  clear(): void {
    this.paint('transparent');
  }

  private paint(colour?: string): void {
    if (typeof colour === 'undefined') {
      colour = this.#picker.currentColour();
    }

    this.#colour = colour;
    this.element().style.backgroundColor = this.#colour;

    if (this.#state.getEntry(this.#x, this.#y) !== colour) {
      this.#state.setEntry(this.#x, this.#y, this.#colour);
    }
  }
}

export default Cell;
