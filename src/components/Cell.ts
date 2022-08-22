import Element from './Element';
import State from '../lib/State';

export class Cell extends Element {
  #colour: string = 'transparent';
  #state: State;
  #x: number;
  #y: number;

  constructor(x: number, y: number, state: State) {
    super('.cell');

    this.#state = state;
    this.#x = x;
    this.#y = y;

    this.paint(state.getEntry(x, y));
  }

  clear(): void {
    this.paint('transparent');
  }

  currentColour(): string {
    return this.#colour;
  }

  paint(colour: string): void {
    this.#colour = colour;
    this.element().style.backgroundColor = this.#colour;

    if (this.#state.getEntry(this.#x, this.#y) !== colour) {
      this.#state.setEntry(this.#x, this.#y, this.#colour);
    }
  }
}

export default Cell;
