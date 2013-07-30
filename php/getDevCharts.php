<?php
include 'dbconnect.php';
$field = $_REQUEST['field'];
$realfield = $_REQUEST['realfield'];
$table= $_REQUEST['table'];
$class= $_REQUEST['class'];


$field = explode(',', $field);
$realfield = explode(',', $realfield);

$db = getDevDB();
$query = "select 
provinces";  

for ($i = 0; $i < count($realfield); $i++) {
	$query .= ", SUM(case when $class='".$realfield[$i]."' then 1 else 0 end) as \"".$field[$i]."\"";	
}
$query .= " from $table group by provinces";


// echo $query;
$res=pg_query($db, $query);
$arr = array();
while ($row = pg_fetch_array($res)){
	$arr[] = $row;
}

echo '{"data":'.json_encode($arr).'}';
pg_close($db);
?>