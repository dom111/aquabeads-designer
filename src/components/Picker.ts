import Element, { addEventListeners, empty, h } from './Element';

export class Picker extends Element {
  #input: HTMLInputElement;
  #recent: HTMLDivElement;
  #recentColours: string[] = [
    '#ffffff',
    '#888888',
    '#000000',
    '#ff0000',
    '#ff8800',
    '#ffff88',
    '#ffff00',
    '#88ff00',
    '#00ff88',
    '#88ffff',
    '#00ffff',
    '#0088ff',
    '#8800ff',
    '#ff00ff',
    '#ff0088',
    '#ff88ff',
  ];

  constructor() {
    super('section.picker');

    this.#input = h('input[type="color"][value="#000000"]') as HTMLInputElement;
    this.#recent = h('section.recent') as HTMLDivElement;

    this.append(this.#input, this.#recent);

    this.bindEvents();
    this.updateRecent();
  }

  private bindEvents(): void {
    this.#input.addEventListener('input', () => {
      const colour = this.#input.value;

      this.#recentColours = this.#recentColours
        .filter((recentColour) => recentColour !== colour)
        .slice(0, 15);

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

        addEventListeners(
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
