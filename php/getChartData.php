<?php
// include 'dbconnect.php';
$data1 = array();	
$data2 = array();
$chartfield = array();
$fullfield = array();
$mainResults = array();
// $dbinfo = getDB();

$query1 = "select distinct ProjectTitle
from SRFV2.dbo.IPbyDistProject
where Location_ID = 12";
$result1 = sqlsrv_query( $dbinfo, $query1);
while ($obj1 = sqlsrv_fetch_array( $result1)){
	$data1[] = $obj1[0];
}

$query2 = "select distinct OrganizationAcronym
from SRFV2.dbo.IPbyDistProject
where Location_ID = 12";
$result2 = sqlsrv_query( $dbinfo, $query2);
while ($obj2 = sqlsrv_fetch_array( $result2)){
	$data2[] = $obj2[0];
}

$pertama1 = true;
$pertama2 = true;

foreach ($data1 as $value1){
    if ($pertama1){	
    	$fullfield[] = 'title';
	}	
    $arr = array();
	foreach ($data2 as $value2){
		if ($pertama1){	
	    	$fullfield[] = $value2;
			$chartfield[] = $value2;
		}	
		
		$query = "select count(*) from SRFV2.dbo.IPbyDistProject where Location_ID = 12 and ProjectTitle = '$value1' and OrganizationAcronym = '$value2'";
		// echo $query."<br>";
		$result = sqlsrv_query( $dbinfo, $query);
		$obj = sqlsrv_fetch_array( $result);
		//echo $value1.";".$value2.";".$obj[0]."<br>";
		$arr = array_merge($arr, array($value2=>$obj[0]));
		
	}
	$mainResults[] = array_merge(array('title'=>$value1), $arr);
	$pertama1 = false;
}	


// $arr_value = array(
			// 'success' => true,
			// 'field' => $chartfield,
			// 'fullfield'=>$fullfield,
			// 'rows' => $mainResults
		// );
// echo json_encode($arr_value);		
?>