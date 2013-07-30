<?php
include 'dbconnect.php';

$db = getDevDB();
$query = "Select organization_name, organization_type, sector, activity_type, activity_description, unit, quantity, conditions, x(the_geom) as lng, y(the_geom) as lat
from pmc
where the_geom is not null";  

$res=pg_query($db, $query);
$arr = array();
while ($row = pg_fetch_array($res)){
	$arr[] = $row;
}

echo '{"data":'.json_encode($arr).'}';
pg_close($db);
?>