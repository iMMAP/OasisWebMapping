<?php 
include 'dbconnect.php';
$key = $_REQUEST['key'];

$dbinfo = getDevDB();  

  
  // Get the bytea data
   $sql ='SELECT image FROM getodkimage WHERE uuid =';
   //$sql .=  '\'uuid:71b73852-9127-4183-9b96-aba2b8d0c140\''; 
  $sql .=  '\''.$key.'\'';
    
  // echo $sql;  
    $res = pg_query($dbinfo, $sql);  
    $raw = pg_fetch_result($res, 'image');
    // echo $raw;
  
  // Convert to binary and send to the browser
  header('Content-type: image/jpeg');
  echo pg_unescape_bytea($raw);
  
pg_close($dbinfo);  
?>