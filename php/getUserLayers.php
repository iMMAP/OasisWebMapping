<?php
session_start();
$userid = $_SESSION['user'];
	
	include 'dbconnect.php';	
	$query = "Select * from OASIS_v3_2.dbo.layerconf where userid = '$userid'";
	$dbinfo = getDB();
	$result = sqlsrv_query( $dbinfo, $query);
	
	while ($obj = sqlsrv_fetch_array( $result)){
		$res[] = $obj['conf']; 
	}
	
	echo json_encode($res);
?>