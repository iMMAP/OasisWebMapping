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
	$from    = "oasiswebmapping@oasiswebservice.org";  
	 
	$subject = "Your Password has been created";  
	$body    = "Dear ".$_REQUEST['name'].",\n
	Welcome to the release of iMMAP’s OASIS Web 1.0.
	
Your user name is: ".$_REQUEST[email]."
Your password is: ".$password."

	You can change your password once you have logged in and you can also reset your password if you have forgotten it.
	
Best Regards,
	
	
iMMAP";  
	  
	/* SMTP server name, port, user/passwd */  
	$smtpinfo["host"] = "localhost";  
	$smtpinfo["port"] = "25";  
	$smtpinfo["auth"] = false;  
	$smtpinfo["username"] = "oasiswebmapping@oasiswebservice.org";  
	$smtpinfo["password"] = "none";
	
	$to      = $_REQUEST[email]; 
	$headers = array ('From' => $from,'To' => $to,'Subject' => $subject);  
	$smtp = &Mail::factory('smtp', $smtpinfo ); 
	$mail = $smtp->send($to, $headers, $body); 
	header("Location: ../login.php?act=suc");
}
else
	header("Location: ../login.php?act=err");
	
	
?>
