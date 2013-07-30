<?php
function getDB() {
	return pg_connect("host=54.235.150.26 port=9191 dbname=oasisweb user=budi password=xxxxxxx");
}	
function getSindhDB() {
	return pg_connect("host=210.56.24.186 port=5432 dbname=incidents user=postgres password=xxxxx");
}
function getDevDB() {
	return pg_connect("host=210.56.8.107 port=5432 dbname=odk_DIFD user=postgres password=xxxxx");
}
function getKDB() {
	return pg_connect("host=54.235.150.26 port=9191 dbname=oasisweb user=budi password=xxxxx");
}

$GLOBALS['connectionstring'] = array(
    'incidentdata'  => "host=localhost user=postgres password=xxxx dbname=incidents port=5432",
    'devdata'  => "host=210.56.8.107 user=postgres password=xxxxxx dbname=odk_DIFD port=5432"
);


?>
