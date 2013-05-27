<?php
set_time_limit(120);//2mn
ini_set('max_execution_time', 120);

include 'dbconnect.php';	
//$data = array();
$field = array();
$column = array();
$query = $_REQUEST['query']." where Location_ID = ".$_REQUEST['id'];
$dbinfo = getDB();
$result = sqlsrv_query( $dbinfo, $query);

while ($obj = sqlsrv_fetch_object( $result)){
	$data[] = $obj;
}

foreach( sqlsrv_field_metadata( $result ) as $fieldMetadata ) {
    foreach( $fieldMetadata as $name => $value) {
       if ($name == "Name") {
       	 //echo "$name: $value<br />";
       	 	$field[] = $value;
			$column[] = array('header' => $value, 'dataIndex' => $value);
	   }	   
    }
}	

if ($result){
// include 'getChartData.php';

		$arr_value = array(
			'success' => true,
			'model' => $field,
			'gridcolumn' => $column,
			'rows' => $data,
			'field' => $chartfield,
			'fullfield'=>$fullfield,
			'data' => $mainResults
		);
		echo json_encode($arr_value);

} else {
	echo'{"failure":"true"}';
}	
sqlsrv_close( $dbinfo );
?>