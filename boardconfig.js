//CHANGES - changed pieceName to be more flexible
//          Added piece take information into moveData object (see array moves)
//          Gives reccomendations for both sides

moveNumber = 0;
playerTurn = true;
engine = new Worker('stockfish.js');
playerSide = 'w';
var engineMessages = [""];
var depthResults = [""];

var moves = [new moveData("", "", "", "")];

$(document).ready(function () {
    playerTurn = (playerSide == 'w') ? true : false;
    init();

});

var init = function () {
    var board
        , game = new Chess()
        , statusEl = $('#status')
        , fenEl = $('#fen')
        , pgnEl = $('#pgn');

    // do not pick up pieces if the game is over
    // only pick up pieces for the side to move
    var onDragStart = function (source, piece, position, orientation) {
        if (game.game_over() === true ||
            (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    };

	//Making black choose a random legal move to make
	var makeRandomMove = function() {
  var possibleMoves = game.moves();

  // game over
  if (possibleMoves.length === 0) return;

  var randomIndex = Math.floor(Math.random() * possibleMoves.length);
  game.move(possibleMoves[randomIndex]);
  board1.position(game.fen());
  updateStatus();
};
	
    var removeGreySquares = function () {
        $('#board .square-55d63').css('background', '');
    };
    var greySquare = function (square) {
        var squareEl = $('#board .square-' + square);

        var background = 'rgba(99, 59, 163, 0.53)';
        if (squareEl.hasClass('black-3c85d') === true) {
            background = 'rgba(99, 59, 163, 0.53)';
        }

        squareEl.css('background', background);
    };

    var onDrop = function (source, target) {
        removeGreySquares();

        // see if the move is legal
        var move = game.move({
            from: source
            , to: target
            , promotion: 'q' // NOTE: always promote to a queen for example simplicity
		});

        // illegal move
        if (move === null)
            return 'snapback';
        else {
            board1.position(game.fen());
        };
		updateStatus();
		window.setTimeout(makeRandomMove, 250);    //Computer makes random move for black   
    };

    var onMouseoverSquare = function (square, piece) {
        // get list of possible moves for this square
        var moves = game.moves({
            square: square
            , verbose: true
        });

        // exit if there are no moves available for this square
        if (moves.length === 0) return;

        // highlight the square they moused over
        greySquare(square);

        // highlight the possible squares for this piece
        for (var i = 0; i < moves.length; i++) {
            greySquare(moves[i].to);
        }
    };
    var onMouseoutSquare = function (square, piece) {
        removeGreySquares();
    };

    // update the board position after the piece snap 
    // for castling, en passant, pawn promotion
    var onSnapEnd = function () {
        board1.position(game.fen());
    };

    var updateStatus = function () {
        var status = '';

        var moveColor = 'White';
        if (game.turn() === 'b') {
            moveColor = 'Black';
        } else {
            //Increment tutor's move count
            movePlus();
        }

        // checkmate?
        if (game.in_checkmate() === true) {
            status = 'Game over, ' + moveColor + ' is in checkmate.';
        }

        // draw?
        else if (game.in_draw() === true) {
            status = 'Game over, drawn position';
        }

        // game still on
        else {
            status = moveColor + ' to move';
            if (game.turn() === playerSide) {
                // check?
                if (game.in_check() === true) {
                    status += ', ' + moveColor + ' is in check';
                    console.log('User is in check');
                    toggleCheck(true);
                    console.log('Check value: ' + inCheck ? 'true' : 'false');
                }
                console.log('Calling bestMove');
                bestMove();
            }

        }

        statusEl.html(status);
        fenEl.html(game.fen());
        pgnEl.html(game.pgn());
        playerTurn = (game.turn() == playerSide) ? true : false;
    };

    var cfg = {
        draggable: true
        , position: 'start'
        , onDragStart: onDragStart
        , onDrop: onDrop
        , onMouseoutSquare: onMouseoutSquare
        , onMouseoverSquare: onMouseoverSquare
        , onSnapEnd: onSnapEnd
    };
    board1 = ChessBoard('board', cfg);

    updateStatus();

}; // end init()

//Move data object template
function moveData(squareFrom, squareTo, movingPiece, takenPiece) {
    this.from = squareFrom;
    this.to = squareTo;
    this.piece = movingPiece;
    this.taken = takenPiece;
}

//Query the engine
function bestMove() {
    depthResults = [];
    engineMessages = [];
    engine.postMessage('position fen ' + board1.fen() + " " + playerSide);
    engine.postMessage('go depth 10');

};

//Message from the engine
engine.onmessage = function (event) {
    //Only advise on white's turn
    if (playerTurn) {
        //When the engine outputs 'bestmove' the search has finished
        if (String(event.data).substring(0, 8) == 'bestmove') {
            console.log('FINISHED');
            formatResults();
            //Initialise the tutor
            onReady(moves);
        } else {
            engineMessages.push(String(event.data).split(' pv')[1]);

        }
    };
};

//When the engine has finished outputting
function formatResults() {

    //Get the results from each depth
    for (i = 0; i < 10; i++) {
        if (engineMessages[i] != null) {
            depthResults.push(engineMessages[i].split("\u0020")[1]);
        }
    }

    moves = [];
    engineMessages = [];
    var positions = board1.position();
    for (i = 0; i < depthResults.length; i++) {
        console.log("Depth " + i + ": " + depthResults[i]);

        //If taking a piece in this move
        if (positions.hasOwnProperty(depthResults[i].substring(2, 4))) {
            moves.push(new moveData(depthResults[i].substring(0, 2), depthResults[i].substring(2, 4), pieceName(positions[depthResults[i].substring(0, 2)]), pieceName(positions[depthResults[i].substring(2, 4)])))

            // No pieces being taken
        } else {
            moves.push(new moveData(depthResults[i].substring(0, 2), depthResults[i].substring(2, 4), pieceName(positions[depthResults[i].substring(0, 2)]), "NONE"))
        }
    }

};

//Translation
function pieceName(text) {
    var piece = text.substring(1, 2);
    switch (piece) {
    case 'P':
        return 'Pawn';
        break;
    case 'K':
        return 'King';
        break;
    case 'Q':
        return 'Queen';
        break;
    case 'R':
        return 'Rook';
        break;
    case 'N':
        return 'Knight';
        break;
    case 'B':
        return 'Bishop';
        break;
    }
};

function printMoves() {
    for (i = 0; i < moves.length; i++) {
        console.log(moves[i]);
    }
};

function getMoves() {
    return moves;
};
