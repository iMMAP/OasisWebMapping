<?php
include 'dbconnect.php';	
$query = "select * from \"Administration\".\"OasisUsers\" where \"User_Email\" = '".$_REQUEST['username']."' and \"User_Password\"=md5('".$_REQUEST['password']."')";

$dbinfo = getDB();

$result=pg_query($dbinfo, $query);

while ($obj = pg_fetch_array( $result)){	
	$hasRow = true;
	$id = $obj['id'];
}

pg_close($dbinfo);

if ($hasRow){
	session_start();
	$_SESSION['user']=$_REQUEST['username'];
	$_SESSION['id']=$id;
	header("Location: ../oasismap.php");
} else {
	header("Location: ../login.php?q=false");	
	echo $query;
}	
?>
