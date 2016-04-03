var moveCount = 0;
//Test addition
//Engine has finished calculating
var onReady = function (moves){
    
    if (moveCount == 1)
        {
            beginOutput(response_startMove());
            return;
        } 
    
    beginOutput("You should move your " + modePiece(moves));
    
        
    
};

function movePlus(){
    moveCount++;
    console.log(moveCount);
};

function beginOutput(response)
{
    //60ms per letter
    var typeTime = response.length * 40;
    if (typeTime <  1500) {typeTime = 1500;}
    isTyping();
    setTimeout(pushResponse, typeTime, response);
};

function isTyping(){document.getElementById("typing").innerHTML = "Typing...";};

function pushResponse(message){
    console.log(message);
    document.getElementById("response").innerHTML = message;
    var d = new Date();
    document.getElementById("typing").innerHTML = "Last message recieved at" + d.toLocaleTimeString();
};

function modePiece(moves){
    //PRNBQK
    console.log("doing");
    var pieceCount = [0, 0, 0, 0, 0, 0];
    for (i = 0; i < moves.length; i++)
        {
            switch(moves[i]['from']) {
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
    for (i = 0; i < 6; i++)
        {
            if(pieceCount[i] > best)
                {
                    best = i;
                }
        }
    
    switch(best){
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

function response_startMove(){
    switch(Math.floor((Math.random() * 9) + 0)) {
        case 0:
            return "In the opening, you want to try and maximise your influence on the center of the board."
            break;
        case 1:
            return "You should try and get pieces off the back row to try and control the center of the board."
            break;
        case 2:
            return "You may want to start by moving either a pawn or a knight towards the middle of the board."
            break;
        case 3:
            return "There are only two pieces you can move in the beginning, the knight or the pawn."
            break;
        case 4:
            return "Controlling the center of the board is critical in the opening moves to give you a more secure mid-game."
            break;
        case 5:
            return "Try to attack middle squares with your pieces, this will secure you with a better middle game."
            break;
        case 6:
            return "The more influence you have on the center of the board, the more you restrict your opponent's moves."
            break;
        case 7:
            return "Each piece has its highest possible range of candidate moves in the center of the board. You should aim to have them there."
            break;
        case 8:
            return "It is easier to secure checks if you have your pieces securely rooted in the center of the board."
            break;
        case 9:
            return "You should aim to hold control of the King's and Queen's files 'D' and 'E' during the opening."
            break;
    }
};