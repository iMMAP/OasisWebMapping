<?php
	include 'dbconnect.php';	
	$query = "Select * from \"Administration\".\"OasisUsers\" where \"User_Name\" like '%".$_REQUEST['query']."%'";
	$dbinfo = getDB();
	$result = pg_query( $dbinfo, $query);
	
	while ($obj = pg_fetch_object($result)){
		$res[] = $obj; 
	}
	$res_arr = array(
		'data' => $res
	);
	pg_close( $dbinfo );

	$data = json_encode($res_arr);
if ($_GET['callback']) {
    echo $_GET['callback'].'('.$data.');';
  
// Normal JSON
} else {
    echo $data;
}	
	// echo '{"data":'.json_encode($res).'}';
?>