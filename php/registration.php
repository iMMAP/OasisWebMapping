<?php
function createRandomPassword() { 

    $chars = "abcdefghijkmnopqrstuvwxyz023456789"; 
    srand((double)microtime()*1000000); 
    $i = 0; 
    $pass = '' ; 

    while ($i <= 7) { 
        $num = rand() % 33; 
        $tmp = substr($chars, $num, 1); 
        $pass = $pass . $tmp; 
        $i++; 
    } 

    return $pass; 

} 

include 'dbconnect.php';

$randomPassword = createRandomPassword();

$query = "insert into \"Administration\".\"OasisUsers\" (\"User_Name\", \"User_Email\", \"User_Password\")
VALUES ('".$_REQUEST['name']."', '".$_REQUEST['email']."', md5('$randomPassword'))";
// $params = array($_REQUEST['email'], $_REQUEST['name'], $password, $_REQUEST['designation'], $_REQUEST['organization'], $_REQUEST['mobile']);



$dbinfo = getDB();
$result = pg_query( $dbinfo, $query);

pg_close( $dbinfo );

if ($result){
	require_once "../lib/mail/Mail.php";  
	$from    = "your_mail@gmail.com";  
	 
	$subject = "Your Password has been created";  
	$body    = "Dear ".$_REQUEST['name'].",\n
	Welcome to the release of iMMAP’s OASIS Web 1.0 for Pakistan. Over the past 6 months we have been developing this product in preparation for the Monsoon 2013 season. We hope that this tool will assist information managers, field staff, project and program managers, and decision makers to have updated information and assist with scenario planning.\n
	OASIS Web brings together live information feeds for earthquakes, fires, precipitation, wind speed, temperature, lightning and cloud cover. Combined with this there are historical datasets for floods, and a range of public data sources for Pakistan.\n
	OASIS has tools to conduct scenario planning analysis, with affected infrastructure and potential affected population estimates provided on-the-fly via the resource finder tool.
You can produce maps very quickly and print directly to PDF.
	
Your user name is: ".$_REQUEST[email]."
Your password is: ".$password."

	You can change your password once you have logged in and you can also reset your password if you have forgotten it.	If you require any assistance please contact the Help Desk : +92 (0)21-35837242 or email support@geopakistan.pk. Please report any bugs to support@geopakistan.pk.
	
Best Regards,
	
	
iMMAP Pakistan";  
	  
	/* SMTP server name, port, user/passwd */  
	$smtpinfo["host"] = "ssl://smtp.gmail.com";  
	$smtpinfo["port"] = "465";  
	$smtpinfo["auth"] = true;  
	$smtpinfo["username"] = "oasismailservice@gmail.com";  
	$smtpinfo["password"] = "1234_qwer";
	
	$to      = $_REQUEST[email]; 
	$headers = array ('From' => $from,'To' => $to,'Subject' => $subject);  
	$smtp = &Mail::factory('smtp', $smtpinfo ); 
	$mail = $smtp->send($to, $headers, $body); 
	header("Location: ../login.php?act=suc");
}
else
	header("Location: ../login.php?act=err");
	
	
?>