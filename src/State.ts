import Base64 from './lib/Base64';
import Compression from './lib/Compression';

type BoardState = { height: number; width: number };
type StateMap = {
  board: BoardState;
  entries: number[];
  lookup: string[];
  palette: string[];
};

const defaultState = (height: number = 26, width: number = 22): StateMap => ({
  board: {
    height,
    width,
  },
  entries: new Array(26 * 22 - Math.floor(height / 2)).fill(0),
  lookup: ['transparent'],
  palette: [
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
    '#000000',
    '#888888',
    '#ffffff',
  ],
});

export class State {
  #state: StateMap = defaultState();

  board(): BoardState {
    return this.#state.board;
  }

  private coordsToIndex(x: number, y: number): number {
    const { width } = this.board();

    return width * y - Math.floor(y / 2) + x;
  }

  private static async fromString(hash: string): Promise<StateMap | null> {
    if (hash.length < 3) {
      return null;
    }

    try {
      return JSON.parse(atob(hash));
    } catch (e) {
      // Probably compressed data, lets try that next...
    }

    try {
      return JSON.parse(
        await Compression.decompress(await Base64.decode(hash))
      ) as StateMap;
    } catch (e) {
      console.debug(`There was an error decoding the hash state:`);
      console.debug(e);

      return null;
    }
  }

  async init(stateString: string | null = null): Promise<void> {
    const newState = await State.fromString(stateString);

    if (!newState) {
      return;
    }

    this.#state = newState;
  }

  getEntry(x: number, y: number): string {
    return this.#state.lookup[this.#state.entries[this.coordsToIndex(x, y)]];
  }

  palette(): string[] {
    return this.#state.palette;
  }

  setEntry(x: number, y: number, colour: string): void {
    if (!this.#state.lookup.includes(colour)) {
      this.#state.lookup.push(colour);
    }

    this.#state.entries[this.coordsToIndex(x, y)] =
      this.#state.lookup.indexOf(colour);
  }

  async toString(): Promise<string> {
    if (!Compression.isAvailable()) {
      return btoa(JSON.stringify(this.#state));
    }

    return Compression.compress(JSON.stringify(this.#state)).then((data) =>
      Base64.encode(data)
    );
  }
}

export default State;
