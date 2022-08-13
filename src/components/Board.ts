import Cell from './Cell';
import Element, { h } from './Element';
import Picker from './Picker';

export class Board extends Element {
  #cells: Cell[][];

  constructor(picker: Picker, rows: number = 26, cols: number = 22) {
    super('section.board');

    this.#cells = this.generateCells(rows, cols, picker);

    this.#cells.forEach((row) =>
      this.element().append(h('div.row', ...row.map((cell) => cell.element())))
    );
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
