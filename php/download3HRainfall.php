<?php
include 'includes/downloadFunctions.php';

// $sentparams = file_get_contents("../check-nodes.json");
// $sentparams=json_decode($sentparams,true);
// $layerConf = getlayerConf($sentparams,'3hrainfall');
// $filename = 'tmp/'.$layerConf['layername'];
$filename = '3hrainfall';
$fullpath = 'tmp/3hrainfall';

file_put_contents($fullpath."left.png", file_get_contents_curl('http://trmm.gsfc.nasa.gov/trmm_rain/Events/tafd_3hr_rain_dump_google_LEFT.png'));
file_put_contents($fullpath."right.png", file_get_contents_curl('http://trmm.gsfc.nasa.gov/trmm_rain/Events/tafd_3hr_rain_dump_google_RIGHT.png'));

$output = shell_exec("C:\\ms4w\\tools\\gdal-ogr\\gdal_translate -of Gtiff -co tfw=yes -a_ullr 0 60 180 -60 -a_srs EPSG:4326 c:\\ms4w\\apache\\htdocs\\oasisweb\\php\\tmp\\".$filename."left.png c:\\ms4w\\apache\\htdocs\\oasisweb\\php\\tmp\\".$filename."left.tif");
$output = shell_exec("C:\\ms4w\\tools\\gdal-ogr\\gdal_translate -of Gtiff -co tfw=yes -a_ullr -180 60 0 -60 -a_srs EPSG:4326 c:\\ms4w\\apache\\htdocs\\oasisweb\\php\\tmp\\".$filename."right.png c:\\ms4w\\apache\\htdocs\\oasisweb\\php\\tmp\\".$filename."right.tif");

unlink($fullpath."left.png");
unlink($fullpath."right.png");

echo 'done...!';
?>