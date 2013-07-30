<?php
include 'configUrl.php';
error_reporting(0);
session_start();
$userid = $_SESSION['user'];
	
$arr = array(); 

ini_set('memory_limit', '64M');
require_once("../lib/dompdf/dompdf_config.inc.php");
$activelayer = $_REQUEST["activelayer"];
// $arr_actLayer = explode(',', $activelayer);
$arr_actLayer = json_decode($activelayer);
$orientation = $_REQUEST["orientation"];

$temp_array = explode(';', $_REQUEST['random']);

$random = trim($temp_array[0]);
$map_type = $temp_array[1];
$bbox = $temp_array[2];


if ($map_type=='Physical' ||$map_type=='Street'||$map_type=='Terrain'||$map_type=='Hybrid'||$map_type=='Satellite') {
	$base_map_source = 'Google '.$map_type;
} else if ($map_type=='OpenStreetMap'){
	$base_map_source = $map_type;
} else if ($map_type=='naqsha'){
	$base_map_source = 'Naqsha.net';
} else {
	$base_map_source = 'ArcGIS data';
}

$bbox_array = explode(',', $bbox);
$bbox =  $bbox_array[0]." ".$bbox_array[1].",".$bbox_array[2]." ".$bbox_array[3];

	$html ='
	<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-15">
		<link rel="stylesheet" type="text/css" href="../css/SDIT.pdfPrint.css">
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
//}	
//// put information here
	$html .=
	'
	<div style="position:relative">
	<div id="left" style="position: absolute;left: 0px;"><table>
  <tr>
    <td valign="top">';
 	$filename = "tmp/global$random.jpg";
	if ($orientation=='A4 Portrait'){
		$html .= '<img src="'.$filename.'" class="mapTable"/>';
	} else if ($orientation=='A4 Landscape'){
		$html .= '<img src="'.$filename.'" class="mapTable"/>';
	} else if ($orientation=='A3 Portrait'){
		$html .= '<img src="'.$filename.'" class="mapTable"/>';
	} else if ($orientation=='A3 Landscape'){
		$html .= '<img src="'.$filename.'" class="mapTable"/>';
	}   
    
	$html .='</td></tr>';
//----

	$html .=
	'</table></div>';


//// end action

	
	$comments = str_replace('%u200B','',urldecode($_REQUEST['comments']));
	if ($orientation=='A4 Portrait'){
		$html .= '<div id="right" style="position: absolute; left: 412px; top:3; width: 200px;">';
		$html_Add = '<div id="north" style="position: absolute;left: 10px;top: 955px;">
		<table width="100px" border="0" cellspacing="0" class="northTable">
		<tr><td align="center"><img src="../image/NorthNavigator.gif" width="100" height="100"/></td></tr>
		<tr><td align="center"><b>1 : '.number_format($_REQUEST['scale'], 0, '.', ',').'</b></td></tr>';
		$html_Add_comment = '<div id="comment" style="position: absolute;left: 120px;top: 955px;">
		<table width="400px" border="0" cellspacing="0" class="commentTable">
		<tr><td align="left"><b>Comments : </b><br>'.$comments.'</td></tr>';
	} else if ($orientation=='A4 Landscape'){
		$html .= '<div id="right" style="position: absolute; left: 739px; top:3; width: 200px;">';
		$html_Add = '<div id="north" style="position: absolute;left: 10px;top: 628px;">
		<table width="100px" border="0" cellspacing="0" class="northTable">
		<tr><td align="center"><img src="../image/NorthNavigator.gif" width="100" height="100"/></td></tr>
		<tr><td align="center"><b>1 : '.number_format($_REQUEST['scale'], 0, '.', ',').'</b></td></tr>';
		$html_Add_comment = '<div id="comment" style="position: absolute;left: 120px;top: 628px;">
		<table width="400px" border="0" cellspacing="0" class="commentTable">
		<tr><td align="left"><b>Comments : </b><br>'.$comments.'</td></tr>';		
	} else if ($orientation=='A3 Portrait'){
		$html .= '<div id="right" style="position: absolute; left: 739px; top:3; width: 200px;">';
		$html_Add = '<div id="north" style="position: absolute;left: 10px;top: 1420px;">
		<table width="100px" border="0" cellspacing="0" class="northTable" width="100px">
		<tr><td align="center"><img src="../image/NorthNavigator.gif" width="100" height="100"/></td></tr>
		<tr><td align="center"><b>1 : '.number_format($_REQUEST['scale'], 0, '.', ',').'</b></td></tr>';	
		$html_Add_comment = '<div id="comment" style="position: absolute;left: 120px;top: 1420px;">
		<table width="400px" border="0" cellspacing="0" class="commentTable">
		<tr><td align="left"><b>Comments : </b><br>'.$comments.'</td></tr>';	
	} else if ($orientation=='A3 Landscape'){
		$html .= '<div id="right" style="position: absolute; left: 1204px; top:3; width: 200px;">';
		$html_Add = '<div id="north" style="position: absolute;left: 10px;top: 955px;">
		<table width="100px" border="0" cellspacing="0" class="northTable" width="100px">
		<tr><td align="center"><img src="../image/NorthNavigator.gif" width="100" height="100"/></td></tr>
		<tr><td align="center"><b>1 : '.number_format($_REQUEST['scale'], 0, '.', ',').'</b></td></tr>';
		$html_Add_comment = '<div id="comment" style="position: absolute;left: 120px;top: 955px;">
		<table width="400px" border="0" cellspacing="0" class="commentTable">
		<tr><td align="left"><b>Comments : </b><br>'.$comments.'</td></tr>';		
	}   
		

	$html .= '<table width="360px" border="0" cellspacing="0" class="mapDataTable">';
	$html .= '<tr><td colspan="6"><img src="../image/logo.png" height="60"></td></tr>';	
	
	// if ($activelayer != ''){ $html .= '<tr><td colspan="6"><h2>Legend</h2></td></tr>';}
	foreach ($arr_actLayer as $layer){
		$selLayer = $layer->name;
		$addUrls = $layer->url;
		if (substr($selLayer, 0, 17)=='gpw-v3-population'){
			$legendurl = "http://sedac.ciesin.columbia.edu/geoserver/wms?width=15&height=15&legend_options=border:false;mx:0.05;my:0.02;dx:0.2;dy:0.07;fontSize:11;bandInfo:false;&FORMAT=image%2Fpng&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=$selLayer&LAYERS=$selLayer";
		} else if ($selLayer=='clouds'){
			$legendurl = "http://openweathermap.org/img/a/NT.png"; 	
		} else if ($selLayer=='precipitation'){
			$legendurl = "http://openweathermap.org/img/a/PR.png";
		} else if ($selLayer=='pressure'){
			$legendurl = "http://openweathermap.org/img/a/PN.png";	
		} else if ($selLayer=='wind'){
			$legendurl = "http://openweathermap.org/img/a/UV.png";			
		} else if ($selLayer=='temp'){
			$legendurl = "http://openweathermap.org/img/a/TT.png";	
		} else if ($selLayer=='snow'){
			$legendurl = "http://openweathermap.org/img/a/SN.png";	
		} else {
			if ($addUrls == ''){
				$legendurl = "$baseUrl/php/getmap.php?FORMAT=image%2Fpng&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=$selLayer&LAYERS=$selLayer&userid=$userid";
			} else {
				if (strpos($layer->url,'?')){
					$legendurl = "$addUrls&request=GetLegend&layer=$selLayer&layers=$selLayer";
				} else {
					$legendurl = "$addUrls?width=15&height=15&legend_options=border:false;mx:0.05;my:0.02;dx:0.2;dy:0.07;fontSize:11;bandInfo:false;&FORMAT=image%2Fpng&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYER=$selLayer&LAYERS=$selLayer";
				}	
			}	
		}
		// $legendurl = "http://localhost/oasisweb/php/getmap.php?FORMAT=image%2Fpng&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic&LAYERS=$layer&userid=$userid";
		if ($selLayer!='dataLayer') {
			if ($selLayer!='clouds' && $selLayer!='precipitation' && $selLayer!='pressure' && $selLayer!='wind' && $selLayer!='temp' && $selLayer!='snow')	{
				$legendurl .=  "&LAYER=$selLayer";
				if ($layer->sld != '') $legendurl .= "&SLD=".$layer->sld;
			}
			
			if ($selLayer!='flood2' && $selLayer!='3hrainfallleft' && $selLayer!='3hrainfallright' ){
				$html .= "<tr><td colspan='6'>$layer->text</td></tr>";
				$html .= "<tr><td colspan='6' valign='top' align='left'><img src='$legendurl'></td></tr>";
			} else if ($selLayer=='3hrainfallleft' || $selLayer=='3hrainfallright'){
				$html .= "<tr><td colspan='6' valign='top' align='left'><img src='http://trmm.gsfc.nasa.gov/trmm_rain/Events/tafd_3hr_rain_dump_google_wedge.png' height=60px></td></tr>";
			} else {
				$html .= "<tr><td colspan='6' valign='top' align='left'><img src='../mapfile/legend/legend-MPE.png' width=193px></td></tr>";	
			}	
		} else {
			$html .= "<tr><td colspan='6'>$layer->text</td></tr>";
			$html .= "<tr><td colspan='6' valign='top' align='left'><img src='tmp/legend$random.png'></td></tr>";
		}	
		

	}					

///---http://localhost/oasisweb/php/getmap.php?LAYER=health&FORMAT=image%2Fpng&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic

// Disclaimer
$html .= "<tr><td colspan='6'>Disclaimer : </td></tr>";
$html .= "<tr><td colspan='6' valign='top' align='left'><font size='1' style='font-style:italic'> Data provided through OASIS Web is provided from a wide range of sources. iMMAP does not take ownership or responsibility for these datasets.</font></td></tr>";
$html .=
	'</table></div></div>';

$data_source_label = '';
if ($base_map_source != ''){$data_source_label .= $base_map_source;}
if ($unsdit_data!=''){
	if ($map_type!='SDI-Basemap'){$data_source_label .= ', '.$unsdit_data;}
}
if ($wfp_data!=''){$data_source_label .= ', '.$wfp_data;} 

$html_Add .= '<tr><td align="left"><font size="1">Background image :</font></td></tr>
		<tr><td align="left"><font size="1">'.$data_source_label.'</font></td></tr>	
		<tr><td align="right"><font size="1">'.date("F j, Y").'</font></td></tr>						
		</table></div>';
	$html .= $html_Add;
	
	if (strlen($comments)>0){
		$html .= $html_Add_comment;
	}
	$html .=
	'</body>
</html>';
	

$xx = explode(' ', $orientation);
///*
	
	if ($_REQUEST["mode"] != 'stat') {
		//Create PDF string from HTML
		$dompdf = new DOMPDF();
		$dompdf->load_html($html);
		$dompdf->set_paper($xx[0], $xx[1]);
		
		
		$dompdf->render();
		$pdf = $dompdf->output();
		
		//Send PDF as attachment (requires iframe at client)
		header('Content-type: application/pdf');
		header("Content-Length: " . strlen($pdf));
		header('Content-Disposition: attachment; filename=gp_'.$map_type.'_'.date('Y-m-d').'.pdf');
		print($pdf);
	} else if ($_REQUEST["mode"] == 'stat') {
		$dompdf = new DOMPDF();
		$dompdf->load_html($html);
		$dompdf->set_paper("a4", "landscape");
		$dompdf->render();
		$pdf = $dompdf->output();
		file_put_contents('tmp' . '/' . 'gp_'.$map_type.'_'.date('Y-m-d').'.pdf', $pdf);
		echo 'gp_'.$map_type.'_'.date('Y-m-d').'.pdf';
	}		
	
//*/
unlink($filename);
unlink("tmp/legend$random.png");
unset($dompdf)

?>


        
      
