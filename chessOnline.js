var stockfish = new Worker("stockfish.js");
var isBlack = false;
var isWhite = false;
thinking = false;
window.isOnlineGame = true;
var resigning = false;
window.elo = (window.elo ?? "2");
if(window.blackPlayer == window.user) { // these values are passed from the php script.
    isBlack = true;
    document.getElementById("resign").onclick = function() { resigning = true; updateFen("blackResign"); blackResignation = true; }
    if(window.whitePlayer != "stockfish") {
    document.getElementById("draw").onclick = function() { console.log("draw offer"); updateFen("drawOfferBlack"); sendDisplayInfo("Draw offer sent.")}
    }
}
if(window.whitePlayer == window.user) {
    isWhite = true;
    document.getElementById("resign").onclick = function() { resigning = true; updateFen("whiteResign"); whiteResignation = true;}
    if(window.blackPlayer != "stockfish") {
    document.getElementById("draw").onclick = function() { console.log("draw offer"); updateFen("drawOfferWhite"); sendDisplayInfo("Draw offer sent.") }
    }
}


function makeStockfishMove()
{
document.getElementById("gamePgn").style.display = "none";
  try {
  if(!thinking && !gameOver && ((window.blackPlayer == "stockfish" && !whitePly) || (window.whitePlayer == "stockfish" && whitePly))) { //only let the bot move on its turn.
        var rngElo = window.elo; //randomly play stronger and weaker moves.

        stockfish.postMessage("setoption name Skill Level Probability value 70");
         stockfish.postMessage("setoption name Skill Level Maximum Error value 100");
        stockfish.postMessage("setoption name Skill Level value " + rngElo);
        stockfish.postMessage("position fen " + makeFen());
        stockfish.postMessage("go movetime 1000");
        thinking = true;
        
  
  } 
} catch(e) {
    window.alert(e);
}

}
stockfish.onmessage = function(event) {
    //NOTE: Web Workers wrap the response in an object.
    console.log(event.data);
    if(event.data.indexOf("bestmove") !== -1) {
        var move = event.data.split(" ")[1];
        console.log(move);
        stockfish.postMessage("position fen " + makeFen() + " moves " + move);
        setTimeout(function() { stockfish.postMessage("d");} , 1000);
    }
    if(event.data.indexOf("Fen") !== -1) {
        var fen = event.data.substring(5);
        console.log(fen);
        thinking = false;
        loadFen(fen);
       
    }
};
//upload FEN to the server.
function updateFen(extra = "")
{
  if(!gameOver && window.whitePlayer != "stockfish" && window.blackPlayer != "stockfish") {
  jQuery.ajax({

    type: "GET",
    url: "api.php",
    data: {
      whitePlayer: window.whitePlayer,
      blackPlayer: window.blackPlayer,
      id: window.id,
      fen: makeFen() + " " + btoa(pgn) + " " + extra // todo: implement draw offers, etc.
    },
    //dataType: "html"

  }).done(function( result ) {
  
  });
  }
}

//checks if the server side FEN has changed.
function checkFenForChanges()
{ 
 if(!gameOver && window.whitePlayer != "stockfish" && window.blackPlayer != "stockfish") {
  jQuery.ajax({

    type: "GET",
    url: "api.php",
    data: {
      whitePlayer: window.whitePlayer,
      blackPlayer: window.blackPlayer,
      id: window.id,
      sendBoard: "yes"
      
    },
    //dataType: "html"

  }).done(function( result , status) { //recieve results.
  console.log(result.split(" "));
        if(result != "" && ((makeFen().split(" ")[0] != result.split(" ")[0]) || (result.split(" ").length > 7 && "" !== result.split(" ")[7]))) { //if fen is modified, load it
			
            loadFen(result);
            
            sound = new Audio("sounds/notif.ogg");
            //sound.play();
        }
        if(!resigning) {
            setTimeout(checkFenForChanges, 500 + Math.floor(Math.random() * 150)); //hopefully will bypass the ratelimit.
        }
  });
 }
}

//Modifies mouseAction from the chess.js script so only the current player is able to move.
function mouseAction(event) { 
if((isWhite && whitePly) || (isBlack && !whitePly)) { //check player

    if(gameOver) { return; }
    var mouseX = event.clientX / aspectRatio;
    var mouseY = event.clientY / aspectRatio;
    var x = Math.floor(mouseX / squareSize);

    var y = Math.floor(mouseY / squareSize);
    if (isBlack) {
        y = 7 - y; //black's board is inverted to have black pieces at the bottom.
        x = 7 - x; // and mirrored

    }
 if(event.button === 0) {
	if(selectedSquare[0] == -1 || !isPieceSelected || boardArray[y][x] != " ") {
		var piece = boardArray[y][x]
	  if(piece != " " && isTurn(piece)) {
	  		isPieceSelected = true;
	  		console.log(x);
			console.log(y);
			selectedSquare = [y, x];
			drawPosition();
			legalMoves = [];
			legalMoves = findLegalMoves(y, x, true);
			
			drawPosition();
			
	  } else {
        	moveHandler(x,y);
        	
        	isPieceSelected = false;
        	drawPosition();
	  }
		  
	  
	} else {
		moveHandler(x, y);
		
		isPieceSelected = false;
		drawPosition();
		
	}							 
  }
} else { drawPosition(); }
}


var fenCheck = false;
setTimeout(checkFenForChanges, 200); //check changes several times a second.
setTimeout(makeStockfishMove, 3000); //if bot game, ask bot to move if page is reloaded.