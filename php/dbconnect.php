<?php
function getDB() {
	return pg_connect("host=xxxxx port=xxxxx dbname=xxxxx user=xxxxx password=xxxxx");
}	
function getSindhDB() {
	return pg_connect("host=xxxxx port=xxxxx dbname=xxxxx user=xxxxx password=xxxxx");
}
function getDevDB() {
	return pg_connect("host=xxxxx port=xxxxx dbname=xxxxx user=xxxxx password=xxxxx");
}
function getKDB() {
	return pg_connect("host=xxxxx port=xxxxx dbname=xxxxx user=xxxxx password=xxxxx");
}

$GLOBALS['connectionstring'] = array(
    'incidentdata'  => "host=xxxxx user=xxxxx password=xxxxx dbname=xxxxx port=xxxxx",
    'devdata'  => "host=xxxxx user=xxxxx password=xxxxx dbname=xxxxx port=xxxxx"
);


?>
