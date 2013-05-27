<?php

// produce shapefile
function createPoint($longitude, $latitude, $table, $data) {
	include 'dbconnect.php';
	$db = getSindhDB();
	$query_pre = "INSERT into $table (";
	$query_field = "";
	$query_value = "";
	$query_field .= "the_geom";
	$query_value .= "GeomFromText('POINT($longitude $latitude)', 4326)";
	foreach ($data as $key => $value) {
		if ($key!='gid'){
			$query_field .= ",".$key;
			$query_value .= ",'".$value."'";
		}		
	}
	$query_field .= ") VALUES (";
	$query_value .= ")";
	$query = $query_pre.$query_field.$query_value;

	// echo $query;
	$res=pg_query($db, $query); 
	 
	pg_close($db);	
}

function changePoint($longitude, $latitude, $table, $data) {
	include 'dbconnect.php';
	$db = getSindhDB();
	$query_pre = "UPDATE $table set ";
	$query_field = "";
	$gid = "";
	$query_field .= "the_geom = GeomFromText('POINT($longitude $latitude)', 4326)";
	foreach ($data as $key => $value) {
		if ($key!='gid'){
			$query_field .= ", ".$key ." = '".$value."'";
		} else {
			$gid = $value;
		}		
	}
	$query_field .= " where gid=$gid";
	$query = $query_pre.$query_field;

	// echo $query;
	$res=pg_query($db, $query); 
	 
	pg_close($db);
}

function deletePoint($table, $data){
	include 'dbconnect.php';
	$db = getSindhDB();

	foreach ($data as $key => $value) {
		if ($key=='gid'){
			$gid = $value;
		}		
	}

	$query = "delete from $table where gid=$gid";
	// echo $query;
	$res=pg_query($db, $query); 
	 
	pg_close($db);	
}

$lon = $_REQUEST['lon'];
$lat = $_REQUEST['lat'];
$data = json_decode($_REQUEST['data']);
$table = $_REQUEST['dbf'];


if ($_REQUEST['state']=='add'){
	createPoint($lon, $lat, $table, $data);
} else if ($_REQUEST['state']=='edit'){
	changePoint($lon, $lat, $table, $data);
} else if ($_REQUEST['state']=='delete'){
	deletePoint($table, $data);	
}

?>