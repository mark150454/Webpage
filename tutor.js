var moveCount = 0;
var inCheck = false;
var names = ['Pawn', 'Rook', 'Knight', 'Bishop', 'Queen', 'King']


//Engine has finished calculating
var onReady = function (moves) {

    //If it is the first move
    if (moveCount == 1) {
        beginOutput(response_startMove());
        return;
    }

    //if you can take a piece
    var possibleTakes = getCandidates('taken', moves);
    if (possibleTakes.length > 0) {
        beginOutput(response_canTake(possibleTakes));
        return;
    }

    //If the move is to develop a piece, and it is in the early game
    var element = getPart(moves[moves.length - 1], 'from', 'rank');
    if ((moveCount < 8) && ((element == '1') && getPlayerSide() == 'w') || ((element == '8') && getPlayerSide() == 'b')) {
        beginOutput(buildSentence(['Move a &p1 off the back row.', 'Develop a &p1 off of the back rank', 'You should get a &p1 into the battle'], moves[moves.length - 1]['piece']));
        return;
    }

    //If in check
    if (inCheck) {
        beginOutput(response_check(moves));
        toggleCheck(false);
        return;
    };

    beginOutput('RESPONSE NOT FORMULATED');
};

var movePlus = function () {
    moveCount++;
    console.log(moveCount);
};

function buildSentence(sentenceArray, targetPiece) {
    //Select a random sentence structure
    var suggestion = sentenceArray[Math.floor((Math.random() * (sentenceArray.length - 1)) + 0)];
    //Add contextual information to the string
    suggestion = suggestion.replace('&p1', targetPiece);
    return suggestion;
};

function beginOutput(response) {
    //40ms per letter
    var typeTime = response.length * 40;
    if (typeTime < 1500) {
        typeTime = 1500;
    }
    document.getElementById("typing").innerHTML = "Typing...";
    //Time for typing
    setTimeout(pushResponse, typeTime, response);
};

function toggleCheck(value) {
    inCheck = value;
};

function pushResponse(message) {
    document.getElementById("response").innerHTML = message;
    var d = new Date();
    document.getElementById("typing").innerHTML = "Last message recieved at " + d.toLocaleTimeString();
};

function modePiece(moves) {
    //PRNBQK
    var pieceCount = [0, 0, 0, 0, 0, 0];
    for (i = 0; i < moves.length; i++) {
        switch (moves[i]['from']) {
        case 'Pawn':
            pieceCount[0]++;
            break;
        case 'Rook':
            pieceCount[1]++;
            break;
        case 'Knight':
            pieceCount[2]++;
            break;
        case 'Bishop':
            pieceCount[3]++;
            break;
        case 'Queen':
            pieceCount[4]++;
            break;
        case 'King':
            pieceCount[5]++;
            break;
        }

    }

    var best = 0;
    for (i = 0; i < 6; i++) {
        if (pieceCount[i] > best) {
            best = i;
        }
    }

    switch (best) {
    case 0:
        return 'Pawn';
        break;
    case 1:
        return 'Rook';
        break;
    case 2:
        return 'Knight';
        break;
    case 3:
        return 'Bishop';
        break;
    case 4:
        return 'Queen';
        break;
    case 5:
        return 'King';
        break;
    };
};

function response_startMove() {

    var sentences = [
        "In the opening, you want to try and maximise your influence on the center of the board."

        
        , "You should try and get pieces off the back row to try and control the center of the board."

        
        , "You may want to start by moving either a pawn or a knight towards the middle of the board."

        
        , "There are only two pieces you can move in the beginning, the knight or the pawn."

        
        , "Controlling the center of the board is critical in the opening moves to give you a more secure mid-game."

        
        , "Try to attack middle squares with your pieces, this will secure you with a better middle game."

        
        , "The more influence you have on the center of the board, the more you restrict your opponent's moves."

        
        , "Each piece has its highest possible range of candidate moves in the center of the board. You should aim to have them there."

        
        , "It is easier to secure checks if you have your pieces securely rooted in the center of the board."

        
        , "You should aim to hold control of the King's and Queen's files 'D' and 'E' during the opening."]

    return sentences[Math.floor((Math.random() * 9) + 0)]
};

function response_check(moves) {
    var candidatePieces = getCandidates('piece', moves);
    var responseString = '';

    //Deal with multiple piece selections
    for (i = 0; i < candidatePieces.length; i++) {
        if (i == candidatePieces.length - 1) {
            responseString = responseString + ((candidatePieces.length > 1) ? ' or ' + candidatePieces[i] : candidatePieces[i]);
        } else {
            responseString = ((i < candidatePieces.length - 1) ? candidatePieces[i] : responseString + ', ' + candidatePieces[i]);
        }

    }

    toggleCheck(false);

    var suggestions = ['Moving &p1 will prevent check'

        
        , 'You can stop check by moving your &p1'

        
        , 'The best move to get out of check involves your &p1 '

        
        , 'You may move your &p1'

        
        , 'Your best bet is to move the &p1'

        
        , 'Try moving your &p1 to remove check'];

    return buildSentence(suggestions, responseString);

};

function response_canTake(possibleTakes) {
    var suggestions = ['You can take their &p1'

        
        , 'Consider taking their &p1'];
    //Deal with multiple piece selections
    if (possibleTakes.length == 1) {
        return buildSentence(suggestions, possibleTakes[0]);
    } else if (possibleTakes.length >= 2) {
        var endofSuggestion = possibleTakes[0] + " or " + possibleTakes[1] + ".";
        if (possibleTakes.length > 2) {
            for (i = 2; i < possibleTakes.length; i++) {
                endofSuggestion = possibleTakes[i] + ", " + endofSuggestion;
            }
        }
        console.log(endofSuggestion);
        return buildSentence(suggestions, endofSuggestion);
    }

};

function getCandidates(attribute, moves) {

    //Get the names of all the pieces mentioned in a specific attribute
    var candidatePieces = [];
    var pieces = [false, false, false, false, false, false];
    for (i = 0; i < moves.length; i++) {
        switch (moves[i][attribute]) {
        case 'Pawn':
            pieces[0] = true;
            break;
        case 'Rook':
            pieces[1] = true;
            break;
        case 'Knight':
            pieces[2] = true;
            break;
        case 'Bishop':
            pieces[3] = true;
            break;
        case 'Queen':
            pieces[4] = true;
            console.log("FOUND THE QUEEN");
            break;
        case 'King':
            pieces[5] = true;
            break;
        };

    }
    for (i = 0; i < pieces.length; i++) {
        if (pieces[i] == true)
            candidatePieces.push(names[i]);
    }
    return candidatePieces;
};

//Get the value of a cell e.g G5 File = G, Rank = 5
function getPart(move, toFrom, axis) {
    if (axis == 'rank')
        return move[toFrom].substr(1, 2);
    if (axis == 'file')
        return move[toFrom].substr(0, 1);
}