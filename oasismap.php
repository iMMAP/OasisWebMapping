<?php
session_start();
if(!isset($_SESSION['user'])){
	header("Location: login.php");
}
?>

			
<html>
	<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"  />
  <meta name="description" content="OASISWeb brings together live information feeds for earthquakes, fires, precipitation, wind speed, temperature, lightning and cloud cover. Combined with this there are historical datasets for floods, and arange of public data sources for Pakistan." />
  <meta name="keywords" content="immap information management platform, flood, mapping, GIS, remote sensing, Information management tools, weather, forecast, disaster, emergency, oasisweb, oasis, oasis web, pakistan map, pakistan flood, pakistan"/>
<title>Oasis Web</title>
<!-- Loading Ext and Application CSS
<style type="text/css" media="all">
	@import "css/application.css";
	@import "theme/default/style.css";
	@import "./lib/ext-4.0.7-gpl/resources/css/ext-all.css";
</style>  -->

<link rel="stylesheet" type="text/css" href="css/default.css">
<link href='css/application.css' rel='stylesheet' type='text/css' />


<link href='./lib/ext-4.0.7-gpl/resources/css/ext-all.css' rel='stylesheet' type='text/css' />
<link href='css/geoext-all.css' rel='stylesheet' type='text/css' />

			<div id='loading'>
				<div id='loading-indicator'><img
					src='image/loading29.gif' width='22'
					height='22'
					style='margin-right: 8px; float: left; vertical-align: top;' />Oasis<br />
					<span id='loading-msg'><div id='msgText'>Loading APIs, styles and images...</div></span></div>
			</div>

<script type="text/javascript">			
	var msg = document.getElementById("msgText").firstChild;
 	// msg.replaceData(0, msg.length, "Loading Libraries...");	
</script>	
<!--[if gte IE 6]>
	<link rel="stylesheet" type="text/css" href="css/iehacks.css">
<![endif]-->


<!-- Loading Ext ver 4.0.7 Library -->
<!-- <script type="text/javascript" src="./lib/ext-4.0.7-gpl/ext.js"></script> -->
<script type="text/javascript" src="./lib/ext-4.0.7-gpl/ext-all-debug.js"></script>
<!-- Loading OpenLayers ver 2.11 Library -->
<script src="./lib/OpenLayers-2.11/OpenLayers.js" type="text/javascript"></script>
<script src="./lib/proj4js-combined.js" type="text/javascript" charset="utf-8"></script>
<script src="./lib/OWM.OpenLayers.1.3.4.js" ></script>
<link href='./lib/OpenLayers-2.11/theme/default/style.css' rel='stylesheet' type='text/css' />

<script src="./lib/ext-4.0.7-gpl/ux/Animated.js" type="text/javascript"></script> 
<script src="./lib/ext-4.0.7-gpl/ext.imageviewer.js" type="text/javascript"></script> 

<!-- Loading GeoExt Library -->
<!-- <script src="./lib/GeoExt/PrintPageField.js" type="text/javascript"></script> 
<script src="./lib/GeoExt/PrintExtent.js" type="text/javascript"></script> 
<script src="./lib/GeoExt/PrintProviderField.js" type="text/javascript"></script> 
<script src="./lib/GeoExt/SimplePrint.js" type="text/javascript"></script> --> 
<!-- <script src="./lib/GeoExt/LayerNode.js" type="text/javascript"></script>  -->
<script src="./lib/GeoExt/Popup.js" type="text/javascript"></script>
<script src="./lib/GeoExt/Action.js" type="text/javascript"></script>
<script src="./lib/FeaturePopups.js" type="text/javascript"></script>
<!-- <script src="./lib/patches_OL-popup-autosize.js" type="text/javascript"></script> -->

<script src="http://maps.google.com/maps?file=api&amp;v=2&amp;sensor=false&amp;key=AIzaSyCmhrZ4JzlFowNGz6hrT3eqEojeSV-ZWvk" type="text/javascript"></script> 

<!-- Loading wax Library -->
<!-- <script src="./lib/wax/dist/wax.ol.js" type="text/javascript"></script>
<link href='./lib/wax/css/controls.css' rel='stylesheet' type='text/css' /> -->

<!-- Loading ux Library -->
<!-- <script type="text/javascript" src="./lib/ux/Ext.ux.ColorField.js"></script> -->

<script type="text/javascript">			
 	msg.replaceData(0, msg.length, "Loading GUI...");	
</script>
<!-- Loading Main Library -->
<script type="text/javascript" src="./js/UTILS.js"></script>
<script type="text/javascript" src="./js/DATAVIEW.js"></script>
<script type="text/javascript" src="./js/TREE.js"></script>
<script type="text/javascript" src="./js/FILTER.js"></script>
<script type="text/javascript" src="./js/DATA.js"></script>
<script type="text/javascript" src="./js/PRINT.js"></script>
<script type="text/javascript" src="./js/CONTROL.js"></script>
<script type="text/javascript" src="./js/TOOLS.js"></script>
<script type="text/javascript" src="./js/COORD.js"></script>
<script type="text/javascript" src="./js/FINDER.js"></script>
<script type="text/javascript" src="./js/RSS.js"></script>
<script type="text/javascript" src="./js/SECURITY.js"></script>
<script type="text/javascript" src="./js/LYCUSTOM.js"></script>
<script type="text/javascript" src="./js/SEARCH.js"></script>
<script type="text/javascript" src="./js/APP.js"></script>
<!-- <script type="text/javascript" src="./js/Map.JS"></script> -->

<script type="text/javascript">
Ext.Loader.setPath('Ext.ux.DataView', '../lib/ux/DataView/');
Ext.require([
    'Ext.grid.*',
    'Ext.Action',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.tree.*',
    'Ext.chart.*',
    'Ext.loader.*',
    'Ext.layout.container.Fit',
    'Ext.form.field.File',
	'Ext.data.reader.Xml' ,  
	'Ext.tip.QuickTipManager',
    'Ext.menu.*',
    'Ext.form.field.ComboBox',
    'Ext.layout.container.Table',
    'Ext.container.ButtonGroup',
    'Ext.ux.DataView.Animated' 
]);
var incidentFlag = 0;
<?php 
if ($_SESSION['id']=='1') {
	 echo 'incidentFlag = 1;';
}
?>

 Ext.onReady(APP.init, APP);
//Ext.onReady(init, this);
</script>

</head>
	
	<body oncontextmenu="return false;">


		<div id="all">
			<div id="west"></div>
			<div id="north"></div>
			<div id="tools"></div>
			<div id="centerDiv">
				<div id="mapDiv">
					<div id="legendDiv"><!-- <img src="mapfile/legend/legend-MPE.png" /> --></div>
					<div id="legendDiv2"><!-- <img style="height: 60px;" src="http://trmm.gsfc.nasa.gov/trmm_rain/Events/tafd_3hr_rain_dump_google_wedge.png" /> --></div>
					<div id="immaplogo"><!-- <img src="image/iMMAP_small.png" /> --></div>
					<div id="editControl" <?php if ($_SESSION['id']!='1') { echo ' style="display: none"';} else {echo ' style="display: none"';}?>></div>
					<div id="xyInfoDiv"></div>
					<div id="scaleDiv"></div>
				</div>	
			</div>
			<div id="eastTabs"></div>
			<!-- <div id="props-panel" style="width:200px;height:200px;overflow:hidden;"></div> -->
			<div id="south"></div>
		</div>

<script type="text/javascript">
	document.getElementById('loading').style.display = 'none';	
</script>
	</body>
</html>