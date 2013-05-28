<?php


function prepare(){
	$GLOBALS['request']=ms_newowsrequestobj();
	$GLOBALS['map']=ms_newMapObj($GLOBALS['map_path']."ol_base.map" );
}

function loadParams(){
	//$GLOBALS['request']->loadparams(); // this is not work for mapscript in mapservef 6
	foreach ($_GET as $k=>$v) {
		if ($k=='QUERY_LAYERS'){
    		$GLOBALS['request']->setParameter($k, str_replace(",flood2","",$v));
		} else {
			if (($k=='WIDTH') && ($v==2049)){
				$GLOBALS['request']->setParameter($k, 2048);
			} else {
				 $GLOBALS['request']->setParameter($k, $v);
			}
		}	
    }
}

function drawMap(){
	ms_ioinstallstdouttobuffer();
	$GLOBALS['map']->owsdispatch($GLOBALS['request']);	
	$contenttype = ms_iostripstdoutbuffercontenttype();
	if ($contenttype == 'image/png')
	      header('Content-type: image/png');	
	if ($contenttype == 'EPSG:4326')
	      header('Content-type: EPSG:4326');	
	ms_iogetStdoutBufferBytes();
	ms_ioresethandlers();             
}

function defineLayer(){
	$layerName = "dataLayer";
	$mapquery = $_REQUEST['MAPQUERY'];
	
	$new_layer[$layerName] = ms_newLayerObj($GLOBALS['map']);	
	$new_layer[$layerName]->set("template", "blank"); 
	$new_layer[$layerName]->set("name", $layerName);
	$new_layer[$layerName]->setProjection('init=epsg:4326');
	$new_layer[$layerName]->setMetaData('WMS_TITLE', $layerName);
	$new_layer[$layerName]->setMetaData('WMS_SRS', 'epsg:900913 epsg:4326');
	$new_layer[$layerName]->setMetaData('wms_feature_info_mime_type', 'text/xml');
	$new_layer[$layerName]->setMetaData('ows_feature_info_mime_type', 'text/xml');
	$new_layer[$layerName]->setMetaData('ows_include_items', 'all');
	$new_layer[$layerName]->setMetaData('ows_geometries', 'geom');
	$new_layer[$layerName]->setMetaData('gml_geometries', 'geom');
	$new_layer[$layerName]->setMetaData('wfs_geometries', 'geom');
	$new_layer[$layerName]->setMetaData('gml_geom_type', 'polygon');
	$new_layer[$layerName]->setMetaData('wms_include_items', 'all');
	$new_layer[$layerName]->setMetaData('wfs_enable_request', '*');		
	$new_layer[$layerName]->setMetaData('gml_featureid', 'Location_ID');
	$new_layer[$layerName]->setMetaData('gml_include_items', 'all');	
	//$new_layer[$layerName]->setConnectionType(MS_PLUGIN, "C:/ms4w/Apache/specialplugins/msplugin_mssql2008.dll");
	$new_layer[$layerName]->setConnectionType(MS_PLUGIN, "/usr/lib/x86_64-linux-gnu/odbc/libtdsodbc.so");
	$new_layer[$layerName]->setProcessing('CLOSE_CONNECTION=DEFER');	
	$new_layer[$layerName]->set("connection", $GLOBALS['MSSQLServerConn']);	
	$new_layer[$layerName]->set("data", "$mapquery");	
	$new_layer[$layerName]->set("status", MS_ON);	
	$new_layer[$layerName]->set("dump", true);
	$new_layer[$layerName]->set("type", MS_LAYER_POLYGON);	
	$new_layer[$layerName]->set("opacity", 50);	
	createClassLayer($new_layer[$layerName]);
}

function createClassLayer($layer){
	// include 'dbconnect.php';	
	$valRange = array();
	$getItemQRY = "select max(".$_REQUEST['CLASSITEM'].") as maxval, min(".$_REQUEST['CLASSITEM'].") as minval from ".$_REQUEST['TABLEITEM'];
	$dbinfo = getDB();
	$result = sqlsrv_query( $dbinfo, $getItemQRY);
	$obj = sqlsrv_fetch_array( $result);

	sqlsrv_close( $dbinfo );
	
	$colorArray = array(
		0 => array('r'=>255,'g'=>204,'b'=>204),
		1 => array('r'=>255,'g'=>128,'b'=>128),
		2 => array('r'=>255,'g'=>0,'b'=>0),
		3 => array('r'=>128,'g'=>0,'b'=>0),
		4 => array('r'=>56,'g'=>0,'b'=>0)
	);
	
	$range = getRange($obj);	
	for ($i=0;$i<5;$i++){
		$new_class[$i] = ms_newClassObj($layer);
		$new_class[$i]->set("name", $range[$i]." - ".$range[$i+1]);
		$new_class[$i]->setExpression("(([".$_REQUEST['CLASSITEM']."] > ".$range[$i].") AND ([".$_REQUEST['CLASSITEM']."] < ".$range[$i+1]."))");
		$new_style[$i] = ms_newStyleObj($new_class[$i]);
		$new_style[$i]->color->setRGB($colorArray[$i]['r'],$colorArray[$i]['g'],$colorArray[$i]['b']);
		$new_style[$i]->outlinecolor->setRGB(255,128,0);

	}	
}

function getRange($valRange){
	$min = $valRange['minval'];
	$max = $valRange['maxval'];
	$allrange = $max-0;
	$range = $allrange/5;
	$rangeArray = array();
	$value = 0;
	for ($i=0;$i<6;$i++){
		$rangeArray[$i] = $value;
		$value += $range;
	}
	return $rangeArray;
}

function defineGeoRSS($url){
	$layerName = "georss";
	
	downloadfile ($url,$layerName.'.xml');
	
	$new_layer[$layerName] = ms_newLayerObj($GLOBALS['map']);	
	$new_layer[$layerName]->set("template", "blank"); 
	$new_layer[$layerName]->set("name", $layerName);
	$new_layer[$layerName]->setProjection('init=epsg:4326');
	$new_layer[$layerName]->setMetaData('WMS_TITLE', $layerName);
	$new_layer[$layerName]->setMetaData('WMS_SRS', 'epsg:900913 epsg:4326');
	$new_layer[$layerName]->setMetaData('wms_feature_info_mime_type', 'text/xml');
	$new_layer[$layerName]->setMetaData('ows_feature_info_mime_type', 'text/xml');
	$new_layer[$layerName]->setMetaData('ows_include_items', 'all');
	$new_layer[$layerName]->setMetaData('ows_geometries', 'geom');
	$new_layer[$layerName]->setMetaData('gml_geometries', 'geom');
	$new_layer[$layerName]->setMetaData('wfs_geometries', 'geom');
	$new_layer[$layerName]->setMetaData('gml_geom_type', 'point');
	$new_layer[$layerName]->setMetaData('wms_include_items', 'all');
	$new_layer[$layerName]->setMetaData('wfs_enable_request', '*');		
	$new_layer[$layerName]->setMetaData('gml_featureid', 'Location_ID');
	$new_layer[$layerName]->setMetaData('gml_include_items', 'all');	
	$new_layer[$layerName]->setConnectionType(MS_OGR);
	$new_layer[$layerName]->setProcessing('CLOSE_CONNECTION=DEFER');	
		
	$new_layer[$layerName]->set("connection", $layerName.'.xml');
	$new_layer[$layerName]->set("data", "select * from georss");	
	$new_layer[$layerName]->set("status", MS_ON);	
	$new_layer[$layerName]->set("dump", true);
	$new_layer[$layerName]->set("type", MS_LAYER_POINT);
	$new_layer[$layerName]->set("labelitem","title");
	$new_class = ms_newClassObj($new_layer[$layerName]);
	$new_class->set("name", $layerName);
	
	$new_style = ms_newStyleObj($new_class);
	$new_style->set("symbolname", "../mapfile/image/earthquake.png");
	$new_style->set("size", 24);
	
	$new_class->label->set("position", MS_AUTO);
	$new_class->label->set("font","arial-bold");
	$new_class->label->set("size",MS_GIANT);
	$new_class->label->color->setRGB(250,0,0);
	$new_class->label->outlinecolor->setRGB(255,255,255);
	$new_class->label->set(minsize,4);
	$new_class->label->set(maxsize,100000);
}


function downloadfile ($url,$filename){
	$ch = curl_init();
	/**
	* Set the URL of the page or file to download.
	*/
	curl_setopt($ch, CURLOPT_URL,$url);
	
	$fp = fopen('../mapfile/'.$filename, 'w+');
	/**
	* Ask cURL to write the contents to a file
	*/
	curl_setopt($ch, CURLOPT_FILE, $fp);
	
	curl_exec ($ch);
	
	curl_close ($ch);
	fclose($fp);
	
}

function defineCosmeticsLayer(){
	$layerName = "cosmetics";
	$polygon = $_REQUEST['filterShape'];
	
	$new_layer[$layerName] = ms_newLayerObj($GLOBALS['map']);	
	$new_layer[$layerName]->set("template", "blank"); 
	$new_layer[$layerName]->set("name", $layerName);
	$new_layer[$layerName]->setProjection('init=epsg:4326');
	$new_layer[$layerName]->setMetaData('WMS_TITLE', $layerName);
	$new_layer[$layerName]->setMetaData('WMS_SRS', 'epsg:900913 epsg:4326');
	$new_layer[$layerName]->setMetaData('wms_feature_info_mime_type', 'text/xml');
	$new_layer[$layerName]->setMetaData('ows_feature_info_mime_type', 'text/xml');
	$new_layer[$layerName]->setMetaData('ows_include_items', 'all');
	$new_layer[$layerName]->setMetaData('ows_geometries', 'geom');
	$new_layer[$layerName]->setMetaData('gml_geometries', 'geom');
	$new_layer[$layerName]->setMetaData('wfs_geometries', 'geom');
	$new_layer[$layerName]->setMetaData('gml_geom_type', 'polygon');
	$new_layer[$layerName]->setMetaData('wms_include_items', 'all');
	$new_layer[$layerName]->setMetaData('wfs_enable_request', '*');		
	$new_layer[$layerName]->setMetaData('gml_featureid', 'Location_ID');
	$new_layer[$layerName]->setMetaData('gml_include_items', 'all');	
	//$new_layer[$layerName]->setConnectionType(MS_PLUGIN, "C:/ms4w/Apache/specialplugins/msplugin_mssql2008.dll");
	$new_layer[$layerName]->setConnectionType(MS_PLUGIN, "/usr/lib/x86_64-linux-gnu/odbc/libtdsodbc.so");
	$new_layer[$layerName]->setProcessing('CLOSE_CONNECTION=DEFER');	
	$new_layer[$layerName]->set("connection", $GLOBALS['MSSQLServerConn']);	
	$new_layer[$layerName]->set("data", "geom from (select 1 as Location_ID, geometry::STGeomFromText('".$_REQUEST['filterShape']."', 4326) as geom) as new_table USING UNIQUE Location_ID USING SRID=4326");	
	$new_layer[$layerName]->set("status", MS_ON);	
	$new_layer[$layerName]->set("dump", true);
	$new_layer[$layerName]->set("type", MS_LAYER_POLYGON);	
	$new_layer[$layerName]->set("opacity", 25);	
	$new_class = ms_newClassObj($new_layer[$layerName]);
	$new_class->set("name", "Buffers");
	$new_style[$i] = ms_newStyleObj($new_class);
	$new_style[$i]->color->setRGB(255,0,0);
	$new_style[$i]->outlinecolor->setRGB(255,128,0);
}

function generateBaselayers ($sentparams){
	/* ---
	 * 
	*/	
	$sentJSON=json_decode($_REQUEST['sentJSON'],true);
	
	foreach ($sentparams as $key => $layerObj){
		if (($layerObj['group']=="Base Layers") || ($layerObj['group']=="Editable Layers")){
			$obj = $layerObj['children'];
			// generate layers
			foreach ($obj as $key => $objret) {
				$layerName = $objret['layer'];
				$criteria = "";	
				if ($sentJSON!=null){
					foreach ($sentJSON as $sj => $jsonobj){
						if ($jsonobj['layer']==$layerName){
							foreach ($jsonobj['criteria'] as $sx => $critobj){
								$criteria .= " AND ('[".$critobj["column"]."]'".$critobj["op"]."'".$critobj["val"]."')";
							}
						}
					}
				}
				$new_layer[$layerName] = ms_newLayerObj($GLOBALS['map']);	
				$new_layer[$layerName]->set("template", "blank"); 
				$new_layer[$layerName]->set("name", $layerName);
				$new_layer[$layerName]->setProjection('init=epsg:4326');
				$new_layer[$layerName]->setMetaData('WMS_TITLE', $layerName);
				$new_layer[$layerName]->setMetaData('WMS_SRS', 'epsg:900913 epsg:4326');
				$new_layer[$layerName]->setMetaData('WFS_SRS', 'epsg:900913 epsg:4326');
				$new_layer[$layerName]->setMetaData('wms_feature_info_mime_type', 'text/xml');
				$new_layer[$layerName]->setMetaData('ows_feature_info_mime_type', 'text/xml');
				$new_layer[$layerName]->setMetaData('ows_include_items', 'all');
				$new_layer[$layerName]->setMetaData('ows_geometries', 'geom');
				$new_layer[$layerName]->setMetaData('gml_geometries', 'geom');
				$new_layer[$layerName]->setMetaData('wfs_geometries', 'geom');
				$new_layer[$layerName]->setMetaData('gml_geom_type', $objret['layertype']);
				$new_layer[$layerName]->setMetaData('wms_include_items', 'all');
				$new_layer[$layerName]->setMetaData('wfs_enable_request', '*');		
				$new_layer[$layerName]->setMetaData('gml_featureid', 'gid');
				$new_layer[$layerName]->setMetaData('gml_include_items', 'all');
				if ($objret['sourceformat']=="shapefile"){
					$new_layer[$layerName]->set("data", "shapefiles/".$objret['data']);
				} else if ($objret['sourceformat']=="sqlsrvdbpak"){
					$new_layer[$layerName]->set("data", $objret['data']);
					//$new_layer[$layerName]->setConnectionType(MS_PLUGIN, "C:/ms4w/Apache/specialplugins/msplugin_mssql2008.dll");
					$new_layer[$layerName]->setConnectionType(MS_PLUGIN, "/usr/lib/x86_64-linux-gnu/odbc/libtdsodbc.so");
					$new_layer[$layerName]->setConnectionType(MS_OGR);
					$new_layer[$layerName]->setProcessing('CLOSE_CONNECTION=DEFER');	
					$new_layer[$layerName]->set("connection", $GLOBALS['MSSQLServerConn']);		
				} else if ($objret['sourceformat']=="incidentdata"){
					$new_layer[$layerName]->setConnectionType(MS_POSTGIS);
					$new_layer[$layerName]->set("data", $objret['data']);
					$new_layer[$layerName]->setProcessing('CLOSE_CONNECTION=DEFER');	
					$hostUrl = $GLOBALS['serverUrl'];
					$dbName = $GLOBALS['dbname'];
					$userName = $GLOBALS['username'];
					$passwd = $GLOBALS['password'];
					$port = $GLOBALS['port'];
					$new_layer[$layerName]->set("connection", "host=$hostUrl user=$userName password=$passwd dbname=$dbName port=$port");		
				}
				$new_layer[$layerName]->set("status", MS_ON);	
				$new_layer[$layerName]->set("dump", true);
				if(!empty($objret['opacity']))
					$new_layer[$layerName]->set('opacity',$objret['opacity']); 
				
				if(!empty($objret['labelitem']))
					$new_layer[$layerName]->set('labelitem',$objret['labelitem']);
			
				foreach ($objret['category'] as $i => $value) {
					// var_dump($i);	
					$new_class[$i] = ms_newClassObj($new_layer[$layerName]);
					$new_class[$i]->set("name", $objret['category'][$i]['name']);		
					if ($objret['classitem']!=''){	
						$new_class[$i]->setExpression("(('[".$objret['classitem']."]' = '".$i."')".$_REQUEST['CRITERIA'].$criteria.")");
					}
					
					if(!empty($objret['category'][$i]['maxscaledenom']))
						$new_class[$i]->set("maxscaledenom",$objret['category'][$i]['maxscaledenom']);	
					if(!empty($objret['category'][$i]['minscaledenom']))
						$new_class[$i]->set("minscaledenom",$objret['category'][$i]['minscaledenom']);	
					
					$new_class[$i]->label->set("position", MS_AUTO);
					$new_class[$i]->label->set("font","verdana");
					$new_class[$i]->label->set("size",MS_GIANT);
					$new_class[$i]->label->color->setRGB(0,0,0);
					$new_class[$i]->label->outlinecolor->setRGB(255,255,255);	
						
					if ($objret['layertype']=='point'){
						$new_layer[$layerName]->set("type", MS_LAYER_POINT);
						if (empty($objret['category'][$i]['style'])){					
							$new_style = ms_newStyleObj($new_class[$i]);
							if ($objret['category'][$i]['symbolname']!='')	
								$new_style->set("symbolname", "../mapfile/image/".$objret['category'][$i]['symbolname']);
						} else {
							foreach ($objret['category'][$i]['style'] as $x => $value_x) {
								$new_style = ms_newStyleObj($new_class[$i]);
								if ($objret['category'][$i]['style'][$x]['symbolname']!='')
									$new_style->set("symbolname", $objret['category'][$i]['style'][$x]['symbolname']);
								if(!empty($objret['category'][$i]['style'][$x]['outlinecolor']))
									$new_style->outlinecolor->setRGB($objret['category'][$i]['style'][$x]['outlinecolor']['R'],$objret['category'][$i]['style'][$x]['outlinecolor']['G'],$objret['category'][$i]['style'][$x]['outlinecolor']['B']);
								if(!empty($objret['category'][$i]['style'][$x]['color']))
									$new_style->color->setRGB($objret['category'][$i]['style'][$x]['color']['R'],$objret['category'][$i]['style'][$x]['color']['G'],$objret['category'][$i]['style'][$x]['color']['B']);
								if(!empty($objret['category'][$i]['style'][$x]['size']))
									$new_style->set("size",$objret['category'][$i]['style'][$x]['size']);		
												
							}	
						}
						
					} else if ($objret['layertype']=='line'){
						$new_layer[$layerName]->set("type", MS_LAYER_LINE);
		
						if(!empty($objret['category'][$i]['style']))
							foreach ($objret['category'][$i]['style'] as $x => $value_x) {
								$new_style = ms_newStyleObj($new_class[$i]);
								if ($objret['category'][$i]['style'][$x]['symbolname']!='')
									$new_style->set("symbolname", $objret['category'][$i]['style'][$x]['symbolname']);
								if(!empty($objret['category'][$i]['style'][$x]['outlinecolor']))
									$new_style->outlinecolor->setRGB($objret['category'][$i]['style'][$x]['outlinecolor']['R'],$objret['category'][$i]['style'][$x]['outlinecolor']['G'],$objret['category'][$i]['style'][$x]['outlinecolor']['B']);
								if(!empty($objret['category'][$i]['style'][$x]['color']))
									$new_style->color->setRGB($objret['category'][$i]['style'][$x]['color']['R'],$objret['category'][$i]['style'][$x]['color']['G'],$objret['category'][$i]['style'][$x]['color']['B']);
								if(!empty($objret['category'][$i]['style'][$x]['width']))
									$new_style->set("width",$objret['category'][$i]['style'][$x]['width']);
							}
					} else if ($objret['layertype']=='polygon'){
						$new_layer[$layerName]->set("type", MS_LAYER_POLYGON);
					
						if(!empty($objret['category'][$i]['style']))
							foreach ($objret['category'][$i]['style'] as $x => $value_x) {
								$new_style = ms_newStyleObj($new_class[$i]);
								if ($objret['category'][$i]['style'][$x]['symbolname']!='')
									$new_style->set("symbolname", $objret['category'][$i]['style'][$x]['symbolname']);
								if(!empty($objret['category'][$i]['style'][$x]['outlinecolor']))
									$new_style->outlinecolor->setRGB($objret['category'][$i]['style'][$x]['outlinecolor']['R'],$objret['category'][$i]['style'][$x]['outlinecolor']['G'],$objret['category'][$i]['style'][$x]['outlinecolor']['B']);
								if(!empty($objret['category'][$i]['style'][$x]['color']))
									$new_style->color->setRGB($objret['category'][$i]['style'][$x]['color']['R'],$objret['category'][$i]['style'][$x]['color']['G'],$objret['category'][$i]['style'][$x]['color']['B']);
								if(!empty($objret['category'][$i]['style'][$x]['width']))
									$new_style->set("width",$objret['category'][$i]['style'][$x]['width']);
							}										
					}		
				} // end of foreach
			} // end of for each				
		} else if ($layerObj['group']=="WMS"){
			$obj = $layerObj['children'];
			foreach ($obj as $key => $objret) {
				$layerName = $objret['layer'];
				$new_layer[$layerName] = ms_newLayerObj($GLOBALS['map']);	
				$new_layer[$layerName]->set("template", "blank"); 
				$new_layer[$layerName]->set("name", $layerName);
				$new_layer[$layerName]->setConnectionType(MS_WMS);
				$new_layer[$layerName]->set("connection", $objret['url']);
				$new_layer[$layerName]->set("status", MS_ON);	
				$new_layer[$layerName]->set("opacity", 50);	
				$new_layer[$layerName]->set("type", MS_RASTER);
				$new_layer[$layerName]->setProjection('init=epsg:4326');
				$new_layer[$layerName]->setMetaData('wms_name', $layerName);
				$new_layer[$layerName]->setMetaData('wms_srs', 'epsg:900913 epsg:4326');
				$new_layer[$layerName]->setMetaData('wms_feature_info_mime_type', 'text/xml');
				$new_layer[$layerName]->setMetaData('wms_onlineresource', 'http://oasispakistan.pk/php/getmap.php');
				$new_layer[$layerName]->setMetaData('wms_include_items', 'all');
				$new_layer[$layerName]->setMetaData('wms_server_version', '1.1.0');
				$new_layer[$layerName]->setMetaData('wms_formatlist', 'image/gif,image/png,image/jpeg,image/wbmp');
				$new_layer[$layerName]->setMetaData('wms_format', 'image/png');
			}
		}
	}
}

function generateUserlayers (){
	/* ---
	 * 
	*/
	// include 'dbconnect.php';	
	session_start();
	$userid = $_SESSION['user'];
	
	if (empty($_SESSION['user'])){
		$userid=$_REQUEST['userid'];
	}
	
	$query = "Select * from \"Administration\".layerconf where userid = '$userid'";
	$dbinfo = getDB();
	$result = pg_query( $dbinfo, $query);
	
	while ($obj = pg_fetch_array( $result)){
		$res[] = $obj['conf']; 
	}
	
	if ($res){
		foreach ($res as $key => $objret) {
			$objret = json_decode($objret);
			$layerName = $objret->layer;
			$criteria = "";	
			if ($sentJSON!=null){
				foreach ($sentJSON as $sj => $jsonobj){
					if ($jsonobj['layer']==$layerName){
						foreach ($jsonobj['criteria'] as $sx => $critobj){
							$criteria .= " AND ('[".$critobj["column"]."]'".$critobj["op"]."'".$critobj["val"]."')";
						}
					}
				}
			}
			$new_layer[$layerName] = ms_newLayerObj($GLOBALS['map']);	
			$new_layer[$layerName]->set("template", "blank"); 
			$new_layer[$layerName]->set("name", $layerName);
			$new_layer[$layerName]->setProjection('init=epsg:4326');
			$new_layer[$layerName]->setMetaData('WMS_TITLE', $layerName);
			$new_layer[$layerName]->setMetaData('WMS_SRS', 'epsg:900913 epsg:4326');
			$new_layer[$layerName]->setMetaData('WFS_SRS', 'epsg:900913 epsg:4326');
			$new_layer[$layerName]->setMetaData('wms_feature_info_mime_type', 'text/xml');
			$new_layer[$layerName]->setMetaData('ows_feature_info_mime_type', 'text/xml');
			$new_layer[$layerName]->setMetaData('ows_include_items', 'all');
			$new_layer[$layerName]->setMetaData('ows_geometries', 'geom');
			$new_layer[$layerName]->setMetaData('gml_geometries', 'geom');
			$new_layer[$layerName]->setMetaData('wfs_geometries', 'geom');
			$new_layer[$layerName]->setMetaData('gml_geom_type', $objret->layertype);
			$new_layer[$layerName]->setMetaData('wms_include_items', 'all');
			$new_layer[$layerName]->setMetaData('wfs_enable_request', '*');		
			$new_layer[$layerName]->setMetaData('gml_featureid', 'gid');
			$new_layer[$layerName]->setMetaData('gml_include_items', 'all');
			if ($objret->sourceformat=="shapefile"){
				$new_layer[$layerName]->set("data", "shapefiles/".$objret->data);
			} else if ($objret->sourceformat=="sqlsrvdbpak"){
				$new_layer[$layerName]->set("data", $objret->data);
				//$new_layer[$layerName]->setConnectionType(MS_PLUGIN, "C:/ms4w/Apache/specialplugins/msplugin_mssql2008.dll");
				$new_layer[$layerName]->setConnectionType(MS_PLUGIN, "/usr/lib/x86_64-linux-gnu/odbc/libtdsodbc.so");
				$new_layer[$layerName]->setProcessing('CLOSE_CONNECTION=DEFER');	
				$new_layer[$layerName]->set("connection", $GLOBALS['MSSQLServerConn']);		
			}
			$new_layer[$layerName]->set("status", MS_ON);	
			$new_layer[$layerName]->set("dump", true);
			if(!empty($objret->opacity))
				$new_layer[$layerName]->set('opacity',$objret->opacity); 
			
			
			foreach ($objret->category as $i => $value) {
				// var_dump($value->symbolname);	
				$new_class[$i] = ms_newClassObj($new_layer[$layerName]);
				$new_class[$i]->set("name", $value->name);
				
				if ($objret->classitem!=''){	
					$new_class[$i]->setExpression("(('[".$objret->classitem."]' = '".$i."')".$_REQUEST['CRITERIA'].$criteria.")");
				}
				if ($objret->layertype=='point'){
					$new_layer[$layerName]->set("type", MS_LAYER_POINT);
					
					if (empty($value->style)){					
						$new_style = ms_newStyleObj($new_class[$i]);
						if ($value->symbolname!='')	
							$new_style->set("symbolname", "../mapfile/image/".$value->symbolname);
					} else {
						foreach ($value->style as $x => $value_x) {
							$new_style = ms_newStyleObj($new_class[$i]);
							if ($value_x->symbolname!='')
								$new_style->set("symbolname", $value_x->symbolname);
							if(!empty($value_x->outlinecolor))
								$new_style->outlinecolor->setRGB($value_x->outlinecolor->R, $value_x->outlinecolor->G, $value_x->outlinecolor->B);
							if(!empty($value_x->color))
								$new_style->color->setRGB($value_x->color->R,$value_x->color->G,$value_x->color->B);
							if(!empty($value_x->size))
								$new_style->set("size",$value_x->size);						
						}	
					}
					
				} else if ($objret->layertype=='line'){
					$new_layer[$layerName]->set("type", MS_LAYER_LINE);
					if(empty($value->style)){						
						if ($value->symbolname=='line-one'){							
							$new_style = ms_newStyleObj($new_class[$i]);
							$r = hexdec(substr($value->color,0,2));
						    $g = hexdec(substr($value->color,2,2));
						    $b = hexdec(substr($value->color,4,2));
							$new_style->color->setRGB($r,$g,$b);
							$new_style->set("width",0.75*$value->size);
						} 
					}	
				} else if ($objret->layertype=='polygon'){
					$new_layer[$layerName]->set("type", MS_LAYER_POLYGON);
					if(empty($value->style)){						
													
							$new_style = ms_newStyleObj($new_class[$i]);
							$rc = hexdec(substr($value->color,0,2));
						    $gc = hexdec(substr($value->color,2,2));
						    $bc = hexdec(substr($value->color,4,2));
							$ro = hexdec(substr($value->outlinecolor,0,2));
						    $go = hexdec(substr($value->outlinecolor,2,2));
						    $bo = hexdec(substr($value->outlinecolor,4,2));
							$new_style->color->setRGB($rc,$gc,$bc);
							$new_style->outlinecolor->setRGB($ro,$go,$bo);
						 
					}
															
				}		
			} // end of foreach
		
		} // end of for each
	} //end if	
}

function defineFloodedOverlay($sentparams){
	foreach ($sentparams as $key => $layerObj){
		if ($layerObj['group']=="External Data"){
			$obj = $layerObj['children'];
			// generate layers
			foreach ($obj as $k=>$v) {		
				if ($v['layertype']=='groundoverlay1'){
					$array = array(
						"layername" => $v['layer'],
						"layerText" => $v['text']
						);
					$filename = 'tmp/'.$array["layername"];
					$coord = explode(',',$_REQUEST['TEMPBOUNDS']);
				
					$layerName = $array['layername'];
					// echo $layerName."<br>";	
		
					$new_layer[$layerName] = ms_newLayerObj($GLOBALS['map']);	
					// $new_layer[$layerName]->set("template", "blank"); 
					$new_layer[$layerName]->set("name", $layerName);
					$new_layer[$layerName]->set("type", MS_LAYER_RASTER);	
					$new_layer[$layerName]->setProjection('init=epsg:4326');
					$new_layer[$layerName]->setMetaData('WMS_TITLE', $layerName);
					$new_layer[$layerName]->setMetaData('WMS_SRS', 'epsg:900913 epsg:4326');
					$new_layer[$layerName]->setMetaData('wms_feature_info_mime_type', 'text/xml');
					$new_layer[$layerName]->set("status", MS_ON);	
					$new_layer[$layerName]->set("data", "../php/tmp/".$array["layername"].".tif");
					$new_class = ms_newClassObj($new_layer[$layerName]);
					$new_class->set("name", $array['layerText']);
					$new_layer[$layerName]->set("opacity", 60);	
				}
			}		
		}
	}

}

function defineKML($layer, $sentparams){
	foreach ($sentparams as $key => $layerObj){
		if ($layerObj['group']=="KML"){
			$obj = $layerObj['children'];
			foreach ($obj as $i => $value) {
				if ($value['layer']==$layer){
					$url = $value['url'];		
				}		
			}
		}
	}			
	// $extData = 	$sentparams[2]['children'];
	// foreach ($extData as $i => $value) {
		// if ($value['layer']==$layer){
			// $url = $value['url'];			
		// }		
	// }	
	$layerName = $layer;
	
	if (file_exists('../mapfile/'.$layerName.'.kml')) {
	    $filetime = filemtime('../mapfile/'.$layerName.'.kml');
		$timedifftemp = time()-$filetime;
		$timediff = $timedifftemp/60;
		if ($timediff>1440){		
			downloadfile ($url,$layerName.'.kml');
			// disini	
			fixDownloadedFile('../mapfile/'.$layerName.'.kml');			
		}		
	} else {
		downloadfile ($url,$layerName.'.kml');	
		fixDownloadedFile('../mapfile/'.$layerName.'.kml');
	}
	
	
	$new_layer[$layerName] = ms_newLayerObj($GLOBALS['map']);	
	$new_layer[$layerName]->set("template", "blank"); 
	$new_layer[$layerName]->set("name", $layerName);
	$new_layer[$layerName]->setProjection('init=epsg:4326');
	$new_layer[$layerName]->setMetaData('WMS_TITLE', $layerName);
	$new_layer[$layerName]->setMetaData('WMS_SRS', 'epsg:900913 epsg:4326');
	$new_layer[$layerName]->setMetaData('wms_feature_info_mime_type', 'text/xml');
	$new_layer[$layerName]->setMetaData('ows_feature_info_mime_type', 'text/xml');
	$new_layer[$layerName]->setMetaData('ows_include_items', 'all');
	$new_layer[$layerName]->setMetaData('ows_geometries', 'geom');
	$new_layer[$layerName]->setMetaData('gml_geometries', 'geom');
	$new_layer[$layerName]->setMetaData('wfs_geometries', 'geom');
	$new_layer[$layerName]->setMetaData('gml_geom_type', 'point');
	$new_layer[$layerName]->setMetaData('wms_include_items', 'all');
	$new_layer[$layerName]->setMetaData('wfs_enable_request', '*');		
	$new_layer[$layerName]->setMetaData('gml_featureid', 'Location_ID');
	$new_layer[$layerName]->setMetaData('gml_include_items', 'all');	
	$new_layer[$layerName]->setConnectionType(MS_OGR);
	$new_layer[$layerName]->setProcessing('CLOSE_CONNECTION=DEFER');		
	$new_layer[$layerName]->set("connection", $layerName.'.kml');
	$new_layer[$layerName]->set("data", " Fire Points List ");	
	$new_layer[$layerName]->set("status", MS_ON);	
	$new_layer[$layerName]->set("dump", true);
	$new_layer[$layerName]->set("type", MS_LAYER_POINT);
	
	$new_class = ms_newClassObj($new_layer[$layerName]);
	$new_class->set("name", $layerName);
	$new_style = ms_newStyleObj($new_class);
	$new_style->set("symbolname", "../mapfile/image/fire.png");
	$new_style->set("size", 24);	
}

function fixDownloadedFile ($filename){
	$data = file_get_contents($filename);
	$data = preg_replace('/[^(\x20-\x7F)]*/', '', $data);		
	file_put_contents($filename, $data);
	
}


function defineGroundOverlay($sentparams){
	// test
	$datatime = $_REQUEST['HISTLAYER'];
	if ($datatime==''){
		$datatime = '030';
	} else {
		if (strlen($datatime)==2){
			$datatime = '0'.$datatime;
		}
	}
	
	$filename = 'tmp/tempmonsoon';
	$coord = explode(',',$_REQUEST['TEMPBOUNDS']);
	
	$conf = readKMLfile($sentparams);
	$layerName = $conf['layername'];
		
	$new_layer[$layerName] = ms_newLayerObj($GLOBALS['map']);	
	// $new_layer[$layerName]->set("template", "blank"); 
	$new_layer[$layerName]->set("name", $layerName);
	$new_layer[$layerName]->set("type", MS_LAYER_RASTER);	
	$new_layer[$layerName]->setProjection('init=epsg:4326');
	$new_layer[$layerName]->setMetaData('WMS_TITLE', $layerName);
	$new_layer[$layerName]->setMetaData('WMS_SRS', 'epsg:900913 epsg:4326');
	$new_layer[$layerName]->setMetaData('wms_feature_info_mime_type', 'text/xml');
	$new_layer[$layerName]->set("status", MS_ON);	
	$new_layer[$layerName]->set("data", "../php/tmp/tempmonsoon".$datatime.".tif");
	$new_class = ms_newClassObj($new_layer[$layerName]);
	$new_class->set("name", $conf['layerText']);
	$new_class->set("keyimage", "legend/legend-MPE.png");
	$new_layer[$layerName]->set("opacity", 50);	
}

function readKMLfile($sentparams){
	foreach ($sentparams as $key => $layerObj){
		if ($layerObj['group']=="External Data"){
			// $obj = $sentparams[2]['children'];
			$obj = $layerObj['children'];
			foreach ($obj as $k=>$v) {
				if ($v['layertype']=='groundoverlay'){
					$array = array(
						"layername" => $v['layer'],
						"layerText" => $v['text']
					);
				} 
		
			}			
		}
	}	
			
	
	return $array;	
}
?>
