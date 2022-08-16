import './app.scss';

import Actions from './components/Actions';
import Board from './components/Board';
import Footer from './components/Footer';
import Picker from './components/Picker';
import State from './components/State';

const state = new State();

state.init(window.location).then(() => {
  const picker = new Picker(state),
    board = new Board(picker, state),
    actions = new Actions(board, state),
    footer = new Footer(),
    appContainer = document.getElementById('app');

  appContainer.append(
    actions.element(),
    board.element(),
    picker.element(),
    footer.element()
  );
});
