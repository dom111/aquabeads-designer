import Element, { onEach, empty, h, on } from './Element';
import State from './State';

const TOTAL_RECENT_COLOURS = 16;

export class Picker extends Element {
  #input: HTMLInputElement;
  #recent: HTMLDivElement;
  #recentColours: string[];

  constructor(state: State) {
    super('section.picker');

    this.#recentColours = state.palette();

    this.#input = h('input[type="color"]') as HTMLInputElement;

    this.#input.value = this.#recentColours[0];

    this.#recent = h('section.recent') as HTMLDivElement;

    this.append(this.#input, this.#recent);

    this.bindEvents();
    this.updateRecent();
  }

  private bindEvents(): void {
    on(this.#input, 'input', () => {
      const colour = this.#input.value,
        existingIndex = this.#recentColours.indexOf(colour);

      if (existingIndex > -1) {
        this.#recentColours.splice(existingIndex, 1);
      }

      this.#recentColours.splice(0, TOTAL_RECENT_COLOURS);

      this.#recentColours.unshift(colour);

      this.updateRecent();
    });
  }

  currentColour(): string {
    return this.#input.value;
  }

  updateRecent(): void {
    empty(this.#recent);

    this.#recent.append(
      ...this.#recentColours.map((colour) => {
        const element = h('button') as HTMLButtonElement;

        element.style.backgroundColor = colour;

        onEach(
          element,
          ['mousedown', 'touchstart'],
          () => (this.#input.value = colour)
        );

        return element;
      })
    );
  }
}

export default Picker;
