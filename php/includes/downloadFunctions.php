<?php
function readKMLfile($sentparams, $url,$layerName){
	foreach ($sentparams as $key => $layerObj){
		if ($layerObj['group']=="External Data"){
			$obj = $layerObj['children'];
			foreach ($obj as $k=>$v) {
				if (($v['layertype']=='groundoverlay1') && ($v['layer']== $layerName)){			
					$xml=simplexml_load_file($url); 
					$test1 = $xml->GroundOverlay;
					var_dump($test1->name);
					$array = array(
					    "LatLonBox" => $xml->GroundOverlay->LatLonBox
					);
				}
			}			
		}
	}
			

	return $array;	
}

function getlayerConf($sentparams,$layerName){
	foreach ($sentparams as $key => $layerObj){
		if ($layerObj['group']=="External Data"){
			$obj = $layerObj['children'];
			foreach ($obj as $k=>$v) {
				if (($v['layertype']=='groundoverlay1') && $v['layer']== $layerName){	
					$array = array(
						"layername" => $v['layer'],
						"layerText" => $v['text'],
					    "kmzurl" => $v['url']
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
?>