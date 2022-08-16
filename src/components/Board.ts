import Element, { h } from './Element';
import Cell from './Cell';
import Picker from './Picker';
import State from './State';

export class Board extends Element {
  #cells: Cell[][];

  constructor(picker: Picker, state: State) {
    super('section.board');

    const { height, width } = state.board();

    this.#cells = this.generateCells(height, width, picker, state);

    this.#cells.forEach((row) =>
      this.append(h('.row', ...row.map((cell) => cell.element())))
    );

    this.bindEvents();
  }

  private bindEvents(): void {
    this.onEach(
      ['mousedown', 'mousemove', 'touchstart', 'touchmove'],
      (event: MouseEvent | TouchEvent) => {
        // Only support left click, ignore anything else
        if (event instanceof MouseEvent && (event.buttons & 1) === 0) {
          return;
        }

        if (event instanceof TouchEvent) {
          event.preventDefault();

          [...event.touches].forEach((touch) => {
            // This was way more complicated than I expected, the touchmove event isn't triggered for other elements
            //  it passes over, so it's necessary to get the element from the event points to trigger the painting...
            const cell = document.elementFromPoint(touch.pageX, touch.pageY);

            if (!cell.matches('.cell')) {
              return;
            }

            cell.dispatchEvent(new CustomEvent('paint'));
          });

          return;
        }

        event.target.dispatchEvent(new CustomEvent('paint'));
      }
    );
  }

  clear(): void {
    this.#cells.flat().forEach((cell: Cell) => cell.clear());
  }

  private generateCells(
    rows: number,
    cols: number,
    picker: Picker,
    state: State
  ): Cell[][] {
    return new Array(rows)
      .fill(0)
      .map((_, y) =>
        new Array(cols - (y % 2))
          .fill(0)
          .map((_, x) => new Cell(x, y, picker, state))
      );
  }
}

export default Board;
