<?php
include 'configUrl.php';
function file_get_contents_curl($url,$post) {
	$ch = curl_init();
 
	curl_setopt($ch, CURLOPT_HEADER, 0);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); //Set curl to return the data instead of printing it to the browser.
	curl_setopt($ch, CURLOPT_URL, $url);
 	// curl_setopt($ch,CURLOPT_POST,count($fields));
	curl_setopt($ch,CURLOPT_POSTFIELDS,'&filterShape='.$post);
	$data = curl_exec($ch);
	curl_close($ch);
 
	return $data;
}

	require_once ('print.tiles.utility.php');

	session_start();
	$userid = $_SESSION['user'];
	
	set_time_limit(300);//2mn
	ini_set('max_execution_time', 300);
	ini_set('memory_limit', '512M');
	error_reporting(0);  // for production
	ini_set("auto_detect_line_endings", true);

	define('TILE_DIR', 'tmp');
	define('MAX_SIMULTANEOUS_REQUESTS', 20);
	define('MAX_TILES', 500);//Can be whatever dimensions along X and Y axis
	define('CHAR_WIDTH', 7);
	
	$random = rand();
	
	// $activelayer = $_REQUEST["activelayer"];
	// $arr_actLayer = explode(',', $activelayer);
	$arr_actLayer = json_decode($_REQUEST["layerdesc"], true);
	// echo "Jumlah : ".count($arr_actLayer);
		
	//Check if creation or selection mode
	if(isset($_REQUEST['area'])){
		//Creation mode
		//expected format [latA]_[lngA]_[latB]_[lngB]_[zoom]_[map type]

		list($bound_s, $bound_w, $bound_n, $bound_e, $zoom, $map_type) = explode('_',$_REQUEST['area']);
		$map_type = str_replace(" ","_",$map_type);
		$bound_s = (float)$bound_s;
		$bound_n = (float)$bound_n;
		$bound_e = (float)$bound_e;
		$bound_w = (float)$bound_w;
		//Reorder coordinates
		if($bound_w > $bound_e){
			$temp = $bound_w;
			$bound_w = $bound_e;
			$bound_e = $temp;
		}
		if($bound_s > $bound_n){
			$temp = $bound_s;
			$bound_s = $bound_n;
			$bound_n = $temp;
		}
		

		$set_x = 0;
		//$x_Add = 0;
		$y_Add = 0;//0.080;			

		
		//Get extreme tile coordinates 
		$XY_nw = GoogleMapUtility::getTileXY($bound_n, $bound_w, $zoom);
		$XY_se = GoogleMapUtility::getTileXY($bound_s, $bound_e, $zoom);
		
		$im_tile_width = $XY_se->x - $XY_nw->x + 1;
		$im_tile_height = $XY_se->y - $XY_nw->y + 1;
		
		// $xymin = GoogleMapUtility::getTileRect($XY_nw->x,$XY_nw->y,$zoom);
		// $xymax = GoogleMapUtility::getTileRect($XY_se->x,$XY_se->y-($y_Add/2),$zoom);
// 	
		// $xmin = $xymin->x;
		// $xmax = $xymax->x;
		// $ymin = $xymin->y;
		// $ymax = $xymax->y;
// 		
		// if ($xmin > $xmax){
			// $temp = $xmin;
			// $xmin = $xmax;
			// $xmax = $temp;
		// }
// 	
		// if ($ymin > $ymax){
			// $temp = $ymin;
			// $ymin = $ymax;
			// $ymax = $temp;
		// }
// 		
		// $xmin = $xmin;
		// $xmax = $xmax + ($xymax->width);
		// $ymin = $ymin;
		// $ymax = $ymax + ($xymax->height);
// 	
		// $bbox = $xmin.",".$ymin.",".$xmax.",".$ymax;

		
		
		if ($map_type=='Physical' ||$map_type=='Street'||$map_type=='Terrain'||$map_type=='Hybrid'||$map_type=='Satellite') {
			if( ($im_tile_width * $im_tile_height) > MAX_TILES){
				exit('Image too big to process (more than '.MAX_TILES.' tiles)!');
			}
			//Initialize tile structure
			for($xtile = $XY_nw->x; $xtile <= $XY_se->x; ++$xtile){
				for($ytile = $XY_nw->y; $ytile <= $XY_se->y; ++$ytile){
					$url = 'x='.$xtile.'&y='.$ytile.'&z='.$zoom;
					$pathurl = 'x='.$xtile.'&y='.$ytile.'&z='.$zoom.'_'.$random;				
					if(!file_exists(TILE_DIR.'/'.$url)){
						$handles[] = array($url, null, $pathurl);
					}
				}
			}
			//Curl requests
			if(count($handles) > 0){
				$mh = curl_multi_init();
				$header[0] = "Accept: text/xml,application/xml,application/xhtml+xml,";
				$header[0] .= "text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5";
				$header[] = "Cache-Control: max-age=0";
				$header[] = "Connection: keep-alive";
				$header[] = "Keep-Alive: 300";
				$header[] = "Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7";
				$header[] = "Accept-Language: en-us,en;q=0.5";
				$header[] = "Pragma: "; // browsers keep this blank. 
				
				//Set the url template depending on image type
				$url = 'http://mt'.(rand(0,3)).'.google.com/vt/';
				switch($map_type){
					case 'Physical':
						$url .= 'lyrs=p&';
						$format = 'jpg';
						break;
					case 'Street':
						$url .= 'lyrs=m&';
						$format = 'png';
						break;
					case 'Terrain':
						$url .= 'lyrs=t,r&';
						$format = 'jpg';
						break;
					case 'Hybrid':
						$url .= 'lyrs=s,h&';
						$format = 'jpg';
						break;
					case 'Satellite':
						$url .= 'lyrs=s&';
						$format = 'jpg';
						break;
					case 'Map':
					default:
						//nothing
						$format = 'png';
				}
				
				$nb_curl_loop = (int)(count($handles)/MAX_SIMULTANEOUS_REQUESTS) + 1;
				for($cloop = 0; $cloop < $nb_curl_loop; ++$cloop){
					//Request MAX_SIMULTANEOUS_REQUESTS at the same time
					for($offset = 0; $offset < MAX_SIMULTANEOUS_REQUESTS; ++$offset){
						$handle_index = MAX_SIMULTANEOUS_REQUESTS * $cloop + $offset;
						if( $handle_index < count($handles)){
							$ch = curl_init();
							curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11");
							curl_setopt($ch, CURLOPT_HTTPHEADER, $header); 
							curl_setopt($ch, CURLOPT_URL, $url.$handles[$handle_index][0]);
							curl_setopt($ch, CURLOPT_HEADER, 0);
							curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
							curl_setopt($ch, CURLOPT_TIMEOUT, 30);
							curl_multi_add_handle($mh,$ch);
							$handles[$handle_index][1] = $ch;
						}
					}
					
					$running=null;
					do{
						curl_multi_exec($mh,$running);
						usleep (200000);
					} while ($running > 0);
					
					$handle_index = MAX_SIMULTANEOUS_REQUESTS * $cloop;
					//Loop through results and write on FS
					while(isset($handles[$handle_index][1])){
						$out = curl_multi_getcontent($handles[$handle_index][1]);
						if(strlen($out) != 0)
							file_put_contents(TILE_DIR.'/'.$handles[$handle_index][2],$out);//Write on FS
						curl_multi_remove_handle($mh,$handles[$handle_index][1]);
						++$handle_index;
					};
				}
				curl_multi_close($mh);
			}
			//Build final static image by merging tiles
			$im = imagecreatetruecolor($im_tile_width * GoogleMapUtility::TILE_SIZE, $im_tile_height* GoogleMapUtility::TILE_SIZE);
			for($xtile = 0; $xtile < $im_tile_width; ++$xtile){
				for($ytile = 0; $ytile < $im_tile_height; ++$ytile){
					$filepath =TILE_DIR.'/x='.($xtile + $XY_nw->x).'&y='.($ytile+ $XY_nw->y).'&z='.$zoom.'_'.$random;
					switch($format){
						case 'png':
							$im_tile = imagecreatefrompng($filepath);
							break;
						default:
							$im_tile = imagecreatefromjpeg($filepath);
					}
					imagecopy($im, $im_tile, $xtile*GoogleMapUtility::TILE_SIZE, $ytile*GoogleMapUtility::TILE_SIZE, 0, 0, GoogleMapUtility::TILE_SIZE, GoogleMapUtility::TILE_SIZE);
					imagedestroy($im_tile);
					unlink($filepath);//Delete tile
					unset($im_tile);
				}
			}
		} else if ($map_type=='OpenStreetMap' || $map_type=='naqsha'){
			
			$format = 'png';
			if( ($im_tile_width * $im_tile_height) > MAX_TILES){
				exit('Image too big to process (more than '.MAX_TILES.' tiles)!');
			}
			//Initialize tile structure
			for($xtile = $XY_nw->x; $xtile <= $XY_se->x; ++$xtile){
				for($ytile = $XY_nw->y; $ytile <= $XY_se->y; ++$ytile){
					$url = $zoom.'/'.$xtile.'/'.$ytile.'.png';
					$pathurl = $zoom.'&'.$xtile.'&'.$ytile.'_'.$random;	
					
					if(!file_exists(TILE_DIR.'/'.$url)){
						$handles[] = array($url,null,$pathurl);
					}
				}
			}
			//Curl requests
			if(count($handles) > 0){
				$mh = curl_multi_init();
				$header[0] = "Accept: text/xml,application/xml,application/xhtml+xml,";
				$header[0] .= "text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5";
				$header[] = "Cache-Control: max-age=0";
				$header[] = "Connection: keep-alive";
				$header[] = "Keep-Alive: 300";
				$header[] = "Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7";
				$header[] = "Accept-Language: en-us,en;q=0.5";
				$header[] = "Pragma: "; // browsers keep this blank. 
				
				//Set the url template depending on image type
				if ($map_type=='OpenStreetMap'){
					$url = 'http://tile.openstreetmap.org/';
				} else {
					$url = 'http://tiles.naqsha.net/Tiles/';
				}	
		
				$nb_curl_loop = (int)(count($handles)/MAX_SIMULTANEOUS_REQUESTS) + 1;
				for($cloop = 0; $cloop < $nb_curl_loop; ++$cloop){
					//Request MAX_SIMULTANEOUS_REQUESTS at the same time
					for($offset = 0; $offset < MAX_SIMULTANEOUS_REQUESTS; ++$offset){
						$handle_index = MAX_SIMULTANEOUS_REQUESTS * $cloop + $offset;
						if( $handle_index < count($handles)){
							$ch = curl_init();
							curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11");
							curl_setopt($ch, CURLOPT_HTTPHEADER, $header); 
							curl_setopt($ch, CURLOPT_URL, $url.$handles[$handle_index][0]);
							curl_setopt($ch, CURLOPT_HEADER, 0);
							curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
							curl_setopt($ch, CURLOPT_TIMEOUT, 30);
							curl_multi_add_handle($mh,$ch);
							$handles[$handle_index][1] = $ch;
						}
					}
					
					$running=null;
					do{
						curl_multi_exec($mh,$running);
						usleep (200000);
					} while ($running > 0);
					
					$handle_index = MAX_SIMULTANEOUS_REQUESTS * $cloop;
					//Loop through results and write on FS
					while(isset($handles[$handle_index][1])){
						$out = curl_multi_getcontent($handles[$handle_index][1]);
						if(strlen($out) != 0)
							file_put_contents(TILE_DIR.'/'.$handles[$handle_index][2],$out);//Write on FS
						curl_multi_remove_handle($mh,$handles[$handle_index][1]);
						++$handle_index;
					};
				}
				curl_multi_close($mh);
			}
			//Build final static image by merging tiles
			$im = imagecreatetruecolor($im_tile_width * GoogleMapUtility::TILE_SIZE, $im_tile_height* GoogleMapUtility::TILE_SIZE);
			for($xtile = 0; $xtile < $im_tile_width; ++$xtile){
				for($ytile = 0; $ytile < $im_tile_height; ++$ytile){
					$filepath =TILE_DIR.'/'.$zoom.'&'.($xtile + $XY_nw->x).'&'.($ytile+ $XY_nw->y).'_'.$random;
					switch($format){
						case 'png':
							$im_tile = imagecreatefrompng($filepath);
							break;
						default:
							$im_tile = imagecreatefromjpeg($filepath);
					}
					imagecopy($im, $im_tile, $xtile*GoogleMapUtility::TILE_SIZE, $ytile*GoogleMapUtility::TILE_SIZE, 0, 0, GoogleMapUtility::TILE_SIZE, GoogleMapUtility::TILE_SIZE);
					imagedestroy($im_tile);
					unlink($filepath);//Delete tile
					unset($im_tile);
				}
			}
			
		} else if ($map_type=='World_Street_Map' || $map_type=='World_Topo_Map' || $map_type=='World_Imagery'){
			
			$format = 'png';
			if( ($im_tile_width * $im_tile_height) > MAX_TILES){
				exit('Image too big to process (more than '.MAX_TILES.' tiles)!');
			}
			//Initialize tile structure
			for($xtile = $XY_nw->x; $xtile <= $XY_se->x; ++$xtile){
				for($ytile = $XY_nw->y; $ytile <= $XY_se->y; ++$ytile){
					$url = $zoom.'/'.$ytile.'/'.$xtile.'.png';
					$pathurl = $zoom.'&'.$ytile.'&'.$xtile.'_'.$random;		
					
					if(!file_exists(TILE_DIR.'/'.$url)){
						$handles[] = array($url,null,$pathurl);
					}
				}
			}
			//Curl requests
			if(count($handles) > 0){
				$mh = curl_multi_init();
				$header[0] = "Accept: text/xml,application/xml,application/xhtml+xml,";
				$header[0] .= "text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5";
				$header[] = "Cache-Control: max-age=0";
				$header[] = "Connection: keep-alive";
				$header[] = "Keep-Alive: 300";
				$header[] = "Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7";
				$header[] = "Accept-Language: en-us,en;q=0.5";
				$header[] = "Pragma: "; // browsers keep this blank. 
				
				//Set the url template depending on image type
				$url = "http://services.arcgisonline.com/ArcGIS/rest/services/$map_type/MapServer/tile/";
		
				$nb_curl_loop = (int)(count($handles)/MAX_SIMULTANEOUS_REQUESTS) + 1;
				for($cloop = 0; $cloop < $nb_curl_loop; ++$cloop){
					//Request MAX_SIMULTANEOUS_REQUESTS at the same time
					for($offset = 0; $offset < MAX_SIMULTANEOUS_REQUESTS; ++$offset){
						$handle_index = MAX_SIMULTANEOUS_REQUESTS * $cloop + $offset;
						if( $handle_index < count($handles)){
							$ch = curl_init();
							curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11");
							curl_setopt($ch, CURLOPT_HTTPHEADER, $header); 
							curl_setopt($ch, CURLOPT_URL, $url.$handles[$handle_index][0]);
							curl_setopt($ch, CURLOPT_HEADER, 0);
							curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
							curl_setopt($ch, CURLOPT_TIMEOUT, 30);
							curl_multi_add_handle($mh,$ch);
							$handles[$handle_index][1] = $ch;
						}
					}
					
					$running=null;
					do{
						curl_multi_exec($mh,$running);
						usleep (200000);
					} while ($running > 0);
					
					$handle_index = MAX_SIMULTANEOUS_REQUESTS * $cloop;
					//Loop through results and write on FS
					while(isset($handles[$handle_index][1])){
						$out = curl_multi_getcontent($handles[$handle_index][1]);
						if(strlen($out) != 0)
							file_put_contents(TILE_DIR.'/'.$handles[$handle_index][2],$out);//Write on FS
						curl_multi_remove_handle($mh,$handles[$handle_index][1]);
						++$handle_index;
					};
				}
				curl_multi_close($mh);
			}
			//Build final static image by merging tiles
			$im = imagecreatetruecolor($im_tile_width * GoogleMapUtility::TILE_SIZE, $im_tile_height* GoogleMapUtility::TILE_SIZE);
			for($xtile = 0; $xtile < $im_tile_width; ++$xtile){
				for($ytile = 0; $ytile < $im_tile_height; ++$ytile){
					$filepath =TILE_DIR.'/'.$zoom.'&'.($ytile + $XY_nw->y).'&'.($xtile+ $XY_nw->x).'_'.$random;
					switch($format){
						case 'png':
							$im_tile = imagecreatefromjpeg($filepath);
							break;
						default:
							$im_tile = imagecreatefromjpeg($filepath);
					}
					imagecopy($im, $im_tile, $xtile*GoogleMapUtility::TILE_SIZE, $ytile*GoogleMapUtility::TILE_SIZE, 0, 0, GoogleMapUtility::TILE_SIZE, GoogleMapUtility::TILE_SIZE);
					imagedestroy($im_tile);
					unlink($filepath);//Delete tile
					unset($im_tile);
				}
			}			
			
		}	
	}


 ///// ---- download overlay layers tiles

		foreach ($arr_actLayer as $layer) {
					
			$format = 'png';
			$handles = array();
			if( ($im_tile_width * $im_tile_height) > MAX_TILES){
				exit('Image too big to process (more than '.MAX_TILES.' tiles)!');
			}
			//Initialize tile structure
			for($xtile = $XY_nw->x; $xtile <= $XY_se->x; ++$xtile){
				for($ytile = $XY_nw->y; $ytile <= $XY_se->y; ++$ytile){
					
					$tileBound = GoogleMapUtility::getTileRect($xtile,$ytile,$zoom);
					// var_dump($tileBound);
					$xmin = $tileBound->x;
					$xmax = $tileBound->x + $tileBound->width;
					$ymin = $tileBound->y;
					$ymax = $tileBound->y + $tileBound->height;
			
					$bbox = $xmin.",".$ymin.",".$xmax.",".$ymax;
					$url = $zoom.'/'.$ytile.'/'.$xtile.'.png';
					$pathurl = $zoom.'&'.$ytile.'&'.$xtile.'_'.$random;		
					// echo $bbox."<br>";
					if(!file_exists(TILE_DIR.'/'.$pathurl)){
						$handles[] = array($bbox,null,$pathurl);
					}
					
				}
			}	
			
			if(count($handles) > 0){
				$mh = curl_multi_init();
				$header[0] = "Accept: text/xml,application/xml,application/xhtml+xml,";
				$header[0] .= "text/html;q=0.9,text/plain;q=0.8,image/png,*/*;q=0.5";
				$header[] = "Cache-Control: max-age=0";
				$header[] = "Connection: keep-alive";
				$header[] = "Keep-Alive: 300";
				$header[] = "Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7";
				$header[] = "Accept-Language: en-us,en;q=0.5";
				$header[] = "Pragma: "; // browsers keep this blank. 
					
				//Set the url to Ours WMS services
				if ($layer['url'] == ''){
					$url = "$baseUrl/php/getmap.php?LAYERS=";
				} else {
					if (strpos($layer['url'],'?')){
						$url = $layer['url']."&LAYERS=";
					} else {
						$url = $layer['url']."?LAYERS=";
					}	
				}

				$url .= urlencode($layer['name']);
					
				if ($layer['name']=='dataLayer'){
					$legendurl = "$baseUrl/php/getmap.php?FORMAT=image%2Fpng&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic";
					$layeropt = "&LAYER=dataLayer&CLASSITEM=". urlencode($_REQUEST['classitem'])."&MAPQUERY=". urlencode($_REQUEST['mapquery'])."&TABLEITEM=". urlencode($_REQUEST['tableitem']);
					$legend = 'tmp/legend'.$random.'.png';
					file_put_contents($legend, file_get_contents($legendurl.$layeropt));
					$source_leg = imagecreatefrompng($legend);	
					$black = imagecolorallocate($source_leg, 0, 0, 0);	
					imagecolortransparent($source_leg, $black);
					unlink($legend);//Delete file
					imagepng($source_leg, TILE_DIR.'/legend'.$random.'.png');
				}
					
				if ($_REQUEST['filterShape']!='' && $layer['url']==''){
					$url .= ",cosmetics";
					// $url .= "cosmetics";
				}
							

				if ($layer['sld']!=''){
					$url .= $layeropt."&SLD=".$layer['sld']."&userid=".$userid."&sentJSON=".urlencode($_REQUEST['sentJSON'])."&GEORSSURL=".$_REQUEST['georssUrl']."&KMLURL=".$_REQUEST['kmlUrl']."&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&EXCEPTIONS=application%2Fvnd.ogc.se_inimage&FORMAT=image%2Fpng&TRANSPARENT=true&SRS=EPSG%3A4326&WIDTH=".GoogleMapUtility::TILE_SIZE."&HEIGHT=".GoogleMapUtility::TILE_SIZE."&BBOX=";	
				} else {
					$url .= $layeropt."&userid=".$userid."&sentJSON=".urlencode($_REQUEST['sentJSON'])."&GEORSSURL=".$_REQUEST['georssUrl']."&KMLURL=".$_REQUEST['kmlUrl']."&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&STYLES=&EXCEPTIONS=application%2Fvnd.ogc.se_inimage&FORMAT=image%2Fpng&TRANSPARENT=true&SRS=EPSG%3A4326&WIDTH=".GoogleMapUtility::TILE_SIZE."&HEIGHT=".GoogleMapUtility::TILE_SIZE."&BBOX=";
				}
				
				$nb_curl_loop = (int)(count($handles)/MAX_SIMULTANEOUS_REQUESTS) + 1;
				for($cloop = 0; $cloop < $nb_curl_loop; ++$cloop){
					//Request MAX_SIMULTANEOUS_REQUESTS at the same time
					for($offset = 0; $offset < MAX_SIMULTANEOUS_REQUESTS; ++$offset){
						$handle_index = MAX_SIMULTANEOUS_REQUESTS * $cloop + $offset;
						if( $handle_index < count($handles)){
							$ch = curl_init();
							curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US; rv:1.8.1.11) Gecko/20071127 Firefox/2.0.0.11");
							curl_setopt($ch, CURLOPT_HTTPHEADER, $header); 
							curl_setopt($ch, CURLOPT_URL, $url.$handles[$handle_index][0]);
							curl_setopt($ch, CURLOPT_POSTFIELDS,'&filterShape='.$_REQUEST['filterShape']);
							curl_setopt($ch, CURLOPT_HEADER, 0);
							curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
							curl_setopt($ch, CURLOPT_TIMEOUT, 30);
							curl_multi_add_handle($mh,$ch);
							$handles[$handle_index][1] = $ch;
							// echo $url.$handles[$handle_index][0]."<BR>";
						}
					}

					$running=null;
					do{
						curl_multi_exec($mh,$running);
						usleep (200000);
					} while ($running > 0);
					
					$handle_index = MAX_SIMULTANEOUS_REQUESTS * $cloop;
					//Loop through results and write on FS
					while(isset($handles[$handle_index][1])){
						$out = curl_multi_getcontent($handles[$handle_index][1]);
						if(strlen($out) != 0)
							file_put_contents(TILE_DIR.'/'.$handles[$handle_index][2],$out);//Write on FS
						curl_multi_remove_handle($mh,$handles[$handle_index][1]);
						++$handle_index;
					};
				}
				curl_multi_close($mh);
			}	
	
				// $im = imagecreatetruecolor($im_tile_width * GoogleMapUtility::TILE_SIZE, $im_tile_height* GoogleMapUtility::TILE_SIZE);
				for($xtile = 0; $xtile < $im_tile_width; ++$xtile){
					for($ytile = 0; $ytile < $im_tile_height; ++$ytile){
						$filepath =TILE_DIR.'/'.$zoom.'&'.($ytile + $XY_nw->y).'&'.($xtile+ $XY_nw->x).'_'.$random;
						switch($format){
							case 'png':
								$im_tile = imagecreatefrompng($filepath);								
								imagesavealpha($im_tile, true);
								imagealphablending($im_tile, true); 
								// imagepng($im_tile, TILE_DIR.'/test1.png');
								if (strpos($layer['url'],'?')){
									list($width, $height) = getimagesize($filepath);
									$thumb = imagecreatetruecolor(256, 256);
									$col=imagecolorallocatealpha($thumb,255,255,255,0);
									imagefill($thumb, 0, 0, $col);
									imagecopyresized($thumb, $im_tile, 0, 0, 0, 0, 256, 256, $width, $height);									
									// imagecopyresampled($thumb, $im_tile, 0, 0, 0, 0, 256, 256, $width, $height);
									// imagepng($thumb, TILE_DIR.'/test2.png');									
									$im_tile = $thumb;
								}
								break;
							default:
								$im_tile = imagecreatefromjpeg($filepath);
						}
						$black = imagecolorallocate($im_tile, 0, 0, 0);
						$white = imagecolorallocate($im_tile, 255, 255, 255);
						
						if ($layer['url'] == ''){
							imagecolortransparent($im_tile,$black);
							imagecopy($im, $im_tile, $xtile*GoogleMapUtility::TILE_SIZE, $ytile*GoogleMapUtility::TILE_SIZE, 0, 0, GoogleMapUtility::TILE_SIZE, GoogleMapUtility::TILE_SIZE);					
						} else {
							if (strpos($layer['url'],'?')){
								imagecolortransparent($im_tile,$black);
								imagecolortransparent($im_tile,$white);
								// imagecopy($im, $im_tile, $xtile*GoogleMapUtility::TILE_SIZE, $ytile*GoogleMapUtility::TILE_SIZE, 0, 0, GoogleMapUtility::TILE_SIZE, GoogleMapUtility::TILE_SIZE);
								imagecopymerge($im, $im_tile, $xtile*GoogleMapUtility::TILE_SIZE, $ytile*GoogleMapUtility::TILE_SIZE, 0, 0, GoogleMapUtility::TILE_SIZE, GoogleMapUtility::TILE_SIZE,$layer['opacity']*100);
							    // imagepng($im_tile, TILE_DIR.'/test1.png');
							} else {
								imagecolortransparent($im_tile);
								imagecopymerge($im, $im_tile, $xtile*GoogleMapUtility::TILE_SIZE, $ytile*GoogleMapUtility::TILE_SIZE, 0, 0, GoogleMapUtility::TILE_SIZE, GoogleMapUtility::TILE_SIZE,$layer['opacity']*100);
							}	
						}
						
						imagedestroy($im_tile);
						unlink($filepath);//Delete tile
						unset($im_tile);
						
					}
				}
		}

 //// end of overlays layer tiles downloading codes

	
	imagejpeg($im, TILE_DIR.'/global'.$random.'.jpg');	
	imagedestroy($im);
	unset($im);
	//No need to enter the selection mode

	$in_filename = TILE_DIR.'/global'.$random.'.jpg';
	list($in_width, $in_height) = getimagesize($in_filename);
		
	if ($_REQUEST['orientation']=='A4 Portrait'){
		$new_height = 1460;	
		$new_width = 1024;	
		$offset_x = ($in_width/2)-($new_width/2);
		$offset_y = ($in_height/2)-($new_height/2);				
	} else if ($_REQUEST['orientation']=='A4 Landscape'){
		$new_height = 1024;	
		$new_width = 1460;			
		$offset_x = ($in_width/2)-($new_width/2);
		$offset_y = ($in_height/2)-($new_height/2);	
	} else if ($_REQUEST['orientation']=='A3 Portrait'){
		$new_height = 2080;	
		$new_width = 1460;		
		$offset_x = ($in_width/2)-($new_width/2);
		$offset_y = ($in_height/2)-($new_height/2);			
	} else if ($_REQUEST['orientation']=='A3 Landscape'){
		$new_height = 1460;	
		$new_width = 2080;	
		$offset_x = ($in_width/2)-($new_width/2);
		$offset_y = ($in_height/2)-($new_height/2);				
	}	
	
	
	$image = imagecreatefromjpeg($in_filename);
	$new_image = imagecreatetruecolor($new_width, $new_height);
	imagecopy($new_image, $image, 0, 0, $offset_x, $offset_y, $in_width, $in_height);
	
	unlink($in_filename);//Delete file
	
	
	imagejpeg($new_image, TILE_DIR.'/global'.$random.'.jpg');
	echo $random.';'.$map_type.';'.$bbox.';'.$bound_s.';'.$bound_e.';'.$in_width.';'.$in_height;
?>


