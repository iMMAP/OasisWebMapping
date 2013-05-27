<?php
include 'dbconnect.php';	
$users = json_decode($_REQUEST['users']);
$layerid = $_REQUEST[layer];
session_start();
$userid = $_SESSION['user'];
// var_dump($users);

require_once "../lib/mail/Mail.php";  
  
$from    = "oasismailservice@gmail.com";  
 
$subject = "New dataset has been shared to you";  
$body    = "Hi,\n\nNew dataset has been shared to you from $userid'\n\n Best Regards,";  
  
/* SMTP server name, port, user/passwd */  
$smtpinfo["host"] = "ssl://smtp.gmail.com";  
$smtpinfo["port"] = "465";  
$smtpinfo["auth"] = true;  
$smtpinfo["username"] = "oasismailservice@gmail.com";  
$smtpinfo["password"] = "1234_qwer";

foreach($users as $idx => $user){
	$to      = $user->id; 
	// var_dump($user->id);
	$query = "insert into \"Administration\".layerconf select '$layerid', conf, '$user->name'
	from \"Administration\".layerconf
	where id = '$layerid' and userid='$userid'";
	$dbinfo = getDB();
	$result = pg_query( $dbinfo, $query);
	pg_close( $dbinfo );
	
	$headers = array ('From' => $from,'To' => $to,'Subject' => $subject);  
	$smtp = &Mail::factory('smtp', $smtpinfo );  
	
	if ($result){  
		$mail = $smtp->send($to, $headers, $body);  
	}
	
}


?>