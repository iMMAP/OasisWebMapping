<?php
// $doc = new DOMDocument();
include 'configUrl.php';
session_start();
$userid = $_SESSION['user']; 
$layer = $_REQUEST['layer'];
$url = "$baseUrl/php/getmap.php?userid=$userid&TYPENAME=$layer&SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&SRS=EPSG%3A900913&EXCEPTIONS=application%2Fvnd.ogc.se_xml&INFO_FORMAT=text%2Fplain&QUERY_LAYERS=$layer&MAXFEATUREs=1&FILTER=%3Cogc%3AFilter%3E%3CIntersects%3E%3Cogc%3APropertyName%3Egeom%3C%2Fogc%3APropertyName%3E%3Cgml%3APolygon%20srsName%3D%22EPSG%3A900913%22%3E%3Cgml%3AouterBoundaryIs%3E%3Cgml%3ALinearRing%3E%3Cgml%3Acoordinates%20decimal%3D%22.%22%20cs%3D%22%2C%22%20ts%3D%22%20%22%3E8885692.961927129%2C-5782685.00546853%2010435555.643207734%2C-5537210.872114015%2011927936.32829958%2C-5052306.993250118%2013326087.65180817%2C-4339913.311678172%2014595582.487950517%2C-3417571.32413756%2015705161.66064899%2C-2307992.1514390875%2016627503.648189602%2C-1038497.3152967381%2017339897.32976155%2C359654.0082118522%2017824801.208625447%2C1852034.6933036959%2018070275.341979966%2C3401897.3745843%2018070275.341979966%2C4971079.2891412%2017824801.20862545%2C6520941.970421802%2017339897.32976155%2C8013322.655513648%2016627503.648189602%2C9411473.979022244%2015705161.66064899%2C10680968.815164592%2014595582.487950517%2C11790547.987863066%2013326087.65180817%2C12712889.975403678%2011927936.32829958%2C13425283.656975623%2010435555.643207734%2C13910187.53583952%208885692.961927129%2C14155661.669194035%207316511.047370227%2C14155661.669194035%205766648.3660896225%2C13910187.535839524%204274267.680997782%2C13425283.656975627%202876116.3574891863%2C12712889.975403678%201606621.52134684%2C11790547.987863068%20497042.3486483654%2C10680968.815164594%20-425299.63889224775%2C9411473.979022246%20-1137693.3204641931%2C8013322.65551365%20-1622597.1993280905%2C6520941.970421806%20-1868071.332682605%2C4971079.289141201%20-1868071.332682605%2C3401897.3745843014%20-1622597.1993280924%2C1852034.6933036973%20-1137693.3204641931%2C359654.0082118536%20-425299.63889224775%2C-1038497.3152967371%20497042.3486483645%2C-2307992.1514390856%201606621.5213468345%2C-3417571.3241375564%202876116.357489188%2C-4339913.311678174%204274267.680997771%2C-5052306.993250114%205766648.366089624%2C-5537210.872114017%207316511.047370221%2C-5782685.00546853%208885692.961927129%2C-5782685.00546853%3C%2Fgml%3Acoordinates%3E%3C%2Fgml%3ALinearRing%3E%3C%2Fgml%3AouterBoundaryIs%3E%3C%2Fgml%3APolygon%3E%3C%2FIntersects%3E%3C%2Fogc%3AFilter%3E"; 

$res_arr = Array();
	$content = @file_get_contents($url);
	if ($content != FALSE) {
		$xml = new SimpleXmlElement($content);
		$fields = $xml->children('gml', TRUE)->featureMember->children('ms', TRUE)->$layer->children('ms', TRUE);
		//var_dump($fields);
		foreach ($fields as $key => $value){
			//$res_arr[]=Array("text"=>$key, "id"=>$key, "leaf"=>TRUE, "cls"=>"file");
			$res_arr[]=Array("text"=>$key);
			//echo $value;
		}
	}
	$arr_value = array(
			'success' => true,
			'data' => $res_arr
	);		
	echo json_encode($arr_value);
?>