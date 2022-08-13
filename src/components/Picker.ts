import Element, { h } from './Element';

export class Picker extends Element {
  #input: HTMLInputElement;

  constructor() {
    super('section.picker');

    this.#input = h('input[type="color"][value="#000000"]') as HTMLInputElement;

    this.element().append(this.#input);
  }

  currentColour(): string {
    return this.#input.value;
  }
}

export default Picker;
