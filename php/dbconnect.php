<?php
function getDB() {
<<<<<<< HEAD
	return pg_connect("host=54.235.150.26 port=9191 dbname=oasisweb user=budi password=dw#\$df2dy@!Fs35S@");
=======
	return pg_connect("host=54.235.150.26 port=9191 dbname=oasisweb user=budi password=xxxxxxx");
>>>>>>> 0f3ba027ea74716e0ddf09cff351115031e7da5c
}	
function getSindhDB() {
	return pg_connect("host=210.56.24.186 port=5432 dbname=incidents user=postgres password=xxxxx");
}
function getDevDB() {
	return pg_connect("host=210.56.8.107 port=5432 dbname=odk_DIFD user=postgres password=xxxxx");
}
function getKDB() {
<<<<<<< HEAD
	return pg_connect("host=54.235.150.26 port=9191 dbname=oasisweb user=budi password=dw#\$df2dy@!Fs35S@");
=======
	return pg_connect("host=54.235.150.26 port=9191 dbname=oasisweb user=budi password=xxxxx");
>>>>>>> 0f3ba027ea74716e0ddf09cff351115031e7da5c
}

$GLOBALS['connectionstring'] = array(
    'incidentdata'  => "host=localhost user=postgres password=xxxx dbname=incidents port=5432",
    'devdata'  => "host=210.56.8.107 user=postgres password=xxxxxx dbname=odk_DIFD port=5432"
);


?>
