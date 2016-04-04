var moveCount = 0;
var inCheck = false;
var names = ['Pawn', 'Rook', 'Knight', 'Bishop', 'Queen', 'King']


//Engine has finished calculating
var onReady = function (moves) {

    if (moveCount == 1) {
        beginOutput(response_startMove());
        return;
    }
    
    console.log(inCheck ? 'true' : 'false');
    if (inCheck){
        console.log('check condition succeeded');
        beginOutput(response_check(moves));
        toggleCheck(false);
        return;
    };
    
    beginOutput('RESPONSE NOT FORMULATED');
    //if you can take a piece, make suggestions
    //
};

var movePlus = function () {
    moveCount++;
    console.log(moveCount);
};

function beginOutput(response) {
    //60ms per letter
    var typeTime = response.length * 40;
    if (typeTime < 1500) {
        typeTime = 1500;
    }
    isTyping();
    setTimeout(pushResponse, typeTime, response);
};

function toggleCheck(value){inCheck = value;
                      console.log('Check toggled');};

function isTyping() {
    document.getElementById("typing").innerHTML = "Typing...";
};

function pushResponse(message) {
    console.log(message);
    document.getElementById("response").innerHTML = message;
    var d = new Date();
    document.getElementById("typing").innerHTML = "Last message recieved at " + d.toLocaleTimeString();
};

function modePiece(moves) {
    //PRNBQK
    console.log("doing");
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
        "In the opening, you want to try and maximise your influence on the center of the board.",
        "You should try and get pieces off the back row to try and control the center of the board.",
        "You may want to start by moving either a pawn or a knight towards the middle of the board.",
        "There are only two pieces you can move in the beginning, the knight or the pawn.",
        "Controlling the center of the board is critical in the opening moves to give you a more secure mid-game.",
        "Try to attack middle squares with your pieces, this will secure you with a better middle game.",
        "The more influence you have on the center of the board, the more you restrict your opponent's moves.",
        "Each piece has its highest possible range of candidate moves in the center of the board. You should aim to have them there.",
        "It is easier to secure checks if you have your pieces securely rooted in the center of the board.",
        "You should aim to hold control of the King's and Queen's files 'D' and 'E' during the opening."]
    
    return sentences[Math.floor((Math.random() * 9) + 0)]
};

function response_check(moves){
    console.log("Response check called");
    //PRNBQK
    /*var pieces = [false, false, false, false, false, false];
    
    var candidatePieces = [];
    var responseString = '';
    for (i = 0; i < moves.length; i++)
        {
            switch (moves[i]['piece']) {
                case 'Pawn': pieces[0] = true;
                    break;
                case 'Rook': pieces[1] = true;
                    break;
                case 'Knight': pieces[2] = true;
                    break;
                case 'Bishop': pieces[3] = true;
                    break;
                case 'Queen': pieces[4] = true;
                    break;
                case 'King': pieces[5] = true;
            };
                
        }
    for (i = 0; i < pieces.length; i++)
        {
            if (pieces[i] == true)
                candidatePieces.push(names[i]);
        }*/
    
    var candidatePieces = getCandidates('piece', moves);
    
    var responseString = '';
    
    for (i = 0; i < candidatePieces.length; i++){
        if (i == candidatePieces.length - 1){
            responseString = responseString + ((candidatePieces.length > 1) ? ' or ' + candidatePieces[i] : candidatePieces[i]);}
        else{
            
            responseString = ((i < candidatePieces.length - 1) ? candidatePieces[i] : responseString + ', ' + candidatePieces[i]);}
            
    }
    
    toggleCheck();
    
    var suggestions = ['The pieces you can move to stop the check are: ', 
                       'You can stop the check by moving your ', 
                      'The best move to get out of check involves your ', 
                      'You may move any of the pieces '];
    
    return suggestions[Math.floor((Math.random() * 3) + 0)] + responseString;
};

function getCandidates(attribute, moves)
{
    var candidatePieces = [];
    var pieces = [false, false, false, false, false, false];
 for (i = 0; i < moves.length; i++)
        {
            switch (moves[i][attribute]) {
                case 'Pawn': pieces[0] = true;
                    break;
                case 'Rook': pieces[1] = true;
                    break;
                case 'Knight': pieces[2] = true;
                    break;
                case 'Bishop': pieces[3] = true;
                    break;
                case 'Queen': pieces[4] = true;
                    break;
                case 'King': pieces[5] = true;
                    break;
            };
                
        }   
    for (i = 0; i < pieces.length; i++)
        {
            if (pieces[i] == true)
                candidatePieces.push(names[i]);
        }
    return candidatePieces;
};