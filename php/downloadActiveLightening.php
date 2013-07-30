<?php
include 'includes/downloadFunctions.php';
file_put_contents("tmp/lightning_src.kmz", file_get_contents_curl('http://flash3.ess.washington.edu/lightning_src.kmz'));
rename("tmp/lightning_src.kmz","tmp/lightning_src.zip");
 	 $zip = new ZipArchive;
     $res = $zip->open("tmp/lightning_src.zip");
     if ($res === TRUE) {
         $zip->extractTo("../mapfile/");
         $zip->close();
         echo "lightning_src kmz file downloaded successfully...!";
     } else {
         echo "lightning_src kmz download Failed...!";
     }
unlink("tmp/lightning_src.zip");	 
?>