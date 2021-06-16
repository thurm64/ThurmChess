<head>
	<title>ThurmChess</title>
	<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">  
	<link rel="stylesheet" href="css/styles.css"/>
    <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
    <meta http-equiv="Pragma" content="no-cache" />
    <meta http-equiv="Expires" content="0" />
    <meta charset="utf-8"/>
</head>
<body>
 <?php
        function jsSetWindowVariable($name, $val) {
            print("<script>window.$name = \"$val\"</script>");
        }
        if(!isset($_COOKIE["userid"])) {
            $userString = substr(md5(mt_rand(0,1000000) . $_SERVER['HTTP_USER_AGENT'] .  $_SERVER['REMOTE_ADDR']),0,8);
            setCookie("userid", $userString, time() + (10 * 365 * 24 * 60 * 60));
        } else {
            $userString = $_COOKIE["userid"];
        }
        
        jsSetWindowVariable("whitePlayer", $userString);
        jsSetWindowVariable("idec", mt_rand(0, 1000000));

        
        
  ?>
<header>
<h1>ThurmChess</h1>
</header>
<nav>
    <ul>
        <li><a href="index.php">Home</a></li>
        <li><a href="createMatch.php"><img style="width:20px;height:20px" src="https://raw.githubusercontent.com/ornicar/lila/master/public/images/practice/two-shadows.svg"/>Play Online</a></li>
        <li><a href="createStockfishMatch.php"><img style="width:20px;height:20px" src="https://raw.githubusercontent.com/ornicar/lila/master/public/images/learn/robot-golem.svg"/>Play Computer</a></li>
        <li><a href="solo.html"><img style="width:20px;height:20px" src="https://raw.githubusercontent.com/ornicar/lila/master/public/images/learn/crossed-swords.svg"/>Analysis</a></li>
        <li><a href="puzzles.html"><img style="width:20px;height:20px" src="https://github.com/ornicar/lila/raw/master/public/images/learn/pieces/K.svg"/>Puzzles</a></li>
    </ul>
</nav>
<main>
<h2 class="title" style="color:#335577">Create Challenge</h2>
<h4>Opponent</h4>
<input type="text" style="width:400px" placeholder="Enter your opponent's ThurmChess id" id="opponent">
<br>
<h4>Play as </h4>
White <input id="white" selected class="radio" type="radio" name="colorchoice"> &nbsp; <input id="black" class="radio" type="radio" name="colorchoice"> Black
<br>
<button style="font-size:20px" onclick="submit()">Submit</button>
<br>
<div id="play-link"></div>
</main>
</body>
<footer>
<script>
    function submit() {
        var div = document.getElementById("play-link");
            if(!document.getElementById('white').checked) {
                div.innerHTML = '<a href="online.php?blackPlayer=' + window.whitePlayer + "&whitePlayer=" + document.getElementById("opponent").value + "&id=" + window.idec + '">Send this link to play!</a>';
            } else {
                div.innerHTML = '<a href="online.php?whitePlayer=' + window.whitePlayer + "&blackPlayer=" + document.getElementById("opponent").value + "&id=" + window.idec + '">Send this link to play!</a>';
            }
            
        }
</script>
</footer>