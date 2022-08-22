import Element, { h, on } from './Element';
import Cell from './Cell';
import Picker from './Picker';
import State from '../lib/State';

const elementAtPoint = (x: number, y: number): HTMLElement | null => {
    const element = document.elementFromPoint(x, y);

    if (!element.matches('.cell')) {
      return null;
    }

    return element as HTMLElement;
  },
  focusIn = (target) => {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    target.classList.add('focus');
  },
  focusOut = (target) => {
    if (!(target instanceof HTMLElement)) {
      return;
    }

    target.classList.remove('focus');
  };

export class Board extends Element {
  #cells: Cell[][];
  #currentTarget: HTMLElement | null;

  constructor(picker: Picker, state: State) {
    super(
      'section.board[tabindex="0"][aria-title="Bead board"][aria-description="The board can be navigated using the keyboard (arrow keys or WASD) and the current colour bead can be placed with Enter or Space and cleared using Backspace or Delete."]'
    );

    const { height, width } = state.board();

    this.#cells = this.generateCells(height, width, state);

    this.#cells.forEach((row) =>
      this.append(h('.row', ...row.map((cell) => cell.element())))
    );

    this.bindEvents(picker);
  }

  private bindEvents(picker: Picker): void {
    this.on('focus', () => {
      this.#currentTarget =
        this.#currentTarget ??
        (this.element().querySelector('.cell') as HTMLElement);

      focusIn(this.#currentTarget);
    });

    this.on('keydown', (event) => {
      if (
        ![
          'ArrowUp',
          'ArrowLeft',
          'ArrowDown',
          'ArrowRight',
          'W',
          'A',
          'S',
          'D',
          'w',
          'a',
          's',
          'd',
          ' ',
          'Enter',
          'Delete',
          'Backspace',
        ].includes(event.key)
      ) {
        return;
      }

      event.preventDefault();

      const currentRow = this.#currentTarget.parentElement,
        currentRowIndex = [...currentRow.childNodes].indexOf(
          this.#currentTarget
        ),
        previousRow = currentRow.previousElementSibling as HTMLElement | null,
        nextRow = currentRow.nextElementSibling as HTMLElement | null,
        previousRowTarget = previousRow?.childNodes[
          currentRowIndex
        ] as HTMLElement | null,
        nextRowTarget = nextRow?.childNodes[
          currentRowIndex
        ] as HTMLElement | null,
        previousTarget = this.#currentTarget
          .previousElementSibling as HTMLElement | null,
        nextTarget = this.#currentTarget
          .nextElementSibling as HTMLElement | null;

      (
        [
          [['ArrowUp', 'W', 'w'].includes(event.key), previousRowTarget],
          [['ArrowLeft', 'A', 'a'].includes(event.key), previousTarget],
          [['ArrowDown', 'S', 's'].includes(event.key), nextRowTarget],
          [['ArrowRight', 'D', 'd'].includes(event.key), nextTarget],
        ] as [boolean, HTMLElement][]
      ).forEach(([condition, target]) => {
        if (!condition || !target) {
          return;
        }

        focusOut(this.#currentTarget);

        this.#currentTarget = target;

        focusIn(this.#currentTarget);
      });

      if ([' ', 'Enter'].includes(event.key)) {
        const cell = this.cellFromElement(this.#currentTarget);

        cell.paint(picker.currentColour());
      }

      if (['Delete', 'Backspace'].includes(event.key)) {
        const cell = this.cellFromElement(this.#currentTarget);

        cell.clear();
      }
    });

    on(document, 'keydown', (event) => {
      if (event.key === 'Control') {
        this.addClass('pick');
      }
    });

    on(document, 'keyup', (event) => {
      if (event.key === 'Control') {
        this.removeClass('pick');
      }
    });

    this.onEach(['mousedown', 'mousemove'], (event: MouseEvent) =>
      this.handleMouseEvent(event, picker)
    );

    this.onEach(['blur', 'mouseout'], () => {
      focusOut(this.#currentTarget);

      this.#currentTarget = null;
    });

    this.onEach(['touchstart', 'touchmove'], (event: TouchEvent) =>
      this.handleTouchEvent(event, picker)
    );

    this.on('contextmenu', (event) => event.preventDefault());
  }

  private cellFromElement(element: HTMLElement): Cell | null {
    const [cell] = this.#cells
      .flat()
      .filter((cell) => cell.element() === element);

    return cell ?? null;
  }

  clear(): void {
    this.#cells.flat().forEach((cell: Cell) => cell.clear());
  }

  private generateCells(rows: number, cols: number, state: State): Cell[][] {
    return new Array(rows)
      .fill(0)
      .map((_, y) =>
        new Array(cols - (y % 2)).fill(0).map((_, x) => new Cell(x, y, state))
      );
  }

  handlePaintEvent(element: HTMLElement, picker: Picker): void {
    const cell = this.cellFromElement(element);

    if (this.element().classList.contains('pick')) {
      picker.setCurrentColour(cell.currentColour());

      return;
    }

    cell.paint(picker.currentColour());
  }

  handleMouseEvent(event: MouseEvent, picker: Picker): void {
    const element = event.target as HTMLElement;

    if (!element || !element.matches('.cell')) {
      return;
    }

    this.handleMoveEvent(element);

    if (event.buttons & 1) {
      this.handlePaintEvent(element, picker);
    }

    if (event.buttons & 2) {
      const cell = this.cellFromElement(element);

      cell.clear();

      event.stopPropagation();
    }

    event.preventDefault();
  }

  handleMoveEvent(element: HTMLElement): void {
    focusOut(this.#currentTarget);

    this.#currentTarget = element as HTMLElement;

    focusIn(this.#currentTarget);
  }

  handleTouchEvent(event: TouchEvent, picker: Picker): void {
    [...event.touches].forEach((touch) => {
      const element = elementAtPoint(touch.pageX, touch.pageY);

      if (!element || !element.matches('.cell')) {
        return;
      }

      this.handleMoveEvent(element);
      this.handlePaintEvent(element, picker);

      event.preventDefault();
    });
  }
}

export default Board;
