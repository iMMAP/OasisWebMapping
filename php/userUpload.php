<?php

// var_dump($_REQUEST);
move_uploaded_file($_FILES['data']['tmp_name'],
        '../mapfile/shapefiles/users/'.$_FILES['data']['name']);	

$zip = new ZipArchive;
$res = $zip->open('../mapfile/shapefiles/users/'.$_FILES['data']['name']);
if ($res === TRUE) {
	$zip->extractTo('../mapfile/shapefiles/users/');
	$zip->close();
} else {
	// echo "failed";
}

$styleArr = array();
foreach($_REQUEST['stylename'] as $idx => $name){
//
	$styleArr[$_REQUEST['key'][$idx]] = array(
											'name' => $_REQUEST['stylename'][$idx], 
											'symbolname' => $_REQUEST['symbol'][$idx ],
											'size' => $_REQUEST['size'][$idx],
											'color'=> $_REQUEST['color'][$idx],
											'outlinecolor'=> $_REQUEST['outlinecolor'][$idx]
										); 
//  	
	// move_uploaded_file($_FILES['symbol']['tmp_name'][$idx ],
        // '../mapfile/image/'.$_FILES['symbol']['name'][$idx ]);	
}


$res_arr = array(
	'text' => $_REQUEST['desc'], 
	'layer'=> $_REQUEST['name'],
	'layertype'=> $_REQUEST['type'],
	'sourceformat'=> $_REQUEST['format'],
	'data'=> substr($_FILES['data']['name'], 0, strlen($_FILES['data']['name'])-3)."shp",
	'classitem'=> $_REQUEST['catitem'],
	'category'=> $styleArr,
	'leaf'=> true,
	'checked'=> false
);


session_start();
$userid = $_SESSION['user'];

include 'dbconnect.php';	
$query = "insert into OASIS_v3_2.dbo.layerconf (id, conf, userid) VALUES (?, ?, ?)";
$params = array($_REQUEST['name'], json_encode($res_arr), $userid);

$dbinfo = getDB();
sqlsrv_query( $dbinfo, $query, $params);
sqlsrv_close( $dbinfo );


echo '{"success":true, "result":'.json_encode($res_arr).'}';

?>