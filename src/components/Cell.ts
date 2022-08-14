import Element from './Element';
import Picker from './Picker';

export class Cell extends Element {
  #colour: string = 'transparent';
  #picker: Picker;
  #x: number;
  #y: number;

  constructor(x: number, y: number, picker: Picker) {
    super('div.cell');

    this.#picker = picker;
    this.#x = x;
    this.#y = y;

    this.bindEvents();
  }

  private bindEvents(): void {
    this.addEventListener('paint', () => this.paint());
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
  }

  x(): number {
    return this.#x;
  }

  y(): number {
    return this.#y;
  }
}

export default Cell;
