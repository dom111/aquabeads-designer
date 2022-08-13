import './app.scss';

import Board from './components/Board';
import Picker from './components/Picker';

const picker = new Picker(),
  board = new Board(picker),
  appContainer = document.getElementById('app');

appContainer.append(board.element(), picker.element());
