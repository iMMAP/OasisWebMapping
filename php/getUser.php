<?php
	include 'dbconnect.php';	
	$query = "Select id, email, name, designation, organization from OASIS_v3_2.dbo.Members where name like '%".$_REQUEST['query']."%'";
	$dbinfo = getDB();
	$result = sqlsrv_query( $dbinfo, $query);
	
	while ($obj = sqlsrv_fetch_object($result)){
		$res[] = $obj; 
	}
	$res_arr = array(
		'data' => $res
	);
	sqlsrv_close( $dbinfo );

	$data = json_encode($res_arr);
if ($_GET['callback']) {
    echo $_GET['callback'].'('.$data.');';
  
// Normal JSON
} else {
    echo $data;
}	
	// echo '{"data":'.json_encode($res).'}';
?>