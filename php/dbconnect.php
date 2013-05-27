<?php
include 'conf.php';
// function getDB() {
	// $serverName = $GLOBALS['serverUrl'];
	// $connectionInfo = array( "Database"=>$GLOBALS['dbname'], "UID"=>$GLOBALS['username'], "PWD"=>$GLOBALS['password']);
	// return sqlsrv_connect( $serverName, $connectionInfo);
// 
// }	

function getDB() {
	$serverName = $GLOBALS['serverUrl'];
	$dbname = $GLOBALS['dbname'];
	$username = $GLOBALS['username'];
	$password = $GLOBALS['password'];
	$port = $GLOBALS['port'];
	return pg_connect("host=$serverName port=$port dbname=$dbname user=$username password=$password");
}

function getSindhDB() {
	return pg_connect("host=210.56.24.186 port=5432 dbname=incidents user=postgres password=password");
}
?>
