<?php
session_start();
$userid = $_SESSION['user'];
	
	include 'dbconnect.php';	
	$query = "Select * from \"Administration\".layerconf where userid = '$userid'";
	$dbinfo = getDB();
	$result = pg_query( $dbinfo, $query);
	
	while ($obj = pg_fetch_array( $result)){
		$res[] = $obj['conf']; 
	}
	
	echo json_encode($res);
?>