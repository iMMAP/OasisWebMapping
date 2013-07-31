<?php
ini_set('max_execution_time', 120);
include 'dbconnect.php';
include 'includes/gisEngineFunction.php';
$GLOBALS['map_path']="/var/www/oasiswebmapping/mapfile/";
prepare();
loadParams();

// $sentparams = file_get_contents("../check-nodes.json");
$sentparams = file_get_contents("http://maps.oasiswebservice.org/php/getJSON4tree.php", true);
$sentparams=json_decode($sentparams,true);

$arrLayers = explode(',',$_REQUEST['LAYERS']);
$arrLayer = explode(',',$_REQUEST['LAYER']);

// if (in_array("dataLayer",$arrLayer,true) || in_array("dataLayer",$arrLayers,true)){
	// defineLayer();
// }
if (in_array("georss",$arrLayer,true) || in_array("georss",$arrLayers,true)){
	defineGeoRSS($_REQUEST['GEORSSURL']);
}
if ($_REQUEST['filterShape']!=''){
	defineCosmeticsLayer();
}

generateBaselayers($sentparams);
// defineFloodedOverlay($sentparams);

// defineKML('fire24', $sentparams,' Fire Points List ','fire.png');
// defineKML('fire48', $sentparams,' Fire Points List ','fireblue.png');
// defineKML('lightning_src', $sentparams,'WWLLN Data','lightning.png');



// defineGroundOverlay($sentparams);

if (empty($_REQUEST['GROUP'])){
	// generateUserlayers();
} else {
	if ($_REQUEST['GROUP']=='Base Layers'){
		// empty
	} else if ($_REQUEST['GROUP']=='My Layers'){
			// generateUserlayers();
	}
}

drawMap();
?>
