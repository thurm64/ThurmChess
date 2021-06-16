/*

Move Handler

*/
var solvedPortion = "";
var correctSolution = "";
var continuations = [];
var correctMoves = 0;
var totalMoves = 0;
var puzzlesSolved = 0;
var puzzlesAttempted = -1;
var hintUsed = false;

function loadFen(string) {

    var parts = string.split(" "); //seperate the FEN string into its parts
    var boardString = parts[0];
    var playing = parts[1];
    var castling = parts[2];
    var enpassant = parts[3];
    fiftyMove = parts[4];


    if (parts.length > 6) {
        // this is nonstandard, and only used in multiplayer games.
        pgn = atob(parts[6]); // The PGN (Move Log)
        updateMoveList();
        var extra = parts[7]; //todo: use the extra field for draw offers/resignations.

    }

    // convert move count to  ply
    var movecx = parts[5] * 2;
    if (!whitePly) {
        movecx += 1;
    }
    ply = movecx - 2; // set ply

    // set player to move
    if (playing == "w") {
        whitePly = true;
    } else {
        whitePly = false;
    }

    if (enpassant != "-") {
        epCol = enpassant.charCodeAt(0) - 65; // convert file to array index.
    }

    moveNo = parseInt(parts[5]); // set move count

    // Check the castling rights.
    blackKs = castling.includes("k");
    whiteKs = castling.includes("K");
    blackQs = castling.includes("q");
    whiteQs = castling.includes("Q");

    // Parse the board string to the array.
    boardString = boardString.replaceAll("8", "7 "); // parse down the gaps
    boardString = boardString.replaceAll("7", "6 ");
    boardString = boardString.replaceAll("6", "5 ");
    boardString = boardString.replaceAll("5", "4 ");
    boardString = boardString.replaceAll("4", "3 ");
    boardString = boardString.replaceAll("3", "2 ");
    boardString = boardString.replaceAll("2", "1 ");
    boardString = boardString.replaceAll("1", " ");

    var boardSplit = boardString.split("/"); // parse the / into rows
    var boardNew = [];
    for (var i in boardSplit) {
        boardNew.push(boardSplit[i].split(""));

    }
    boardArray = boardNew;
    setTimeout(drawPosition, 200); // Draw board with slight delay.
    setTimeout(endCheck, 100); // Check if game is over.
    document.getElementById("fen").value = makeFen();
    pgn = "";
   
}

function playContinuation() {
	try {
        var result = continuations.shift();
        var split = [result.substring(0, 2), result.substring(2, 4)];
        var to = result.substring(0, 2)
        var from = result.substring(2, 4)
        console.log(to);
        console.log(from);
        var fromBoi = (parseInt(from.substring(1)) - 1);
        selectedSquare = [7 - (parseInt(to.substring(1)) - 1), (to.charCodeAt(0) - 97)];
        legalMoves = findLegalMoves(selectedSquare[0], selectedSquare[1], true);
        promoteTo = result.split("=")[1];
        if(promoteTo === undefined) {
            promoteTo = null;
        }
        
        moveHandler((from.charCodeAt(0) - 97), 7 - fromBoi, true, promoteTo);    
        
	} catch(e) {
		console.log(e);
		
	}
	
	setTimeout(function() {solvedPortion = pgn}, 100);
		
	}

function moveHandler(x, y, callStockFish = true, promoteTo = null) {
    var epCap = false;
    var deepCopy = deepCopyFunction(boardArray);
    for (var a = 0; a < legalMoves.length; a++) {
        var move = legalMoves[a];
        var sely = selectedSquare[0];
        var selx = selectedSquare[1];
        var piece = boardArray[selectedSquare[0]][selectedSquare[1]];
        epCol = -1; //reset en passant.
        promote = null;
        if(promoteTo == null) {
            promoteTo = document.getElementById("selectPromotion").value.toUpperCase();
        }


        if (move[0] == y && move[1] == x) {

            moveHistory.push(makeFen()); // if there is a legal move, add this position to the game history. 
            if(piece.toLowerCase() == "p") {
                fiftyMove = 0;
            }
            if (piece.toLowerCase() == "p" && Math.abs(sely - y) > 1) {
                epCol = x; //2 spaces = en passant possible next turn.
            }
            //if an en passant move is made, capture the piece. 
            else if (piece == "p" && selx != x && boardArray[y][x] == " ") {
                boardArray[y - 1][x] = " ";
                epCap = true; // used so capture sound will play without a piece being taken directly.
            } else if (piece == "P" && selx != x && boardArray[y][x] == " ") {
                boardArray[y + 1][x] = " ";
                epCap = true;
            }
            //if a rook is moved or captured, castling is no longer possible.
            else if ((piece == "R" && sely == 7 && selx == 7) || (boardArray[y][x] == "R" && y == 7 && x == 7)) {
                whiteKs = false;
            } else if ((piece == "R" && sely == 7 && selx == 0) || (boardArray[y][x] == "R" && y == 7 && x == 0)) {
                whiteQs = false;
            } else if ((piece == "r" && sely == 0 && selx == 7) || (boardArray[y][x] == "r" && y == 0 && x == 7)) {
                blackKs = false;
            } else if ((piece == "r" && sely == 0 && selx == 0) || (boardArray[y][x] == "r" && y == 0 && x == 0)) {
                blackQs = false;
            }
            //if a pawn reaches the end of the board, get the promotion piece.
            else if (piece == "P" && y == 0) {
                promote = promoteTo;

            } else if (piece == "p" && y == 7) {
                promote = promoteTo.toLowerCase();

            }
            //white king moves
            else if (piece == "K") {
                //if castling occured, swap the rooks.
                if (Math.abs(selx - x) > 1) {

                    if (selx - x < 0) {
                        boardArray[7][7] = " ";
                        boardArray[7][5] = "R";
                    } else {
                        boardArray[7][0] = " ";
                        boardArray[7][3] = "R";
                    }
                }
                //regardless of if castled or not, castling is no longer possible.
                whiteKs = false;
                whiteQs = false;

            }
            //black king moves.
            else if (piece == "k") {
                //same as above.
                if (Math.abs(selx - x) > 1) {
                    if (selx - x < 0) {
                        boardArray[0][7] = " ";
                        boardArray[0][5] = "r";
                    } else {
                        boardArray[0][0] = " ";
                        boardArray[0][3] = "r";
                    }
                }
                blackQs = false;
                blackKs = false;

            }


            var sound = null;
            //change the turn.
            whitePly = !whitePly;
            //change sound based on move.
            if (boardArray[y][x] != " " || epCap) {
                sound = new Audio("sounds/capture.wav");
                fiftyMove = 0;

            } else {
                sound = new Audio("sounds/move.wav");
            }
            if (promote === null) {
                //move piece and empty it's previous location.
                boardArray[y][x] = piece;
                boardArray[selectedSquare[0]][selectedSquare[1]] = " ";
            } else {
                //if promoted pawn, swap with the upgraded piece.
                boardArray[y][x] = promote;
                boardArray[selectedSquare[0]][selectedSquare[1]] = " ";
            }
            pgn += parseAlgebraicNotation(y, x, deepCopy); // add move to the moves.
            if (isInCheck(boardArray)) {
                sound = new Audio("sounds/check.wav"); //change sound if in check.

            }
            sound.play();
            //update move counts.
            if (whitePly) {
                moveNo += 1;
                fiftyMove++;
            }
            
            ply += 1
            
                setTimeout(checkCorrect, 500);
            
            break;
        }
    }
    //These are to be done regardless of if there is a move or not.
    legalMoves = [];
    selectedSquare = [-1, -1];
    setTimeout(drawPosition, 100);
    setTimeout(endCheck, 50);
    document.getElementById("fen").value = makeFen();
    updateFen();
    updateMoveList();
    

    if (callStockFish) { //if playing the bot, tell the bot to make a move
        setTimeout(makeStockfishMove, 2000); //delayed to prevent the bot from moving multiple times in a row.
    }

}

function loadPuzzle() {
    hintUsed = false;
    var puzzle = puzzles[Math.floor(Math.random() * puzzles.length)]
    puzzlesAttempted++;
    continuations = puzzle.replies;
    loadFen(puzzle.fen);
    correctSolution = puzzle.moves;
    console.log(correctSolution);
    if( correctSolution.lastIndexOf(" 1") != -1) {
    correctSolution = correctSolution.substring(0, correctSolution.lastIndexOf(" 1"));
    }
    if( correctSolution.lastIndexOf(" 0") != -1) {
    correctSolution = correctSolution.substring(0, correctSolution.lastIndexOf(" 0"));
    }
    console.log(correctSolution)
    setTimeout(playContinuation, 1000);
    if(whitePly) {
        isBlack = true;
        isWhite = false;
    } else {
        isBlack = false;
        isWhite = true;
    }
}

function checkCorrect() {
    var parsedPgn = pgn.replaceAll("\n", " ");
    parsedPgn.trim();
 
        parsedPgn = parsedPgn.substring(0, parsedPgn.lastIndexOf(" "));
    
    parsedPgn = parsedPgn.replaceAll("0-0-0", "O-O-O");
    parsedPgn = parsedPgn.replaceAll("0-0", "O-O");
    
	var trimmedSolution = correctSolution.replace(/[0-9]+\.\.\./, "");
    trimmedSolution = trimmedSolution.trim();
var sound = new Audio();
    if(!correctSolution.includes(parsedPgn)) {
    	console.log(parsedPgn + " does NOT match " + correctSolution);
        undo();
        pgn = solvedPortion;
        sound = new Audio("sounds/puzzle_incorrect.mp3");
        
        totalMoves++;
    } else if(solvedPortion != pgn) {
    	console.log("'" + parsedPgn + "' is not complete based on '" + trimmedSolution + "'");
        if((!whitePly && isWhite || whitePly && isBlack)) {
        sound = new Audio("sounds/puzzle_correct.mp3");
        }
        solvedPortion = pgn;
        playContinuation();
        totalMoves++;
        correctMoves++;
    } else { 
    console.log(trimmedSolution)
    console.log(parsedPgn)
    }
    if(trimmedSolution == parsedPgn.trim()) {
        sound = new Audio("sounds/checkmate.mp3");
        if(!hintUsed) {
        puzzlesSolved++;
        }
            loadPuzzle();   
    }
    sound.play();
}
function endCheck() {
    var elem = document.getElementById("stats");
    var accuracy = correctMoves / totalMoves;
    accuracy *= 100;
    accuracy = Math.round(accuracy, 2);
    if(accuracy == NaN) {
        accuracy = 0;
    }
    elem.value = "Solved: " + puzzlesSolved + "/" + puzzlesAttempted + "\nAccuracy: " + correctMoves + "/" + totalMoves + " (" + accuracy + "%)";
}
loadPuzzle();