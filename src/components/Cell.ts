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
    ['mousedown', 'mousemove', 'touchstart', 'touchmove'].forEach((eventName) =>
      this.element().addEventListener(
        eventName,
        (event: MouseEvent | TouchEvent) => {
          if (eventName === 'mousemove' && event.which !== 1) {
            return;
          }

          event.preventDefault();

          this.paint();
        }
      )
    );
  }

  private paint(): void {
    this.#colour = this.#picker.currentColour();
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
