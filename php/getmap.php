<?php
include 'dbconnect.php';
include 'includes/gisEngineFunction.php';
$GLOBALS['map_path']="c:/ms4w/apache/htdocs/oasisweb/mapfile/";
prepare();
loadParams();

$sentparams = file_get_contents("../check-nodes.json");
$sentparams=json_decode($sentparams,true);

$arrLayers = explode(',',$_REQUEST['LAYERS']);
$arrLayer = explode(',',$_REQUEST['LAYER']);

if (in_array("dataLayer",$arrLayer,true) || in_array("dataLayer",$arrLayers,true)){
	defineLayer();
}
if (in_array("georss",$arrLayer,true) || in_array("georss",$arrLayers,true)){
	defineGeoRSS($_REQUEST['GEORSSURL']);
}
if ($_REQUEST['filterShape']!=''){
	defineCosmeticsLayer();
}

generateBaselayers($sentparams);
defineFloodedOverlay($sentparams);

if (in_array("fire24",$arrLayer,true) || in_array("fire24",$arrLayers,true)){
	defineKML('fire24', $sentparams);
}

if (in_array("fire48",$arrLayer,true) || in_array("fire48",$arrLayers,true)){
	defineKML('fire48', $sentparams);
}

defineGroundOverlay($sentparams);

if (empty($_REQUEST['GROUP'])){
	generateUserlayers();
} else {
	if ($_REQUEST['GROUP']=='Base Layers'){
		// empty
	} else if ($_REQUEST['GROUP']=='Private Layers'){
			generateUserlayers();
	}
}

drawMap();
?>