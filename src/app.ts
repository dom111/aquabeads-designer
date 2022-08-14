import './app.scss';

import Board from './components/Board';
import Picker from './components/Picker';
import Actions from './components/Actions';

const picker = new Picker(),
  board = new Board(picker),
  actions = new Actions(board),
  appContainer = document.getElementById('app');

appContainer.append(actions.element(), board.element(), picker.element());
