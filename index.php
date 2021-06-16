<?php
    header('Clear-Site-Data: "cache"')

?><head>
    	<link rel="shortcut icon" href="favicon.ico" type="image/x-icon">  
	<link rel="stylesheet" href="css/styles.css"/>
	<title>ThurmChess</title>
	<script>
	    function setCookie(name,value,days) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
    }
    function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
	</script>
	
</head>
<body>
<header>
<h1><img src="favicon.ico" width="50" height="50" style="margin-top: -5px; margin: 5px"/>ThurmChess</h1>
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
<h2>Welcome to ThurmChess!</h2>
<p>This site was created as a project to test my coding skills. </p>
<p>It was written in standard JavaScript and PHP, with the jQuery AJAX library used for multiplayer. </p>
<p>No libraries were used for the graphics or game logic. </p>
<hr>
<h5>Credits and libraries: </h5>
<p>Sounds and some images from <a href="https://github.com/ornicar/lila/" target="_blank">lila</a> repository (backend of <a href="lichess.org">lichess</a>)</p>
<p>Puzzle database from Github user <a href="https://github.com/xinyangz/chess-tactics-pgn" target="_blank">xinyangz</a>.</p>
<p>Pieces from Wikimedia user Cyril Wack.</p>
<p>JQuery used for connecting the JS to the PHP API. </p>
<h5><?php
        function jsSetWindowVariable($name, $val) {
            print("<script>window.$name = \"$val\"</script>");
        }
         if(!isset($_COOKIE["browsid"])) {
             $browserId = crc32(mt_rand(0,1000000) . $_SERVER['HTTP_USER_AGENT'] .  $_SERVER['REMOTE_ADDR']) % 9999;
              setCookie("browsid", $browserId, time() + (10 * 365 * 24 * 60 * 60));
         } else {
             $browserId = $_COOKIE["browsid"];
         }
        if(!isset($_COOKIE["userid"])) {
            $userString = substr(md5(mt_rand(0,1000000) . $_SERVER['HTTP_USER_AGENT'] .  $_SERVER['REMOTE_ADDR']),0,8);
            setCookie("userid", $userString, time() + (10 * 365 * 24 * 60 * 60));
          
        } else {
            $userString = $_COOKIE["userid"];
             
        }
        $clientId = substr(md5($_SERVER['HTTP_USER_AGENT'] .  $_SERVER['REMOTE_ADDR']),0,8);
        print("Your ThurmChess id: " . $userString);
        jsSetWindowVariable("whitePlayer", $_GET['whitePlayer']);
        jsSetWindowVariable("blackPlayer", $_GET['blackPlayer']);
        jsSetWindowVariable("id", $_GET['id']);
        jsSetWindowVariable("user", $userString);
         jsSetWindowVariable("browsid", $browserId);
        
        
  ?><br><input placeholder="Enter new ID" id="val"><button onclick="eraseCookie('userid'); var val = document.getElementById('val').value; var newid = val + '-' + window.browsid; var c = document.cookie; if(val.length > 5) { setCookie('userid', newid, 1000000); } else { window.alert('too short!') }">Change</button></h5>
</main>
</body>