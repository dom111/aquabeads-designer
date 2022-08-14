import Cell from './Cell';
import Element, { h } from './Element';
import Picker from './Picker';

export class Board extends Element {
  #cells: Cell[][];

  constructor(picker: Picker, rows: number = 26, cols: number = 22) {
    super('section.board');

    this.#cells = this.generateCells(rows, cols, picker);

    this.#cells.forEach((row) =>
      this.append(h('div.row', ...row.map((cell) => cell.element())))
    );

    this.bindEvents();
  }

  private bindEvents(): void {
    ['mousedown', 'mousemove', 'touchstart', 'touchmove'].forEach((eventName) =>
      this.addEventListener(eventName, (event: MouseEvent | TouchEvent) => {
        // Only support left click, ignore anything else
        if (event instanceof MouseEvent && (event.buttons & 1) === 0) {
          return;
        }

        if (event instanceof TouchEvent) {
          [...event.touches].forEach((touch) => {
            // This was way more complicated than I expected, the touchmove event isn't triggered for other elements
            //  it passes over, so it's necessary to get the element from the event points to trigger the painting...
            const cell = document.elementFromPoint(touch.pageX, touch.pageY);

            if (!cell.matches('.cell') || cell === this.element()) {
              return;
            }

            cell.dispatchEvent(new CustomEvent('paint'));
          });

          return;
        }

        event.target.dispatchEvent(new CustomEvent('paint'));
      })
    );
  }

  clear(): void {
    this.#cells.flat().forEach((cell: Cell) => cell.clear());
  }

  private generateCells(rows: number, cols: number, picker: Picker): Cell[][] {
    return new Array(rows)
      .fill(0)
      .map((_, y) =>
        new Array(cols - (y % 2)).fill(0).map((_, x) => new Cell(x, y, picker))
      );
  }
}

export default Board;
