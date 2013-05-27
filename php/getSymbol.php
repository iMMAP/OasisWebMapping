<?
$objScan = scandir("../mapfile/image");
$array = array();
foreach ($objScan as $value) {
	if (($value != '.svn') && ($value != '.') && ($value != '..'))
		$array[] = array('name' => $value, 'file'=>$value);    	
}
echo "{\"symbol\": ".json_encode($array)."}";
?>