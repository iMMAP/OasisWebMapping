<?php
include 'dbconnect.php';
session_start();
$userid = $_SESSION['user'];

$dbinfo = getDB();
// $user=$_REQUEST['user'];
$oldpass = $_REQUEST['oldpass'];
$newpass1= $_REQUEST['newpass1'];
$newpass2= $_REQUEST['newpass2'];

if ($newpass1==$newpass2)
{
	$query = "select \"User_Password\" from \"Administration\".\"OasisUsers\"  where \"User_Name\"='$userid';";
	$result = pg_query( $dbinfo, $query);
	$obj = pg_fetch_array( $result);
	$checkpass = $oldpass;
	
	// echo $obj['password'].'='.$checkpass;
	
	if (md5($checkpass)==trim($obj['User_Password'])){
		$newpass = $newpass1;
		$updatequery = "update \"Administration\".\"OasisUsers\" set \"User_Password\" = md5('$newpass') where \"User_Name\"='$userid';";
		// echo $updatequery;
		$updateres = pg_query($dbinfo,$updatequery);
		
		if ($updateres){
			echo "{success: true, Msg:'Change password success'}";
		} else {
			echo "{failure: true, Msg:'Change password failed'}";
		}	
	} else {
		echo "{failure: true, Msg:'Change password failed, write your correct password'}";
	}	
} else {
	echo "{failure: true, Msg:'Change password failed, make sure that you retype correctly'}";
}
pg_close( $dbinfo );



	
?>