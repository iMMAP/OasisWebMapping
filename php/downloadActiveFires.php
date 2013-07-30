<?php
include 'includes/downloadFunctions.php';

function fixDownloadedFile ($filename){
	$data = file_get_contents($filename);
	$data = preg_replace('/[^(\x20-\x7F)]*/', '', $data);		
	file_put_contents($filename, $data);
	
}

$filename = 'fire';
$fullpath = '../mapfile/fire';

file_put_contents($fullpath."24.kml", file_get_contents_curl('http://firms.modaps.eosdis.nasa.gov/active_fire/kml/South_Asia_24h.kml'));
file_put_contents($fullpath."48.kml", file_get_contents_curl('http://firms.modaps.eosdis.nasa.gov/active_fire/kml/South_Asia_48h.kml'));

fixDownloadedFile($fullpath."24.kml");	
fixDownloadedFile($fullpath."48.kml");	

echo 'done...!';
?>