<?php
include 'includes/downloadFunctions.php';

$sentparams = file_get_contents("../check-nodes.json");
$sentparams=json_decode($sentparams,true);
$layerConf = getlayerConf($sentparams,'flooded1');
$filename = 'tmp/'.$layerConf['layername'];

$dayNum = date("z", mktime(0,0,0,date('m'),date('d'),date('Y')))+1;

if (strlen($dayNum)==1){
	$dayNum = '00'.$dayNum;
} else if (strlen($dayNum)==2){
	$dayNum = '0'.$dayNum;
}

$yearNum=date('Y');
$layerConf['kmzurl'] = str_replace('2012268',$yearNum.$dayNum,$layerConf['kmzurl']);

file_put_contents($filename.".kmz", file_get_contents_curl($layerConf['kmzurl']));
rename($filename.".kmz",$filename.".zip");
 	 $zip = new ZipArchive;
     $res = $zip->open($filename.".zip");
     if ($res === TRUE) {
         $zip->extractTo("tmp/");
         $zip->close();
         // echo "ok";
     } else {
         // echo "failed";
     }

$output = shell_exec("C:\\ms4w\\tools\\gdal-ogr\\gdal_translate -of Gtiff -co tfw=yes -a_ullr 60.002900 38.003900 78.002900 23.001000 -a_srs EPSG:4326 c:\\ms4w\\apache\\htdocs\\oasisweb\\php\\tmp\\Pakistan.".$yearNum.$dayNum.".terra.ndvi.250m.jpg c:\\ms4w\\apache\\htdocs\\oasisweb\\php\\tmp\\".$layerConf['layername'].".tif");		 
unlink("tmp/Pakistan.".$yearNum.$dayNum.".terra.ndvi.250m.jpg");
unlink("tmp/Pakistan.".$yearNum.$dayNum.".terra.ndvi.250m.kml");
unlink("tmp/".$layerConf['layername'].".zip");
?>