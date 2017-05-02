/*
Uses "magic square" isomorphism found here: http://www.ms.uky.edu/~lee/ma502/notes4/node7.html
Assumes board layout (or another 3x3 magic square layout):
  8 | 1 | 6
  3 | 5 | 7
  4 | 9 | 2
*/

var Game = function() {
  // variables holding game state
  var open = [1,2,3,4,5,6,7,8,9];
  var x = [];
  var o = [];

  this.play = function(player, square) {
    // get current player
    var curr = (player === 'x') ? x : o;

    // check that game hasn't ended
    if (this.getState().over) {
      return false;
    }

    // check that it is actually player's turn
    if (curr === x && x.length > o.length) {
      return false;
    }
    if (curr === o && o.length >= x.length) {
      return false;
    }

    // attempt move - if possible, return value, else, return false
    var index = open.indexOf(square);
    if (index > -1) {
      open.splice(index, 1);
      curr.push(square);
      return square;
    }
    else {
      return false;
    }
  };

  // right now returns a decent move, but not the best!
  this.getBestMove = function(player) {
    // get player
    var curr = (player === 'x') ? x : o;

    // If player can win, return winning move
    var move = canWin(curr, open);
    if (move.win) {
      return move.square;
    }

    // If opponent can win, return move to block them
    var opponent = (player === x) ? o : x;
    move = canWin(opponent, open);
    if (move.win) {
      return move.square;
    }

    // skipping steps 3 & 4

    // if center open, return center
    if (open.indexOf(5) > -1) {
      return 5;
    }

    // if opponent in corner, return (open) opposite corner
    var evens = open.filter(x => x % 2 === 0);
    for (var i = 0; i < evens.length; i++) {
      if (evens.indexOf(10 - evens[i]) > -1) {
        return 10 - evens[i];
      }
    }

    // return a corner
    if (evens.length) {
      return evens[0];
    }

    // if all else fails, return a side
    return open[0];
  };

  // return object telling game over, winner, who goes next
  this.getState = function() {
    var state = {};

    // add copies of current game board
    state.x = x.slice(0);
    state.o = o.slice(0);

    // check for available moves
    if (hasWon(x)) {
      state.over = true;
      state.winner = 'x';
    }
    else if (hasWon(o)) {
      state.over = true;
      state.winner = 'o';
    }
    else if (open.length === 0) {
      state.over = true;
      state.winner = null;
    }
    else {
      state.over = false;
    }

    // if game not over, return who goes next
    if (!state.over) {
      state.next = (x.length > o.length ? 'o' : 'x');
    }

    return state;
  };

  /*
  HELPER FUNCTIONS
  */
  function hasWon(player_squares) {
    for (var i = 0; i < player_squares.length; i++) {
      for (var j = i + 1; j < player_squares.length; j++) {
        for (var k = j + 1; k < player_squares.length; k++) {
          if (player_squares[i] + player_squares[j] + player_squares[k] === 15) {
            return true;
          }
        }
      }
    }
    return false;
  }

  // check for winning moves
  function canWin(player_squares, open_squares) {
    var winning_moves = getWinningMoves(player_squares);
    for (var i = 0; i < winning_moves.length; i++) {
      if (open_squares.indexOf(winning_moves[i]) > -1) {
        return {
          win: true,
          square: winning_moves[i]
        };
      }
    }
    return { win: false };

    // given current game state, returns values that would win game
    function getWinningMoves(arr) {
      var moves = [];

      // iterate through each "pair" in array
      for (var i = 0; i < arr.length; i++) {
        for (j = i + 1; j < arr.length; j++) {

          // add new values to array
          var value = 15 - (arr[i] + arr[j]);
          if (moves.indexOf(value) < 0) {
            moves.push(value);
          }
        }
      }

      return moves;
    }
  }
};
