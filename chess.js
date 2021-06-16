/*

Instance data 

*/

//Error Handler
window.onerror = function(e, s, l, c) {
   // window.alert("Error\n--------------------\n" + e + "\n-------------------\n" + s + " @ " + l + ":" + c);
}
//Canvas
const canvas = document.getElementById("board");
var ctx = canvas.getContext("2d");
//Sliders

//Canvas Attributes
const width = canvas.width;
var aspectRatio = canvas.clientWidth / canvas.width;
const squareSize = width / 8;
var FILL_DARK_SQUARES = "#999999";
var FILL_LIGHT_SQUARES = "#242739";
var FILL_DARK_PIECES = "#000000";
var FILL_LIGHT_PIECES = "#FFFFFF";
var FILL_LIGHT_BORDERS = "#000000";
var FILL_DARK_BORDERS = "#FFFFFF";
var FILL_SELECTED_SQUARE = "#6c2025";
//Board State
var fiftyMove = 0;
var moveHistory = [];
var isPieceSelected = false;
var selectedSquare = [-1, -1];
var blackKs = true; //Black Kingside Castling
var blackQs = true; //Black Queenside Castling
var whiteKs = true; //White Kingside Castling
var whiteQs = true; //White Queenside Castling
var epCol = -1; // ep = en passant.
var lastMove = "";
var moveNo = 1; //move number
var gameOver = false;
var isBlack = false;
var drawAgreed = false;
var whiteResignation = false;
var blackResignation = false;
var whitePly = true; //ply == 1/2 of a turn.
var ply = 0;
var pgn = ""; //portable game notation.
var legalMoves = [];
var boardArray = [
    ["r", "n", "b", "q", "k", "b", "n", "r"],
    ["p", "p", "p", "p", "p", "p", "p", "p"],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    [" ", " ", " ", " ", " ", " ", " ", " "],
    ["P", "P", "P", "P", "P", "P", "P", "P"],
    ["R", "N", "B", "Q", "K", "B", "N", "R"]
];

/* 
    Cookie functionality
*/
function setCookie(name,value,days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}
function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}
function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

//updates the user's cosmetic preferences.
function updateSkin() {
    var skinArray = [FILL_DARK_SQUARES,FILL_LIGHT_SQUARES,FILL_DARK_PIECES,FILL_LIGHT_PIECES,FILL_LIGHT_BORDERS,FILL_DARK_BORDERS, FILL_SELECTED_SQUARE]
    setCookie("skin", "" + skinArray, 100000) 
}
//loads the user's cosmetic preferences.
function loadSkin() {
    var cooky = getCookie("skin")
    if(cooky == null) {
        updateSkin();
        return;
    } 
    var skins = cooky.split(",");

    FILL_DARK_SQUARES = skins[0];
    document.getElementById("fds").value = FILL_DARK_SQUARES;
    
    FILL_LIGHT_SQUARES = skins[1];
    document.getElementById("fls").value = FILL_LIGHT_SQUARES;
    
    FILL_DARK_PIECES = skins[2];
     document.getElementById("fdp").value = FILL_DARK_PIECES;
     
    FILL_LIGHT_PIECES = skins[3];
     document.getElementById("flp").value = FILL_LIGHT_PIECES;
     
    FILL_LIGHT_BORDERS =skins[4];
     document.getElementById("fdo").value = FILL_DARK_BORDERS;
     
    FILL_DARK_BORDERS = skins[5];
     document.getElementById("flo").value = FILL_LIGHT_BORDERS;
     
    FILL_SELECTED_SQUARE = skins[6];
    document.getElementById("fss").value = FILL_SELECTED_SQUARE;
}
loadSkin(); // load saved style data.

document.querySelectorAll("td input").forEach(function(el) { 
    el.addEventListener("change", function(e){
        updateSkin();
    }, false);
})

/*

Network functions -- need chessOnline.js to override to add networking.

*/

//Tell AI to move.
function makeStockfishMove() {
    return;

}

//Send FEN of current game to server.
function updateFen(extra = "") {
    return;
}

//Check for opponent move.
function checkFenForChanges(force = false) {
    return;
}

/*

	Event listeners

*/
document.body.onclick = function() {
    document.getElementById("boardOverlay").style.visibility = "hidden";
    endCheck();
    drawPosition();
    
  
}
document.body.onload = function() {
    canvas.addEventListener("click", mouseAction);
}

var g = document.getElementsByTagName("g");
var a = document.getElementsByTagName("path");

function fixAllSvg() {

    for(var i = 0; i < a.length; i++) {
        if(a[i].parentElement.parentElement.id.includes("white")) {
            if(a[i].attributes != null && a[i].attributes.fill != null)
            a[i].attributes.fill.value = FILL_LIGHT_PIECES;
            if(a[i].attributes != null && a[i].attributes.stroke != null)
            a[i].attributes.stroke.value = FILL_LIGHT_BORDERS;
        } else if(a[i].parentElement.id.includes("black") || a[i].parentElement.parentElement.id.includes("black")) {
            if(a[i].attributes != null && a[i].attributes.fill != null)
            a[i].attributes.fill.value = FILL_DARK_PIECES;
            if(a[i].attributes != null && a[i].attributes.stroke != null)
            a[i].attributes.stroke.value = FILL_DARK_BORDERS;
        }
    }
    for(var i = 0; i < g.length; i++) {
        if(g[i].parentElement.id.includes("white") || g[i].parentElement.parentElement.id.includes("white")) {
        if(g[i].attributes != null && g[i].attributes.fill != null)
        g[i].attributes.fill.value = FILL_LIGHT_PIECES;
        if(g[i].attributes != null && g[i].attributes.stroke != null)
        g[i].attributes.stroke.value = FILL_LIGHT_BORDERS;
        } else if(g[i].parentElement.id.includes("black") || g[i].parentElement.parentElement.id.includes("black")) {
            if(g[i].attributes != null && g[i].attributes.fill != null)
            g[i].attributes.fill.value = FILL_DARK_PIECES;
            if(g[i].attributes != null && g[i].attributes.stroke != null)
            g[i].attributes.stroke.value = FILL_DARK_BORDERS;
        }
   
    }
}
    
function mouseAction(event) {
   
    if(gameOver) { return; }
    var mouseX = event.clientX / aspectRatio;
    var mouseY = event.clientY / aspectRatio;
    var x = Math.floor(mouseX / squareSize);

    var y = Math.floor(mouseY / squareSize);
    if (isBlack) {
        y = 7 - y; //black's board is inverted to have black pieces at the bottom.
        x = 7 - x; // and mirrored

    }


    if (event.button === 0) { //left click.
        if (selectedSquare[0] == -1 || !isPieceSelected || boardArray[y][x] != " ") { // piece is being selected.
            var piece = boardArray[y][x]
            if (piece != " " && isTurn(piece)) {
                isPieceSelected = true;
                selectedSquare = [y, x];
                drawPosition();
                legalMoves = [];
                legalMoves = findLegalMoves(y, x, true);


            } else { //piece is being moved (or attempted to be moved)
                moveHandler(x, y);
                isPieceSelected = false;
            }


        } else { //click on empty square.
            moveHandler(x, y);
            isPieceSelected = false;
        }
    }
    drawPosition();
}

//Arrow annotations.
document.oncontextmenu = function(event) {

    event.preventDefault();
    var mouseX = event.clientX;
    var mouseY = event.clientY;
    var x = Math.floor(mouseX / squareSize);
    var y = Math.floor(mouseY / squareSize);
    if (x < -1 || x > 7 || y < -1 || y > 7) {
        return;
    }
    event.preventDefault();
    var color = "rgba(192, 96, 96, 0.7)";
    if (event.shiftKey) {
        color = "rgba(96, 192, 96, 0.7)"
    }
    if (event.ctrlKey) {
        color = "rgba(96, 96, 192, 0.7)"
    }
    if (event.altKey) {
        color = "rgba(192, 192, 96, 0.7)"
    }
    if (isPieceSelected) {
        selectedSquare = [-1, -1]
        isPieceSelected = false;
    }
    if (selectedSquare[0] == -1) { //2 squares have to be selected.
        selectedSquare = [y, x];
        return;
    } else {
        drawArrow(ctx, x, y, selectedSquare[1], selectedSquare[0], color);
        selectedSquare = [-1, -1];
    }
}

/*

Display functions

*/


// End of game display
function sendDisplay(msg) {
    document.getElementById("boardOverlay").style.visibility = "visible"
    if (window.isOnlineGame) {
        var split = window.location.href;
        split = split.replace("blackPlayer", "placeholder");
        split = split.replace("whitePlayer", "blackPlayer"); // switch white and black players for next game.
        split = split.replace("placeholder", "whitePlayer");
        var split = split.split("id=");
        split = split[0] + "id=" + (parseInt(split[1]) + 1); // increment the game ID.
        document.getElementById("boardOverlay").innerHTML = "<h4 style='font-weight: regular'>" + msg + "<br><a href = \"" + split + "\">Play Again</a></h4>"
    } else {
        document.getElementById("boardOverlay").style.visibility = "visible"
        document.getElementById("boardOverlay").innerHTML ="<h4 style='font-weight: regular'>" + msg + "<br><a href = \"" + self.location + "\">Play Again</a></h4>"
    }
}
function sendDrawDisplay() {
    document.getElementById("boardOverlay").style.visibility = "visible";
    if (window.isOnlineGame) {
        document.getElementById("boardOverlay").style.visibility = "visible";
        document.getElementById("boardOverlay").innerHTML ="<h4 style='font-weight: regular'>Your opponent has offered a draw. <br><button onclick='updateFen(\"drawAccepted\")'>Accept</button><button onclick='updateFen(\"\"); document.getElementById(\"boardOverlay\").style.visibility = \"hidden\"'>Decline</button></h4>";
    } else {
        
    }
}
// Other messages
function sendDisplayInfo(msg) {
    document.getElementById("boardOverlay").style.visibility = "visible"
    document.getElementById("boardOverlay").innerHTML = msg;
}

// Update PGN text
function updateMoveList() {
    setTimeout(function() {
        document.getElementById("gamePgn").value = pgn;
        updateOpening();
    }, 500);

}

// Update opening text.
function updateOpening() {
    var opening = findOpeningWithFen(makeFen());
    if (opening !== null) {
        document.getElementById("opening").innerHTML = opening;
    }
}

//Undo move
function undo() {
    if (!gameOver && moveHistory.length != 0 && pgn != "") {
        loadFen(moveHistory.pop())
        ply--;
        pgn = pgn.substring(0, pgn.lastIndexOf(" ")) //get last move or trailing space as white.
        if (whitePly) {
            pgn = pgn.substring(0, pgn.lastIndexOf(" ")); //remove last move
            if (pgn.lastIndexOf("\n") != -1) {
                pgn = pgn.substring(0, pgn.lastIndexOf("\n") + 1) // remove number.
            } else {
                pgn = "";
            } //if white moved last, we need to remove the number.
        } else {
            pgn += " "; //readd trailing space if necessary
        }
        drawPosition(); //redraw
        updateMoveList(); //update pgn and opening.

    }
}

//Converts a FEN string to the book move. 
//OPENING_BOOK is imported from a file and can be removed.
function findOpeningWithFen(fen) {
    var open = OPENING_BOOK.find(item => {
        return fen.includes(item.fen.split(" ")[0] + " " + item.fen.split(" ")[1] + " " + item.fen.split(" ")[2]); // en passant squares don't work correctly with the opening book.  
    })
    
    if (open.eco != null) {
        if (open.eco == "") {
            return open.name; //for puzzle / endgame practice positions.
        }
        return open.eco + ": " + open.name;
    }
    //return nothing if it's not found.
}

// Opening Search
// todo: implement this into the analysis.
function findOpeningWithName(openingName) {
    var open = OPENING_BOOK.find(item => {
        return item.name.includes(openingName);
    })
    return open;
}

/*

	FEN functions

	FEN stands for Forsyth-Edwards Notation.
	It is a human-readable, but optimized way of representing a chess position as a string.

*/

//Loads a FEN string into the game.
function loadFen(string) {
    var requiresRedraw = false;
    var parts = string.split(" "); //seperate the FEN string into its parts
    var boardString = parts[0];
    var playing = parts[1];
    var castling = parts[2];
    var enpassant = parts[3];
    fiftyMove = parts[4];
    moveNo = parseInt(parts[5]);
    //set player to move.
    if (playing == "w") {
        whitePly = true;
    } else {
        whitePly = false;
    }

    if (parts.length > 6) {
        // this is nonstandard, and only used in multiplayer games.
        pgn = atob(parts[6]); // The PGN (Move Log)
        updateMoveList();
        
        var extra = parts[7]; //todo: use the extra field for draw offers/resignations.
        console.log(extra);
        if(extra == "whiteResign") {
            whiteResignation = true;
            endCheck();
            
        }
        if(extra == "blackResign") {
            blackResignation = true;
            endCheck();
        }
        if(isBlack && extra == "drawOfferWhite") {
            if(isBlack) {
            sendDrawDisplay();
            }
            return;
        }
        if(extra == "drawOfferBlack") {
            if(isWhite) {
            sendDrawDisplay();
            }
            return;
        }
        if(extra == "drawAccepted") {
            drawAgreed = true;
            endCheck();
        }
        
    } else {
        if(typeof puzzles !== "undefined") {
        pgn = " ";
        if(!whitePly) {
            pgn = moveNo + "..."
        }
        }
    }
    
   


    // convert move count to  ply
    var movecx = parts[5] * 2;
    if (!whitePly) {
        movecx += 1;
    }
    ply = movecx - 2; // set ply


    if (enpassant != "-") {
        epCol = enpassant.charCodeAt(0) - 65; // convert file to array index.
    }

     // set move count

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
    // Check if game is over.
    document.getElementById("fen").value = makeFen();
}
// Makes a FEN position from board state
function makeFen() {

    var fen = "";
    //This is just the reverse of the prior function.
    for (var r in boardArray) {
        var spaceCount = 0;
        for (var c in boardArray[0]) {
            if (boardArray[r][c] !== " ") {
                if (spaceCount != 0) {
                    fen += spaceCount; //add number for gap.

                }
                fen += boardArray[r][c]; //add piece to fen
                spaceCount = 0;
            } else {
                spaceCount++; //increment gap
            }
        }
        if (spaceCount != 0) {
            fen += spaceCount;

        }
        if (r != 7) {
            fen += "/"; //add line seperator
        }
    }
    fen += " "
    // castling rights.
    if (whitePly) {
        fen += "w"

    } else {
        fen += "b"
    }
    fen += " ";
    if (whiteKs) {
        fen += "K"
    }
    if (whiteQs) {
        fen += "Q"
    }
    if (blackKs) {
        fen += "k"
    }
    if (blackQs) {
        fen += "q"
    }
    if (!(whiteKs || whiteQs || blackKs || blackQs)) {
        fen += "-"
    }
    fen += " ";
    //en passant
    if (epCol != -1) {
        if (whitePly) {
            fen += String.fromCharCode(65 + epCol) + 6;
        } else {
            fen += String.fromCharCode(65 + epCol) + 3;
        }
    } else {
        fen += "-";
    }
    //Add last bits.
    fen += " " + fiftyMove + " ";
    fen += moveNo;
    fen.replaceAll("  ", " - ") // replace empty arguments with a dash to comply with the FEN standard.
    return fen;

}

/*

Board Utility Functions

*/

//Check if the piece on p1 is controlled by the player who can move.
function isTurn(p1) {
    return (p1.toUpperCase() == p1) == whitePly;
}

//Check if the piece on p2 is friendly.
function isFriendly(p1, p2) {
    return (p1.toLowerCase() == p1) == (p2.toLowerCase() == p2);
}

//Check if there is a piece blocking p1 moving to p2, or the edge of the board.
function isObstructed(p1, p2) {
    return p2 === undefined || ((p1.toLowerCase() == p1) == (p2.toLowerCase() == p2) && p2 != " ");
}

function isThreefoldRepetition() {
    var rept = 0;
    for(var i in moveHistory) {
        rept = 0;
        var str = moveHistory[i].split(" ")[0] + " " + moveHistory[i].split(" ")[1] + " " + moveHistory[i].split(" ")[2];
        for(var j in moveHistory) {
            if(moveHistory[j].includes(str)) {
                rept++;
            }
            if(rept > 2) {
                return true;
            }
        }
    }
    return false;
}
//finds endgames with insufficient material. note that this is not strictly following the chess rules, as king and bishop vs king and same color bishop are not included
function isInsufficientMaterial() {
    var insufficientCombinations = ["BKk", "Kbk", "KNk", "Kkn", "Kk"];
        
    
    var materialCombination = "";
    var pieceSet = [];
    boardArray.forEach(function(row) { row.forEach(function(item) { if(item != " ") { pieceSet.push(item) }})});
    pieceSet = pieceSet.sort();
    pieceSet.forEach(function(combo) {materialCombination += combo});
    
    if(insufficientCombinations.includes(materialCombination)) {
        return true;
    }
    return false;
}
//determines if the player is in check.
function isInCheck(pos) {
    var kingX = -1;
    var kingY = -1;

    //find the king
    if (whitePly) {
        for (var r = 0; r < 8; r++) {
            for (var c = 0; c < 8; c++) {
                if (pos[r][c] == "K") {
                    kingY = r;
                    kingX = c;
                    break;
                }
            }
            if (kingX != -1) {
                break;
            }
        }
    } else {
        for (var r = 0; r < 8; r++) {
            for (var c = 0; c < 8; c++) {
                if (pos[r][c] == "k") {
                    kingY = r;
                    kingX = c;
                    break;
                }
            }
            if (kingX != -1) {
                break;
            }
        }
    }

    //iterate through all pieces and find if any are able to attack the king.
    for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
            //console.log(pos[r][c] + " " + !isTurn(pos[r][c]))
            if (pos[r][c] != " " && !isTurn(pos[r][c])) { //check all opponent pieces
                var moves = findLegalMoves(r, c, false);
    
                for (var mv in moves) {
                    
                    if (moves[mv][1] == kingX && moves[mv][0] == kingY) {
                        return true; //if king can be captured, it is in check.
                    } else {
                        //console.log("test failed for " + mv + " " + kingX + "," +kingY);
                    }
                    
                }
            }
        }
    }

    return false;
}

// Determines if the player has any legal moves.
function areLegalMoves(pos) {
    var moveCount = 0;
    for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
            if (boardArray[r][c] != " " && isTurn(pos[r][c])) {

                var moves = findLegalMoves(r, c, true);
                for (var mv in moves) {
                    //console.log(mv);
                    moveCount++;
                }
            }
        }
    }
    return moveCount > 0;
}

//Check if game is over, and display results if so.
function endCheck() {
   
    if(!gameOver) {
    if (isInCheck(boardArray)) {
        if (!areLegalMoves(boardArray)) { //in check and no legal moves = checkmate.
            if (whitePly) {
                sendDisplay("Checkmate. Black is victorious.");
                if (!gameOver) {
                    pgn += "0-1"; //if game not over append result to the PGN string.
                    gameOver = true;
                }
            } else {
                sendDisplay("Checkmate. White is victorious.");
                if (!gameOver) {
                    pgn += " 1-0"; //if game not over append result to the PGN string.
                    gameOver = true;
                }
            }
        }
    } else if (!areLegalMoves(boardArray)) { // no legal moves but not in check = stalemate.
        sendDisplay("Game drawn by stalemate.");
        if (!gameOver) {
            if (!whitePly) {
                pgn += " "

            }
            pgn += "1/2-1/2"; //if game not over append result to the PGN string.
            gameOver = true;
        }
    }
    else if (isThreefoldRepetition()) { // threefold repetition draws
        sendDisplay("Game drawn by repetition.");
        if (!gameOver) {
            if (!whitePly) {
                pgn += " "
            }
            pgn += "1/2-1/2"; //if game not over append result to the PGN string.
            gameOver = true;
        }
    }
    else if (isInsufficientMaterial()) { // insufficient material draws
        sendDisplay("Game drawn by insufficient material.");
        if (!gameOver) {
            if (!whitePly) {
                pgn += " "
            }
            pgn += "1/2-1/2"; //if game not over append result to the PGN string.
            gameOver = true;
        }
    }
    else if (fiftyMove > 50) { // fifty move rule
        sendDisplay("Game drawn by fifty move rule.");
        if (!gameOver) {
            if (!whitePly) {
                pgn += " "
            }
            pgn += "1/2-1/2"; //if game not over append result to the PGN string.
            gameOver = true;
        }
    }
    else if (drawAgreed) { // draw by agreement
        sendDisplay("Game drawn by agreement.");
        if (!gameOver) {
            if (!whitePly) {
                pgn += " "
            }
            pgn += "1/2-1/2"; //if game not over append result to the PGN string.
            gameOver = true;
        }
    } else if(whiteResignation) {
        sendDisplay("White has resigned. Black is victorious.");
        if(!gameOver) {
            if (!whitePly) {
                pgn += " "
            }
         pgn += "0-1";
        }
         gameOver = true;
    } else if(blackResignation) {
        sendDisplay("Black has resigned. White is victorious.");
        if(!gameOver) {
            if (!whitePly) {
                pgn += " "
            }
         pgn += "1-0";
        }
          gameOver = true;
    }
    }
   
    updateMoveList();
    //todo: implement other draw conditions.
}

//Create the algebraic notation for a move, and optionally append spaces, move numbers and newlines for the pgn.
//this function is virtually the same as moveHandler (next function below), just converting move to Algebraic Notation and not moving anything.
function parseAlgebraicNotation(y, x, boardCopy, pgn = true) {

    var epCap = false;
    var sely = selectedSquare[0];
    var selx = selectedSquare[1];
    var piece = boardCopy[selectedSquare[0]][selectedSquare[1]];

    promote = null;

    var rankStart = 8 - sely;
    var fileStart = String.fromCharCode(97 + selx);
    var fileEnd = String.fromCharCode(97 + x);
    var endSquare = fileEnd + (8 - y);
    var move = "";

    if (piece.toLowerCase() == "p" && boardCopy[y][x] != " ") {
        move += fileStart;
        
    } else if (piece == "p" && selx != x && boardCopy[y][x] == " ") {
        epCap = true;
        move += fileStart;
    } else if (piece == "P" && selx != x && boardCopy[y][x] == " ") {
        epCap = true;
        move += fileStart;
    } else if (piece == "P" && y == 0) {
        promote = document.getElementById("selectPromotion").value.toUpperCase();

    } else if (piece == "p" && y == 7) {
        promote = document.getElementById("selectPromotion").value;

    } else if (piece == "K") {
        if (Math.abs(selx - x) > 1) {

            if (selx - x < 0) { // castling
                move += "0-0";
            } else {

                move += "0-0-0";
            }
        }

    } else if (piece == "k") {
        if (Math.abs(selx - x) > 1) {
            if (selx - x < 0) { // castling

                move += "0-0";
            } else {

                move += "0-0-0";
            }

        }

    }


    // Disambiguation of moves.
    if (move.indexOf("0") == -1) { // not a castling move
        if (move == "" && piece.toLowerCase() != "p") { //not a pawn move, since pawns need no disambiguation.
            move += piece.toUpperCase();
            //disambiguate pieces on the same rank or file, or in rare cases, both
            //copy board state so we can modify it and call functions.
            boardArray2 = deepCopyFunction(boardArray);
            //set board to the unaltered board.
            boardArray = boardCopy;
            var r = sely;
            disambig = false;
            var rankDam = "";
            var fileDam = "";
            for (var r = 0; r < 8; r++) {
                for (var c = 0; c < 8; c++) {
                    if (!(r == sely && c == selx) && boardCopy[r][c] == boardCopy[sely][selx]) { //dont check the piece being moved, and don't check for piece types other than the piece being moved.
                        var moves = findLegalMoves(r, c, true); //get piece's legal moves : Needs to check with true

                        for (var mv in moves) {
                            //sendDisplay("")
                            if (moves[mv][0] == y && moves[mv][1] == x) {
                                if (selx != c) {
                                    fileDam = fileStart; //same file: disambiguate file.
                                } else if (sely != r)
                                    rankDam = rankStart; //same rank: disambiguate rank.
                            }
                        }
                    }
                }
            }


            move += fileDam + rankDam;
            boardArray = boardArray2;
        }

        //append x for captures.
        if (boardCopy[y][x] != " " || epCap) {
            move += "x";

        }
        move += endSquare;

    }
    //append pawn promotion
    if (promote != null) {
        move += "=" + promote.toUpperCase();
    }

    //append check or mating moves.
    if (isInCheck(boardArray)) {
        if (areLegalMoves(boardArray)) {
            move += "+";
        } else {
            move += "#";
        }
    }
    lastMove = move;
    if (!whitePly) {
        move = moveNo + ". " + move + " ";
    } else {
        move += "\n";
    }
    return move;
}


/*

Move Handler

*/

function moveHandler(x, y, callStockFish = true) {
    if(!gameOver) {
    var epCap = false;
    var deepCopy = deepCopyFunction(boardArray);
    for (var a = 0; a < legalMoves.length; a++) {
        var move = legalMoves[a];
        var sely = selectedSquare[0];
        var selx = selectedSquare[1];
        var piece = boardArray[selectedSquare[0]][selectedSquare[1]];
        epCol = -1; //reset en passant.
        promote = null;



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
                promote = document.getElementById("selectPromotion").value.toUpperCase();

            } else if (piece == "p" && y == 7) {
                promote = document.getElementById("selectPromotion").value;

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
            
            ply += 1;
            break;
        }
    }
    //These are to be done regardless of if there is a move or not.
    legalMoves = [];
    selectedSquare = [-1, -1];
    setTimeout(drawPosition, 100);
    setTimeout(endCheck, 50);
    document.getElementById("fen").value = makeFen();

    if(!gameOver) {
        updateFen();
    }
    updateMoveList();


    if (callStockFish) { //if playing the bot, tell the bot to make a move
        setTimeout(makeStockfishMove, 2000); //delayed to prevent the bot from moving multiple times in a row.
    }
    }

}

/* 

Legal move finding 

*/
function findLegalMoves(y, x, checkLegality) {

    //checkLegality is for the inCheck and other functions to prevent infinite recursion. When true it returns the pseudo-legal (legal ignoring check) moveset.

    var piece = boardArray[y][x];
    var pseudoLegal = [];
    var legalMoveMask = []; // relative position of the moves that are legal
    switch (piece.toLowerCase()) {
        case "k": //king has a constant moveset, as well as special moves
            legalMoveMask = [
                [1, 1],
                [1, 0],
                [1, -1],
                [0, 1],
                [0, -1],
                [-1, 1],
                [-1, 0],
                [-1, -1]
            ];
            if (checkLegality) { //don't check castling since it's irrelevant, as the opposing king cannot be captured by a castling move.
                if (piece == "K" && whiteKs && boardArray[7][5] == " " && boardArray[7][6] == " " && boardArray[7][7] == "R" && !isInCheck(boardArray)) { // white kingside castle. castling out of check is illegal.
                    legalMoveMask.push([0, 2]);
                }

                if (piece == "K" && whiteQs && boardArray[7][3] == " " && boardArray[7][2] == " " && boardArray[7][1] == " " && boardArray[7][0] == "R" && !isInCheck(boardArray)) { //white queenside castle.
                    legalMoveMask.push([0, -2]);
                }

                if (piece == "k" && blackKs && boardArray[0][5] == " " && boardArray[0][6] == " " && boardArray[0][7] == "r" && !isInCheck(boardArray)) { //black kingside
                    legalMoveMask.push([0, 2]);
                }

                if (piece == "k" && blackQs && boardArray[0][3] == " " && boardArray[0][2] == " " && boardArray[0][1] == " " && boardArray[0][0] == "r" && !isInCheck(boardArray)) { //white kingside.
                    legalMoveMask.push([0, -2]);
                }
            }
            break;
        case "n": //knight has a constant moveset.
            legalMoveMask = [
                [2, 1],
                [2, -1],
                [1, 2],
                [1, -2],
                [-1, 2],
                [-1, -2],
                [-2, 1],
                [-2, -1]
            ];
            break;
        case "r":
            try { //iterate through file until past end of array; this functionality repeats for all rook, queen and bishop moves
                for (var i = 1; i < 8; i++) {
                    curr = boardArray[y + i][x];
                    if (curr == " ") { //go until a piece is in the way
                        legalMoveMask.push([i, 0]);
                    } else if (isObstructed(piece, curr)) { //if obstructed by friendly piece, and stop checking this direction.
                        break;
                    } else { //obstructed by enemy piece, add capture and stop checking this direction.
                        legalMoveMask.push([i, 0]);
                        break;
                    }
                }
            } catch (e) {}
            try { //iterate through file(reverse) until past end of array
                for (var i = -1; i > -8; i--) {
                    curr = boardArray[y + i][x]
                    if (curr == " ") {
                        legalMoveMask.push([i, 0]);
                    } else if (isObstructed(piece, curr)) {
                        break;
                    } else {
                        legalMoveMask.push([i, 0]);
                        break;
                    }
                }
            } catch (e) {}

            try { //iterate through rank until past end of array
                for (var i = 1; i < 8; i++) {
                    curr = boardArray[y][x + i]
                    if (curr == " ") {
                        legalMoveMask.push([0, i]);
                    } else if (isObstructed(piece, curr)) {
                        break;
                    } else {
                        legalMoveMask.push([0, i]);
                        break;
                    }
                }
            } catch (e) {}
            try { //iterate through rank(reverse) until past end of array
                for (var i = -1; i > -8; i--) {
                    curr = boardArray[y][x + i]
                    if (curr == " ") {
                        legalMoveMask.push([0, i]);
                    } else if (isObstructed(piece, curr)) {
                        break;
                    } else {
                        legalMoveMask.push([0, i]);
                        break;
                    }
                }
            } catch (e) {}
            break;
        case "q": // same as above.
            try {
                for (var i = 1; i < 8; i++) {
                    curr = boardArray[y + i][x];
                    if (curr == " ") {
                        legalMoveMask.push([i, 0]);
                    } else if (isObstructed(piece, curr)) {
                        break;
                    } else {
                        legalMoveMask.push([i, 0]);
                        break;
                    }
                }
            } catch (e) {}
            try {
                for (var i = -1; i > -8; i--) {
                    curr = boardArray[y + i][x]
                    if (curr == " ") {
                        legalMoveMask.push([i, 0]);
                    } else if (isObstructed(piece, curr)) {
                        break;
                    } else {
                        legalMoveMask.push([i, 0]);
                        break;
                    }
                }
            } catch (e) {}

            try {
                for (var i = 1; i < 8; i++) {
                    curr = boardArray[y][x + i]
                    if (curr == " ") {
                        legalMoveMask.push([0, i]);
                    } else if (isObstructed(piece, curr)) {
                        break;
                    } else {
                        legalMoveMask.push([0, i]);
                        break;
                    }
                }
            } catch (e) {}
            try {
                for (var i = -1; i > -8; i--) {
                    curr = boardArray[y][x + i]
                    if (curr == " ") {
                        legalMoveMask.push([0, i]);
                    } else if (isObstructed(piece, curr)) {
                        break;
                    } else {
                        legalMoveMask.push([0, i]);
                        break;
                    }
                }
            } catch (e) {}
            case "b": //queen and bishop both move diagonally. 
                try {
                    for (var i = 1; i < 8; i++) { //bottom left diagonal
                        curr = boardArray[y + i][x + i];
                        if (curr == " ") {
                            legalMoveMask.push([i, i]);
                        } else if (isObstructed(piece, curr)) {
                            break;
                        } else {
                            legalMoveMask.push([i, i]);
                            break;
                        }
                    }
                } catch (e) {}
                try {
                    for (var i = -1; i > -8; i--) { //bottom right
                        curr = boardArray[y + i][x - i]
                        if (curr == " ") {
                            legalMoveMask.push([i, -i]);
                        } else if (isObstructed(piece, curr)) {
                            break;
                        } else {
                            legalMoveMask.push([i, -i]);
                            break;
                        }
                    }
                } catch (e) {}

                try {
                    for (var i = 1; i < 8; i++) { //top right
                        curr = boardArray[y - i][x - i]
                        if (curr == " ") {
                            legalMoveMask.push([-i, -i]);
                        } else if (isObstructed(piece, curr)) {
                            break;
                        } else {
                            legalMoveMask.push([-i, -i]);
                            break;
                        }
                    }
                } catch (e) {}
                try {
                    for (var i = -1; i > -8; i--) { //top left
                        curr = boardArray[y - i][x + i]
                        if (curr == " ") {
                            legalMoveMask.push([-i, i]);
                        } else if (isObstructed(piece, curr)) {
                            break;
                        } else {
                            legalMoveMask.push([-i, i]);
                            break;
                        }
                    }
                } catch (e) {}
                break;
            case "p":
                if (piece == "P") { //white pawn
                    if (boardArray[y - 1][x] == " ") { //move one space.
                        legalMoveMask.push([-1, 0]);

                        if (y == 6 && boardArray[y - 2][x] == " ") { //if not moved yet, it is allowed to move 2 squares.
                            legalMoveMask.push([-2, 0]);
                        }

                    }
                    try { //check for en passant 
                        var curr = boardArray[y - 1][x - 1];
                        if ((y == 3 && epCol == x - 1) || (curr != " " && !isFriendly(piece, curr))) {
                            legalMoveMask.push([-1, -1]);
                        }
                    } catch (e) {}

                    try { //check for en passant other way.
                        var curr = boardArray[y - 1][x + 1];
                        if ((y == 3 && epCol == x + 1) || (curr != " " && !isFriendly(piece, curr))) {
                            legalMoveMask.push([-1, 1]);
                        }
                    } catch (e) {}

                } else { //black pawn, same as above just towards the other end.

                    if (boardArray[y + 1][x] == " ") {
                        legalMoveMask.push([1, 0]);

                        if (y == 1 && boardArray[y + 2][x] == " ") {
                            legalMoveMask.push([2, 0]);
                        }

                    }
                    try {
                        var curr = boardArray[y + 1][x - 1];
                        if ((y == 4 && epCol == x - 1) || (curr != " " && !isFriendly(piece, curr))) {
                            legalMoveMask.push([1, -1]);
                        }
                    } catch (e) {}

                    try {
                        var curr = boardArray[y + 1][x + 1];
                        if ((y == 4 && epCol == x + 1) || (curr != " " && !isFriendly(piece, curr))) {
                            legalMoveMask.push([1, 1]);
                        }
                    } catch (e) {}
                }
                break;
    }
    //construct a list of pseudo-legal (that is, all moves that can be made, disregarding whether it is moving into check) moves.
    for (var i in legalMoveMask) {
        var mask = legalMoveMask[i];
        try {
            var end = boardArray[y + mask[0]][x + mask[1]];

            if (end != undefined && (end == " " || !isFriendly(end, piece))) { //make sure it is on the board and not moving to an occupied square in the case of kings and knights.
                pseudoLegal[pseudoLegal.length] = [y + mask[0], x + mask[1]];
            }
        } catch (e) {}
    }

    var legal = [];
    if (checkLegality) {
        for (var i in pseudoLegal) {
            var psl = pseudoLegal[i]
            var boardArray2 = deepCopyFunction(boardArray);
            //Castling tests -- it is not legal to move through check. (Moving out of check is handled above, moving into handled below.)
            if (piece.toLowerCase() == "k") {
                var castlingCalc = [y - psl[0], x - psl[1]]
                if (piece == "K" && Math.abs(castlingCalc[1]) > 1) {
                    var castle = true;
                    for (var p = 0; p <= Math.abs(castlingCalc[1]); p++) {
                        var sx = p * (castlingCalc[1] / Math.abs(castlingCalc[1]));
                        boardArray[pseudoLegal[i][0]][x - sx] = "K";
                        boardArray[y][x] = " ";
                        
                        if (isInCheck(boardArray)) {
                            castle = false;
                            boardArray = deepCopyFunction(boardArray2);
                            break;
                        } 
                        boardArray = deepCopyFunction(boardArray2);
                    }
                    if (castle) {
                       legal.push(psl);
                    } else {
                       break; // this fixes the queenside castling through check bug. Only queenside castling broke for some reason. 
                       
                    }
                } else if (piece == "k" && Math.abs(castlingCalc[1]) > 1) {
                    var castle = true;
                    for (var p = 1; p <= Math.abs(castlingCalc[1]); p++) {
                        var sx = p * (castlingCalc[1] / Math.abs(castlingCalc[1]));
                        boardArray[pseudoLegal[i][0]][x - sx] = "k";
                        boardArray[y][x] = " ";

                        if (isInCheck(boardArray)) {
                            castle = false;
                            boardArray = deepCopyFunction(boardArray2);
                            break;
                        }
                        boardArray = deepCopyFunction(boardArray2);
                    }
                    if (castle) {
                        legal.push(psl);
                    } else {
                       break; // this fixes the *kingside castling through check bug. Only kingside castling broke. Again unsure why.
                       
                    }
                }
            }
            //copy board and just try to make the move, and if it doesn't put the king in check, then it is legal.
            var boardArray2 = deepCopyFunction(boardArray);
            try {
                boardArray[pseudoLegal[i][0]][pseudoLegal[i][1]] = boardArray[y][x];
                boardArray[y][x] = " ";

                if (!isInCheck(boardArray)) {
                    //console.log(boardArray);
                    legal.push(pseudoLegal[i]);

                }
            } finally {}
            boardArray = deepCopyFunction(boardArray2);
        }
    } else {
        legal = pseudoLegal; //only used to see if a position is in check.
    }

    return legal;

}

//JS passes by reference, so this is necessary to prevent the actual object from being changed.
//this code is from stackOverflow.
const deepCopyFunction = (inObject) => {
    let outObject, value, key

    if (typeof inObject !== "object" || inObject === null) {
        return inObject // Return the value if inObject is not an object
    }

    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {}

    for (key in inObject) {
        value = inObject[key]

        // Recursively (deep) copy for nested objects, including arrays
        outObject[key] = deepCopyFunction(value)
    }

    return outObject
}

/* 

Graphical functions

*/

function drawArrow(context, x2, y2, x, y, color) {
    //get centers of squares
    var fromx = (x * squareSize) + squareSize / 2;
    var tox = (x2 * squareSize) + squareSize / 2;
    var fromy = (y * squareSize) + squareSize / 2;
    var toy = (y2 * squareSize) + squareSize / 2;
    var headlen = 25; // length of head in pixels
    var dx = tox - fromx;
    var dy = toy - fromy;
    var angle = Math.atan2(dy, dx);
    context.beginPath();
    context.lineCap = 'round'
    context.lineWidth = squareSize / 8; // produces an appropriate width compared to scale.
    context.strokeStyle = color;
    if (fromx == tox && fromy == toy) { //if same square, highlight instead of drawing arrow.
        ctx.arc(tox, toy, (squareSize - 2) / 2, 0, 2 * Math.PI);
    } else {
        //draw line
        context.moveTo(fromx, fromy);
        context.lineTo(tox, toy);
        //draw arrowhead
        context.moveTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        context.moveTo(tox, toy);
        context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    }
    context.stroke();


}

function drawPosition() {
    fixAllSvg();
    aspectRatio = canvas.clientWidth / canvas.width; //update aspect ratio so clicks get handled properly.
    window.cvs = document.createElement('canvas') //rendering done on a seperate canvas to prevent flickering.
    ctx = window.cvs.getContext('2d'); //set ctx to this to make it easier.
    window.cvs.width = canvas.width;
    window.cvs.height = canvas.height;
    ctx.fillStyle = FILL_DARK_SQUARES;
    ctx.fillRect(0, 0, canvas.width, canvas.height); // the dark squares will be left unfilled in the loop.
    ctx.fillStyle = FILL_LIGHT_SQUARES;

    for (var r = 0; r < 8; r++) {
        for (var c = 0; c < 8; c++) {
            
            var offset = squareSize / 8;
            var x = c * squareSize;
            var y = r * squareSize;

            if (isBlack) {
                y = width - y - squareSize; //black player should have black pieces on the bottom. 
                x = width - x - squareSize; //and mirrored.
            }
           
            //draw the piece on the square.
            setTimeout(function(args) {
                drawPiece(args);
            }, 10, deepCopyFunction([r, c, x + offset, y + offset, squareSize - (2 * offset), squareSize - (2 * offset)])); // draw pieces slightly after the squares to ensure they aren't cut off

            if ((r + c) % 2 == 0) { //light squares get filled
                ctx.fillRect(x, y, squareSize, squareSize);
            }
            if (boardArray[r][c].toLowerCase() == "k" && isTurn(boardArray[r][c]) && isInCheck(boardArray)) { //if in check, highlight the king in red to indicate as such.
                ctx.fillStyle = "#aa2255";
                ctx.fillRect(x, y, squareSize, squareSize);
                ctx.fillStyle = FILL_LIGHT_SQUARES;
            }
            if (selectedSquare[0] == r && selectedSquare[1] == c) { //selected piece is highlighted.
                ctx.fillStyle = FILL_SELECTED_SQUARE;
                ctx.fillRect(x, y, squareSize, squareSize);
                ctx.fillStyle = FILL_LIGHT_SQUARES;
            } else if (legalMoves != []) { // draw all legal moves if a piece is selected.
                for (var a = 0; a < legalMoves.length; a++) {
                    var move = legalMoves[a];
                    if (move[0] == r && move[1] == c) {

                        ctx.lineCap = 'round'
                        ctx.lineWidth = offset / 2;
                        ctx.strokeStyle = FILL_SELECTED_SQUARE;
                        ctx.strokeRect(x + (offset / 2), y + (offset / 2), squareSize - offset, squareSize - offset);
                        break;
                    }
                }
            }
            //draw the letters and numbers
            ctx.font = "16px Rubik";
            if (r == 0) {
                ctx.fillStyle = FILL_SELECTED_SQUARE;
                ctx.fillText(String.fromCharCode(65 + c), x + 64, y + 16);
                ctx.fillStyle = FILL_LIGHT_SQUARES;

            }
            if (c == 0) {
                ctx.fillStyle = FILL_SELECTED_SQUARE;
                ctx.fillText(8 - r, x + 1, y + 72);
                ctx.fillStyle = FILL_LIGHT_SQUARES;

            }
        }
    }

    //after a delay, draw the result all at once.
    setTimeout(function() {
        canvas.getContext('2d').drawImage(window.cvs, 0, 0);
        ctx = canvas.getContext('2d');
    }, 200)
    //slightly longer delays as a failsafe.
    for(var i = 50; i < 301; i += 50) {
    setTimeout(function() {
        canvas.getContext('2d').drawImage(window.cvs, 0, 0);
        ctx = canvas.getContext('2d');
    }, 200 + i)
    }

}

// draw the piece on the placeholder canvas.
function drawPiece(info) {
    //convert info array to arguments.
    var piece = boardArray[info[0]][info[1]];
    var x = info[2];
    var y = info[3];
    var xs = info[4];
    var ys = info[5];
    var id = letterToId(piece);
    if (id == null) {
        return;
    }
    var xml = new XMLSerializer().serializeToString(document.getElementById(id)); //convert the SVG to a data url so we can draw it to the canvas.
    // make it base64
    var svg64 = btoa(xml);
    var b64Start = 'data:image/svg+xml;base64,';

    // prepend a "header"
    var image64 = b64Start + svg64;
    img = new Image();
    // set it as the source of the img element
    img.src = image64;

    // draw the image onto the canvas, allowing a slight delay for the image element to load correctly.
    setTimeout(function(img2, x2, y2, xs2, ys2) {
        window.cvs.getContext('2d').drawImage(img2, x2, y2, xs2, ys2)
    }, 50, img, x, y, xs, ys);
}
//get the element id for the piece letter.
function letterToId(piece) {
    switch (piece) {
        case "P":
            return "white-pawn"
            break;
        case "B":
            return "white-bishop"
            break;
        case "N":
            return "white-knight"
            break;
        case "R":
            return "white-rook"
            break;
        case "K":
            return "white-king"
            break;
        case "Q":
            return "white-queen"
            break;
        case "p":
            return "black-pawn"
            break;
        case "b":
            return "black-bishop"
            break;
        case "n":
            return "black-knight"
            break;
        case "r":
            return "black-rook"
            break;
        case "k":
            return "black-king"
            break;
        case "q":
            return "black-queen"
            break;
        default:
            return null;
            break;
    }
}

setInterval(updateOpening, 500);