import { parse } from 'css-what';

export const empty = (element: HTMLElement): void => {
  while (element.hasChildNodes()) {
    element.firstChild.remove();
  }
};

export const addEventListeners = (
  element: HTMLElement,
  events: string[],
  handler: (event: Event) => void,
  options?: boolean | AddEventListenerOptions
) => {
  events.forEach((eventName) =>
    element.addEventListener(eventName, handler, options)
  );
};

export const h = (selector: string, ...childNodes: Node[]) => {
  const [element] = parse(selector).map((selectors) =>
    selectors.reduce((element: HTMLElement | null, details) => {
      if (element === null && details.type !== 'tag') {
        throw new Error('Unexpected.');
      }

      if (details.type === 'tag') {
        return document.createElement(details.name);
      }

      if (details.type === 'attribute' && details.name !== 'class') {
        element.setAttribute(details.name, details.value ?? '');
      }

      if (details.type === 'attribute' && details.name === 'class') {
        element.classList.add(details.value);
      }

      return element;
    }, null)
  );

  childNodes.forEach((childNode) => element.append(childNode));

  return element;
};

export const t = (content: string) => document.createTextNode(content);

export class Element {
  #element: HTMLElement;

  constructor(selector: string, ...childNodes: Node[]) {
    this.#element = h(selector, ...childNodes);
  }

  addEventListener(
    event: string,
    handler: (event: Event) => void,
    options?: boolean | AddEventListenerOptions
  ): void {
    this.element().addEventListener(event, handler, options);
  }

  addEventListeners(
    events: string[],
    handler: (event: Event) => void,
    options?: boolean | AddEventListenerOptions
  ): void {
    addEventListeners(this.element(), events, handler, options);
  }

  append(...nodes: Node[]): void {
    return this.element().append(...nodes);
  }

  element(): HTMLElement {
    return this.#element;
  }

  empty(): void {
    empty(this.element());
  }
}

export default Element;
