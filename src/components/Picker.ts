import Element, { onEach, empty, h, on } from './Element';
import State from '../lib/State';

export const TOTAL_RECENT_COLOURS = 16;

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
    on(this.#input, 'input', () => this.setCurrentColour(this.#input.value));
  }

  currentColour(): string {
    return this.#input.value;
  }

  setCurrentColour(colour: string): void {
    if (this.#input.value !== colour) {
      this.#input.value = colour;
    }

    const existingIndex = this.#recentColours.indexOf(colour);

    if (existingIndex > -1) {
      this.#recentColours.splice(existingIndex, 1);
    }

    this.#recentColours.unshift(colour);

    this.#recentColours.splice(TOTAL_RECENT_COLOURS);

    this.updateRecent();
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
