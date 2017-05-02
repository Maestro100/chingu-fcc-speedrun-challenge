// global (gasp!) variables
var player = 'x';
var game = new Game();

// event handlers for buttons
document.getElementById('play-x').addEventListener('click', newGame.bind(null, 'x'));
document.getElementById('play-o').addEventListener('click',  newGame.bind(null, 'o'));

// event handler for squares
document.getElementById('tic-tac-toe').addEventListener('click', function(e) {
  if (e.target && e.target.id) {
    playTurn(e.target.id);
  }
});

/*
// helper functions
*/

function endGame() {
  var state = game.getState();
  if (state.over && state.winner) {
    document.getElementById('message').innerHTML = state.winner + " wins!";
  }
  else if (state.over) {
    document.getElementById('message').innerHTML = "Game over.";
  }
  setTimeout(function() {
    document.getElementById('message').innerHTML = "";
    newGame(player);
  }, 3000);
}

function computerTurn() {
  var computer = (player === 'x') ? 'o' : 'x';
  var move = game.play(computer, game.getBestMove(computer));
  if (move) {
    document.getElementById(move.toString()).innerHTML = computer;
  }

  if (game.getState().over) {
    endGame();
  }
}

function playTurn(square) {
  var move = game.play(player, Number(square));
  if (move) {
    document.getElementById(square).innerHTML = player;
  }

  if (game.getState().over) {
    endGame();
  }
  else {
    computerTurn();
  }
}

function newGame(token) {
  // reset (global) variables
  player = token;
  game = new Game();

  // reset game board
  var squares = document.getElementsByClassName('square');
  for (var i = 0; i < squares.length; i++) {
    squares[i].innerHTML = "";
  }

  // if computer goes first, have computer start
  if (player === 'o') {
    computerTurn();
  }
}
