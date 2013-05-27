<?php
include 'configUrl.php';
session_start();
$userid = $_SESSION['user'];
ini_set('memory_limit', '256M');
ini_set('max_execution_time', 120);
require_once("../lib/dompdf/dompdf_config.inc.php");
$activelayer = $_REQUEST["activelayer"];
// $arr_actLayer = explode(',', $activelayer);
$arr_actLayer = json_decode($activelayer);
$fullUrl = $_REQUEST["sentUrl"];
// $fullUrl = json_decode($fullUrl);

$arrUrl = parse_url($fullUrl);
parse_str($arrUrl['query'], $querystr);
$filter = $querystr['FILTER'];

$filter = urlencode($filter);

// var_dump(json_decode($_REQUEST["filterSent"]));



	$html ='
	<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-15">
		<link rel="stylesheet" type="text/css" href="../css/pdfreport.css">
	  </head>
	  <body>
	  <script type="text/php">
		if ( isset($pdf) ) 
		{
			// Open the object: all drawing commands will
			// go to the object instead of the current page
			$footer = $pdf->open_object();
	
			$w = $pdf->get_width();
			$h = $pdf->get_height();
	
			// Draw a line along the bottom
			$y = $h - $text_height - 40;
			///$pdf->line(30, $y, $w - 32, $y, $color, 1);
	
			// Add a logo
			///$pdf->image("../print/dompdf/wfp.jpg", "jpg", $w - 132, 7, 125, 61);
			
			$text = "Page {PAGE_NUM} of {PAGE_COUNT}"; 
			// Center the text
			//$font = Font_Metrics::get_font("verdana");
			///$size = 8;
			///$width = Font_Metrics::get_text_width("Page 1 of 2", $font, $size);
			///$pdf->page_text($w / 2 - $width / 2, $y, $text, $font, $size, $color);
			
			// Close the object (stop capture)
			$pdf->close_object();
	
			// Add the object to every page. You can
			// also specify "odd" or "even"
			$pdf->add_object($footer, "all");
		  
		}
		</script>';
		
		$html .='<table class="detail" style="border-top: 1px; margin: 0px 0px 1.5em 0px;">
		<tr>
		<td class="label" style="width: 8.25%">Layer:</td>
		<td class="field" style="width: 16.5%">Population Estimates</td>
		</tr>
		
		</table>';		

$html .=
	'<table class="detail" style="margin: 0px; border-top: none;">';
	
$popAll = $_REQUEST['popData'];	
$popPart = explode(";", $popAll);


foreach ($popPart as $popDesc) {
	$popDet = explode(":", $popDesc);
	$html .=
	'<tr>
	<td class="label">'.$popDet[0].'</td>
	<td class="field">'.$popDet[1].'</td>
	</tr>';
}


$html .= '</table><br><br>';
$pertama = true;
if ($activelayer != ''){
	foreach ($arr_actLayer as $layer) {
		$url = "$baseUrl/php/getmap.php?LAYERS=$layer->name&TYPENAME=$layer->name&SERVICE=WFS&VERSION=1.0.0&REQUEST=GetFeature&SRS=EPSG%3A900913&EXCEPTIONS=application%2Fvnd.ogc.se_xml&INFO_FORMAT=text%2Fplain&QUERY_LAYERS=$layer->name&FEATURE_COUNT=10&FILTER=$filter&userid=$userid&GEORSSURL=".$_REQUEST['georssUrl']."&KMLURL=".$_REQUEST['kmlUrl'];
		if (!$pertama){
			$html .='<div style="page-break-before: always;"></div>';
		}
		$html .='<table class="detail" style="border-top: none; margin: 0px 0px 1.5em 0px;">
		<tr>
		<td class="label" style="width: 8.25%">Layer:</td>
		<td class="field" style="width: 16.5%">'.$layer->text.'</td>
		</tr>
		
		</table>';


		$html .='
		<table class="list" style="width: 99%; margin-top: 1em;">
		
		<tr class="head">';
		
		$layerName = $layer->name;
		$content = @file_get_contents($url);
		$res_arr = Array();
		$data_arr = Array();
		if ($content != FALSE) {
			$xml = new SimpleXmlElement($content);
			if ($xml->children('gml', TRUE)->featureMember){
				$fields = $xml->children('gml', TRUE)->featureMember->children('ms', TRUE)->$layerName->children('ms', TRUE);
				// var_dump($fields);
				foreach ($fields as $key => $value){	
					if ($key != 'geom')
						// echo $key." : ".$value."<br>";
						$res_arr[]=Array("column"=>$key, "value"=>$value);
				}
				// $records = $xml->children('gml', TRUE)->featureMember;
				foreach ($xml->children('gml', TRUE)->featureMember as $key => $value){
					$temp_array = Array();
					foreach ($value->children('ms', TRUE)->$layerName->children('ms', TRUE) as $x => $datavalue){	
						if ($x != 'geom')
							// echo $x." : ".$datavalue."<br>";
							$temp_array[]=Array("column"=>$x, "value"=>$datavalue);
					}
					$data_arr[]=$temp_array;
				}
			}
			// var_dump($data_arr);
		}
		
		foreach ($res_arr as $key => $value){
			// var_dump($value);
			$html .= '<td class="center" style="width: 10%">'.$value['column'].'</td>';
		}	
		$html .='</tr>';
		// var_dump($data_arr);
		// isi data
			foreach ($data_arr as $key => $value){
			$html .='<tr class="list_row">';
				foreach ($value as $key1 => $value1){
					// // var_dump($value);
					$html .='<td class="center" style="width: 10%">'.$value1['value'].'</td>';
				}
			$html .='</tr>';
			}
		
		$html .='

		
		
		</table>';
		$pertama = false;
		
	}
}		





	$html .=
	'</body>
</html>';
	$pdfmap = trim($_REQUEST["filename"]);

	//Create PDF string from HTML
	$dompdf = new DOMPDF();
	$dompdf->load_html($html);
	$dompdf->set_paper('A4', 'landscape');
	
	
	$dompdf->render();
	$pdf = $dompdf->output();
	
	$timeStamp = time();
	$date = date('Y-m-d');
	$filename_stat =  "temp_gp_report_$date_$timeStamp.pdf";
	file_put_contents('tmp/'.$filename_stat, $pdf);
	$destDoc = "tmp/gp_report_$date_$timeStamp.pdf";
	$filename = "gp_report_$date_$timeStamp.pdf";
	
	//echo $pdfmap;
	$firstDoc = "tmp/$filename_stat";
	$secondDoc= "tmp/$pdfmap";
	//$exec_cmd = "pdftk tmp/temp_gp_report_1292573426.pdf tmp/$pdfmap cat output tmp/gp_report_1292573426.pdf";
	$exec_cmd = "pdftk $firstDoc $secondDoc cat output $destDoc";
		
	exec($exec_cmd, $output, $error);

	unlink($secondDoc);//Delete file
	unlink($firstDoc);//Delete file	
	
	if ($error) echo ("OS Error: $error.<br />\n");
	echo implode("<br />", $output);
	
	header('Content-type: application/pdf');
	//header("Content-Length: " . strlen($pdf));
	header('Content-Disposition: attachment; filename="ResourceReport'.$date.'.pdf"');
	$pdf = readfile($destDoc);
	
	unlink($destDoc);//Delete file	
	print($pdf);
	
	// //Send PDF as attachment (requires iframe at client)
	// header('Content-type: application/pdf');
	// header("Content-Length: " . strlen($pdf));
	// header('Content-Disposition: attachment; filename=gp_'.$map_type.'_'.date('Y-m-d').'.pdf');
	// print($pdf);
	
unset($dompdf)		
?>