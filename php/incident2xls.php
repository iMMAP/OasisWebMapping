<?
include 'dbconnect.php';
$month = $_REQUEST['month'];
$year = $_REQUEST['year'];
$db = getSindhDB();

header('Content-type: application/vnd.ms-excel');
    header("Content-Disposition: attachment; filename=incident$month$year.xls");
    header("Pragma: no-cache");
    header("Expires: 0"); 

$query = "select gid, incidenttyppe, locationname, locaccuraccy, incidenttime, description, source, sourcerate, sourcerateinfo, remarks, noaffectedperson, nopersonkilled, nopersoninjured, st_astext(the_geom) as coord from incidents";
$query .= " where EXTRACT(MONTH FROM incidenttime)=$month and EXTRACT(YEAR FROM incidenttime)=$year";
$res=pg_query($db, $query);

$table = "<table>";
$table .= "<tr><td>GID</td><td>Incident Type</td><td>Location Name</td><td>Location Accuracy</td><td>Incident Time</td><td>Desc</td><td>Source</td><td>Source Rate</td><td>Source Rate Info</td><td>Remarks</td><td>No. Affected Person</td><td>No Person Killed</td><td>No. Person Injured</td><td>Coord Position</td></tr>";
while ($row = pg_fetch_array($res)){
	$table .= "<tr><td>".$row[0]."</td><td>".$row[1]."</td><td>".$row[2]."</td><td>".$row[3]."</td><td>".$row[4]."</td><td>".$row[5]."</td><td>".$row[6]."</td><td>".$row[7]."</td><td>".$row[8]."</td><td>".$row[9]."</td><td>".$row[10]."</td><td>".$row[11]."</td><td>".$row[12]."</td><td>".$row[13]."</td></tr>";	
}

// $table .="<tr><td>Hello world</td></tr>";
$table .="</table>";


pg_close($db);
echo $table;
?>