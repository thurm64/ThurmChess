<?php
#------------------------------------------------------------------------------------------#
#  Copyright (c) Dr. R. Urban                                                              #
#  24.05.2015                                                                              #
#  Web-GUI-for-stockfish-chess                                                             #
#  https://github.com/antiproton                                                           #
#  Released under the MIT license                                                          #
#  https://github.com/antiproton/Web-GUI-for-stockfish-chess/blob/master/LICENSE           #
#------------------------------------------------------------------------------------------#
session_start();
include "config.php";
$code = $_SESSION['code'];

$fen=$_GET["fen"];
$elo=3000;

$thinking_time=500;
$pfad_stockfish="./stockfish/stockfish_13_linux_x64";
$time = microtime(1);
$cwd='./';


$sf  = $pfad_stockfish;


$descriptorspec = array(
0 => array("pipe","r"),
1 => array("pipe","w"),
) ;

$other_options = array('bypass_shell' => 'true');

$process = proc_open($sf, $descriptorspec, $pipes, $cwd, null, $other_options) ;

if (is_resource($process)) {
    fwrite($pipes[0], "debug on\n");
fwrite($pipes[0], "uci\n");

fwrite($pipes[0], "ucinewgame\n");
fwrite($pipes[0], "isready\n");

fwrite($pipes[0], "position fen $fen\n");
fwrite($pipes[0], "go movetime 500 ponder\n");

$str="";


sleep(1);

fclose($pipes[0]);
echo stream_get_contents($pipes[1]);

fclose($pipes[1]);
proc_close($process);


#echo $s;
$teile = explode(" ", $s);

$zug = $teile[1];



#echo $zug;

$str = $zug;


  for ($i=0; $i < 4; $i++)
  {
    $str[$i];
  }




    $str = $s;
}

header('Content-Type: text/html; charset=utf-8'); // sorgt für die korrekte Kodierung
header('Cache-Control: must-revalidate, pre-check=0, no-store, no-cache, max-age=0, post-check=0'); // ist mal wieder wichtig wegen IE
echo $str;
exit;
#echo "<br>";
#echo microtime(1)-$time;


?>