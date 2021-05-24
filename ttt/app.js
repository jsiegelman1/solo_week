var state = {turn: 0, xBoard: 0, oBoard: 0, wins:[0, 0]};

window.onload = function () {
  resetGame();
  document.getElementById('board').onclick = function (e) {
    var cell = document.getElementById(e.path[0].id);
    if(cell.nodeName === 'TD') {
      updateBoard(cell);
    }
  };
  document.getElementById('reset').onclick = resetGame;
};

var updateBoard = function (cell) {
  var idx = parseInt(cell.id);
  var mask = (1 << idx);
  if(!((state.xBoard | state.oBoard) & mask))  {
    if(state.turn % 2 ===  0) {
      cell.innerHTML = 'X';
      state.xBoard = state.xBoard | mask;
    } else {
      cell.innerHTML = 'O';
      state.oBoard = state.oBoard | mask;
    }
    checkBoard(idx);
  }
}

var checkBoard = function(idx) {
  var curBoard = [state.xBoard, state.oBoard][state.turn % 2];
    var row = Math.floor(idx/3);
    var col = idx % 3;
    var rowMask = 7 << (row * 3); //7 = 111, so first row is 111, second is 111000, third is 111000000.
    var colMask = (1 << col) + (1 << (col + 3)) + (1 << (col + 6)); //shift by 3 slots for each row
    //diagonal masks are always the same, so just hard code them.
    /*
    majmask:
    100
    010
    001
    minmask:
    001
    010
    100
    */
    var majMask = 0b100010001;
    var minMask = 0b001010100;
    if((rowMask & curBoard) === rowMask || (colMask & curBoard) === colMask || (majMask & curBoard) === majMask || (minMask & curBoard) === minMask) {
      document.getElementById('message').innerHTML = state.turn % 2 === 0 ? 'X wins' : 'O wins';
      state.wins[state.turn % 2]++;
      if(state.turn % 2 === 0) {
        document.getElementById('tallyX').innerHTML = 'X has won ' + state.wins[0] + ' games.'
      } else {
        document.getElementById('tallyO').innerHTML = 'O has won ' + state.wins[1] + ' games.'

      }
      resetGame();
    } else if((state.xBoard | state.oBoard) === (1 << 9) - 1) {
      document.getElementById('message').innerHTML = 'It\'s a draw';
      resetGame();
    } else {
      state.turn++;
    }
};

var resetGame = function() {
  state.turn = 0;
  state.xBoard = 0b0;
  state.oBoard = 0b0;
  var rows = document.getElementById('board').children[0].children;
  for(var i = 0; i < rows.length; i++) {
    for(var j = 0; j < rows[i].children.length; j++) {
      rows[i].children[j].innerHTML = '_';//1 + i * 3 + j;
    }
  }
}