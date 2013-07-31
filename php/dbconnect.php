<?php
function getDB() {
	return pg_connect("host=54.235.150.26 port=9191 dbname=oasisweb user=budi password=dw#\$df2dy@!Fs35S@");
}	
function getSindhDB() {
	return pg_connect("host=210.56.24.186 port=5432 dbname=incidents user=postgres password=password");
}
function getDevDB() {
	return pg_connect("host=210.56.8.107 port=5432 dbname=odk_DIFD user=postgres password=!MM@P2011");
}
function getKDB() {
	return pg_connect("host=54.235.150.26 port=9191 dbname=oasisweb user=budi password=dw#\$df2dy@!Fs35S@");
}

$GLOBALS['connectionstring'] = array(
    'incidentdata'  => "host=localhost user=postgres password=12345 dbname=incidents port=5432",
    'devdata'  => "host=210.56.8.107 user=postgres password=!MM@P2011 dbname=odk_DIFD port=5432"
);


?>
