<?php
function readKMLfile($sentparams){
	foreach ($sentparams as $key => $layerObj){
		if ($layerObj['group']=="External Data"){
			$obj = $layerObj['children'];
			foreach ($obj as $k=>$v) {
				if ($v['layertype']=='groundoverlay'){
					
					$xml=simplexml_load_file($v['url']); 
					$array = array(
						"layername" => $v['layer'],
						"layerText" => $v['text'],
					    "imageurl" => $xml->GroundOverlay->Icon->href,
					    "LatLonBox" => $xml->GroundOverlay->LatLonBox
					);
					// echo $array['LatLonBox']->north;
				}
			}			
		}
	}		

	return $array;	
}

function file_get_contents_curl($url) {
	$ch = curl_init();
 
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); //Set curl to return the data instead of printing it to the browser.
	curl_setopt($ch, CURLOPT_URL, $url);
	$data = curl_exec($ch);
	curl_close($ch);
 
	return $data;
}


$sentparams = file_get_contents("../check-nodes.json");
$sentparams=json_decode($sentparams,true);



	$filename = 'tmp/tempmonsoon';
	// $coord = explode(',',$_REQUEST['TEMPBOUNDS']);
	if (file_exists($filename.".tif")) {
	    $filetime	 = filemtime($filename.".png");
		$timedifftemp = time()-$filetime;
		$timediff = $timedifftemp/60;
		$conf = readKMLfile($sentparams);
		$layerName = $conf['layername'];
		if ($timediff>30){
			
			// echo ">30 menint";
			file_put_contents($filename.".png", file_get_contents_curl($conf['imageurl']));
			$output = shell_exec("C:\\ms4w\\tools\\gdal-ogr\\gdal_translate -of Gtiff -co tfw=yes -a_ullr ".$conf['LatLonBox']->west." ".$conf['LatLonBox']->north." ".$conf['LatLonBox']->east." ".$conf['LatLonBox']->south." -a_srs EPSG:4326 c:\\ms4w\\apache\\htdocs\\oasisweb\\php\\$filename.png c:\\ms4w\\apache\\htdocs\\oasisweb\\php\\$filename.tif");
			// unlink($filename.".png");						
		}	
	} else {
		// echo "tidak ada data";
		$conf = readKMLfile($sentparams);
		$layerName = $conf['layername'];
		file_put_contents($filename.".png", file_get_contents_curl($conf['imageurl']));
		$output = shell_exec("C:\\ms4w\\tools\\gdal-ogr\\gdal_translate -of Gtiff -co tfw=yes -a_ullr ".$conf['LatLonBox']->west." ".$conf['LatLonBox']->north." ".$conf['LatLonBox']->east." ".$conf['LatLonBox']->south." -a_srs EPSG:4326 c:\\ms4w\\apache\\htdocs\\oasisweb\\php\\$filename.png c:\\ms4w\\apache\\htdocs\\oasisweb\\php\\$filename.tif");
		// unlink($filename.".png");
		$layerName = $conf['layername'];
	}
	
	if (file_exists($filename."360.tif")){
		unlink($filename."360.tif");
		unlink($filename."360.tfw");
	}
	
	if (file_exists($filename."330.tif")){
		rename($filename."330.tif",$filename."360.tif");
		rename($filename."330.tfw",$filename."360.tfw");
	}
	
	if (file_exists($filename."300.tif")){
		rename($filename."300.tif",$filename."330.tif");
		rename($filename."300.tfw",$filename."330.tfw");
	}
	
	if (file_exists($filename."270.tif")){
		rename($filename."270.tif",$filename."300.tif");
		rename($filename."270.tfw",$filename."300.tfw");
	}
	
	if (file_exists($filename."240.tif")){
		rename($filename."240.tif",$filename."270.tif");
		rename($filename."240.tfw",$filename."270.tfw");
	}
	
	if (file_exists($filename."210.tif")){
		rename($filename."210.tif",$filename."240.tif");
		rename($filename."210.tfw",$filename."240.tfw");
	}
	
	if (file_exists($filename."180.tif")){
		rename($filename."180.tif",$filename."210.tif");
		rename($filename."180.tfw",$filename."210.tfw");
	}
	
	if (file_exists($filename."150.tif")){
		rename($filename."150.tif",$filename."180.tif");
		rename($filename."150.tfw",$filename."180.tfw");
	}
	
	if (file_exists($filename."120.tif")){
		rename($filename."120.tif",$filename."150.tif");
		rename($filename."120.tfw",$filename."150.tfw");
	}
	
	if (file_exists($filename."090.tif")){
		rename($filename."090.tif",$filename."120.tif");
		rename($filename."090.tfw",$filename."120.tfw");
	}
	
	if (file_exists($filename."060.tif")){
		rename($filename."060.tif",$filename."090.tif");
		rename($filename."060.tfw",$filename."090.tfw");
	}
	
	if (file_exists($filename."030.tif")){
		rename($filename."030.tif",$filename."060.tif");
		rename($filename."030.tfw",$filename."060.tfw");
	}
	
	rename($filename.".tif",$filename."030.tif");
	rename($filename.".tfw",$filename."030.tfw");
?>