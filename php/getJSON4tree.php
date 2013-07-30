<?php
include 'dbconnect.php';


$db = getKDB();

$groupQuery = "select distinct layergroup from oasisweb.layers";
$query = "select * from oasisweb.layers";
$resGroup=pg_query($db, $groupQuery);

// echo $query;
while ($rowGroup = pg_fetch_array($resGroup)){
	$arr[$rowGroup['layergroup']] = array(
		'text' => $rowGroup['layergroup'],
		'group' => $rowGroup['layergroup'],
		'cls' => 'folder',
		'qtip' => $rowGroup['layergroup'],
		'expanded' => false,
		'children' => null
	);
}

$res=pg_query($db, $query);
while ($row = pg_fetch_array($res)){
		$arr[$row['layergroup']]['children'][] = array(
		    'text'  => $row['layercaption'],
		    'qtip'  => $row['layercaption'],
		    'layer'  => $row['layername'],
		    'layertype'  => $row['layertype'],
		    'sourceformat'  => $row['sourceformat'],
		    'data'  => $row['data'],
		    'classitem'  => $row['classitem'],
		    'category'  => $row['category'],
		    'url' => $row['layerurl'],
		    'opacity' => $row['layeropacity'],
		    'link' => $row['sourcelink'],
		    'source' => $row['layersource'],
		    'leaf' => true,
			'checked' => false
		);
}

$i = 0;
foreach ($arr as $k => $v) {
   unset ($arr[$k]);

   $new_key =  $i;

   $arr[$new_key] = $v;
   $i++;
}


// echo '{"data":'.json_encode($arr).'}';
echo json_encode($arr);

pg_close($db);
?>