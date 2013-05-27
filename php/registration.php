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
	$from    = "OasisWebMapping@immap.org";  
	 
	$subject = "Your Password has been created";  
	$body    = "Hi ".$_REQUEST['name'].",\n\nYour account has been created, use credential account below to access oasis web portal\n
	username : ".$_REQUEST['name']."\n
	password : ".$randomPassword."
	\n\n Best Regards,";  
	  
	/* SMTP server name, port, user/passwd */  
	$smtpinfo["host"] = "localhost";  
	$smtpinfo["port"] = "25";  
	$smtpinfo["auth"] = false;  
	$smtpinfo["username"] = "OasisWebMapping@immap.org";  
	$smtpinfo["password"] = "OasisWebMapping@immap.org";
	
	$to      = $_REQUEST['email']; 
	$headers = array ('From' => $from,'To' => $to,'Subject' => $subject);  
	$smtp = &Mail::factory('smtp', $smtpinfo ); 
	$mail = $smtp->send($to, $headers, $body); 
}
//var_dump($mail);
header("Location: ../login.php");	
	
?>
