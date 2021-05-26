var state = {
  turn: 0, xBoard: 0, oBoard: 0, wins: [0, 0],
  nextTurn: function () { this.turn++; },
  updateSquare: function (idx) {
    var mask = (1 << idx);
    if (this.turn % 2 === 0) {
      this.xBoard = this.xBoard | mask;
    } else {
      this.oBoard = this.oBoard | mask;
    }
  }
};
var view = {
  resetBoard: function () {
    var rows = document.getElementById('board').children[0].children;
    for (var i = 0; i < rows.length; i++) {
      for (var j = 0; j < rows[i].children.length; j++) {
        rows[i].children[j].innerHTML = '';
      }
    }
  },
  renderWins: function () {
    document.getElementById('tallyX').innerHTML = 'X has won ' + state.wins[0] + ' games.';
    document.getElementById('tallyO').innerHTML = 'O has won ' + state.wins[1] + ' games.';
  },
  updateSquare: function (cell) {
    if (state.turn % 2 === 0) {
      cell.innerHTML = 'X';
    } else {
      cell.innerHTML = 'O';
    }
  },
  winnerMessage: function (winner) {
    document.getElementById('message').innerHTML = winner === -1 ? 'It\'s a draw' : (winner % 2 === 0 ? 'X wins' : 'O wins');
  }

};

window.onload = function () {
  resetGame();
  document.getElementById('board').onclick = function (e) {
    var cell = document.getElementById(e.path[0].id);
    if (cell.nodeName === 'TD') {
      updateBoard(cell);
    }
  };
  document.getElementById('reset').onclick = resetGame;
};

var updateBoard = function (cell) {
  var idx = parseInt(cell.id);
  if (!((state.xBoard | state.oBoard) & mask)) {
    view.updateSquare(cell);
    state.updateSquare(idx);
    var gameFinished = checkBoard(idx);
    if (!gameFinished) {
      state.nextTurn();
    }
  }
}

var checkBoard = function (idx) {
  var curBoard = [state.xBoard, state.oBoard][state.turn % 2];
  var row = Math.floor(idx / 3);
  var col = idx % 3;
  var rowMask = 7 << (row * 3); //7 = 111, so first row is 111, second is 111000, third is 111000000.
  var colMask = (1 << col) + (1 << (col + 3)) + (1 << (col + 6)); //shift by 3 for each row
  //diagonal masks are always the same, so just hard code them.
  var majMask = 0b100010001;
  var minMask = 0b001010100;
  if ((rowMask & curBoard) === rowMask || (colMask & curBoard) === colMask ||
    (majMask & curBoard) === majMask || (minMask & curBoard) === minMask) {
    state.wins[state.turn % 2]++;
    view.winnerMessage(state.turn % 2);
    view.renderWins();
    resetGame((state.turn + 1) % 2);
    return true;
  } else if ((state.xBoard | state.oBoard) === (1 << 9) - 1) {
    view.winnerMessage(-1);
    resetGame();
    return true;
  } else {
    return false;;
  }
};

var resetGame = function (start) {
  state.turn = start || 0;
  state.xBoard = 0b0;
  state.oBoard = 0b0;
  view.resetBoard();
}