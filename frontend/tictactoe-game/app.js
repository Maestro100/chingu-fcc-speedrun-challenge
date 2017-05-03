// global (gasp!) variables
var player_token = 'x';
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
  // get information about game state
  var state = game.getState();
  var message = document.getElementById('message');
  var modal = document.getElementById('modal');

  // if game over, display winner
  if (state.over && state.winner) {
    message.innerHTML = state.winner + " wins!";
  }
  // if game was a draw, display that instead
  else if (state.over) {
    message.innerHTML = "Game over.";
  }

  setTimeout(function() {
    modal.className = "display";
  }, 1000);
}

function computerTurn() {
  // calculate computer token
  var computer_token = (player_token === 'x') ? 'o' : 'x';

  // Double-check that computer is up (this check should NEVER fail)
  if (game.getState().next !== computer_token) {
    return;
  }

  // calculate best (valid! move) - don't carry it out yet:
  // moving shifts control back to player
  var move = game.getBestMove(computer_token);
  if (!move) {
    console.log("Error: Computer can't move! (line 45)");
    return;
  }

  // wait a second
  setTimeout(function() {

    // carry out move and update display
    game.play(computer_token, move);
    document.getElementById(move.toString()).innerHTML = computer_token;

    // if game over, pass things off to endGame function
    if (game.getState().over) {
      endGame();
    }
  }, 1000);
}

function playTurn(square) {
  // if it's not the player's turn, do nothing
  if (game.getState().next !== player_token) {
    return;
  }

  // attempt to update the state of the "game" object
  // automatically keeps track of turns. Yay!
  var move = game.play(player_token, Number(square));

  // if successful, update the game board
  if (move) {
    document.getElementById(square).innerHTML = player_token;
  }

  // check for game over & pass things off to endGame or computerTurn
  return game.getState().over ? endGame() : computerTurn();
}

function newGame(token) {
  // hide modal
  document.getElementById('modal').className = 'hide';

  // reset (global) variables
  game = new Game();
  player_token = token;

  // reset game board
  var squares = document.getElementsByClassName('square');
  for (var i = 0; i < squares.length; i++) {
    squares[i].innerHTML = "";
  }

  // if computer goes first, have computer start
  if (player_token !== game.getState().next) {
    computerTurn();
  }
}
