<?php
include '../dbconnect.php';

$email = isset($_REQUEST["email"])?$_REQUEST["email"]:"";
$act = isset($_REQUEST["act"])?$_REQUEST["act"]:"";

if($act == "email")
 {
		
		
$query = "SELECT * FROM OASIS_v3_2.dbo.Members WHERE email = '".$email."'";
//$query = "SELECT * FROM OASIS_v3_2.dbo.Members";

$num = 0;
$dbinfo = getDB();
$result = sqlsrv_query( $dbinfo, $query);

if ($result) {
	$rows = sqlsrv_has_rows( $result );
	if ($rows === true)
		$num = 1;
}


echo $num;

sqlsrv_close( $dbinfo );	
 }
?>