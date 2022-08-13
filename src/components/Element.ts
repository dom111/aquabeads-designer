import { parse } from 'css-what';

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

  element(): HTMLElement {
    return this.#element;
  }

  empty(): void {
    this.element().childNodes.forEach((childNode) => childNode.remove());
  }
}

export default Element;
