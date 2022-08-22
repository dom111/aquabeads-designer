import { parse } from 'css-what';

export const empty = (element: HTMLElement): void => {
  while (element.hasChildNodes()) {
    element.firstChild.remove();
  }
};

export const h = <T extends HTMLElement = HTMLElement>(
  selector: string,
  ...childNodes: (Node | Element)[]
): T => {
  const [element] = parse(selector).map((selectors) =>
    selectors.reduce((element: HTMLElement | null, details) => {
      if (element === null && details.type !== 'tag') {
        element = document.createElement('div');
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

  childNodes.forEach((childNode) => {
    if (childNode instanceof Element) {
      childNode = childNode.element();
    }

    element.append(childNode);
  });

  return element as T;
};

export const on:
  | (<K extends keyof GlobalEventHandlersEventMap>(
      target: EventTarget,
      event: K,
      handler: (event: GlobalEventHandlersEventMap[K]) => void,
      options?: boolean | AddEventListenerOptions
    ) => any)
  | ((
      element: EventTarget,
      type: string,
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) => any) = (target, event, handler, options): void =>
  target.addEventListener(event, handler, options);

export const onEach:
  | (<K extends keyof GlobalEventHandlersEventMap>(
      target: EventTarget,
      events: K[],
      handler: (event: GlobalEventHandlersEventMap[K]) => void,
      options?: boolean | AddEventListenerOptions
    ) => any)
  | ((
      target: EventTarget,
      type: string[],
      listener: EventListenerOrEventListenerObject,
      options?: boolean | AddEventListenerOptions
    ) => any) = (target, events, handler, options): any => {
  events.forEach((event) => on(target, event, handler, options));
};

export const t = (content: string): Text => document.createTextNode(content);

export class Element {
  #element: HTMLElement;

  constructor(selector: string, ...childNodes: Node[]) {
    this.#element = h(selector, ...childNodes);
  }

  addClass(...classes: string[]): void {
    this.element().classList.add(...classes);
  }

  append(...nodes: (Node | Element)[]): void {
    nodes.forEach((node) => {
      if (node instanceof Element) {
        node = node.element();
      }

      this.element().append(node);
    });
  }

  element(): HTMLElement {
    return this.#element;
  }

  empty(): void {
    empty(this.element());
  }

  on<K extends keyof GlobalEventHandlersEventMap>(
    event: K,
    handler: (event: GlobalEventHandlersEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  on(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  on(event, handler, options): void {
    on(this.element(), event, handler, options);
  }

  onEach<K extends keyof GlobalEventHandlersEventMap>(
    events: K[],
    handler: (event: GlobalEventHandlersEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;
  onEach(
    type: string[],
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  onEach(events, handler, options): void {
    onEach(this.element(), events, handler, options);
  }

  removeClass(...classes: string[]): void {
    this.element().classList.remove(...classes);
  }
}

export default Element;
