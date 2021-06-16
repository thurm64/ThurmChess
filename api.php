<?php
  $filename = $_GET['whitePlayer'] . $_GET['blackPlayer'] . $_GET['id'];
    $path = "games/";
    
    $file = $path . $filename;

if(!isset($_GET['sendBoard'])) {
      $txt = $_GET['fen'];
    file_put_contents($file, $txt);
} else {
    print file_get_contents($file);
}

?>