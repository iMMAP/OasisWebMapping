<?php
include '../dbconnect.php';	


 
		$email = $_REQUEST["email"];
		
		//$sql="select * from noc_logins where email = '".$email."'";
		
		$query = "SELECT * FROM OASIS_v3_2.dbo.Members WHERE email = '".$email."'";
		$dbinfo = getDB();
		$result = sqlsrv_query( $dbinfo, $query);
		$rows = sqlsrv_has_rows( $result );
		
		
		if($rows === true)
		 {
		 	while ($obj = sqlsrv_fetch_array( $result)){
				
				
			$hasRow = true;
			$pass = $obj['password'];
			$username=$obj["name"];
			}
			
			$from = 'no-replay@immap.org';
			
			  $to  = $email; 
			  $messages = "";
		  
			  $subject="Forgot password - OASISWeb";
			     
	               
	              
	               
				   $messages.="Dear ".$username.",\n\n
	
	You requested your password for OASISWeb.\n\n
	If you did not make this request,please email us immediately\n\n
	
	Your Password: ".$pass."\n\n
	Regards,\n\n
	OASISWeb Help Desk";
			  
			  
			 	$message = $messages;
				
				 
				 //$headers  = "MIME-Version: 1.0\r\n";
				// $headers .= "From: OASISWeb <no-replay@immap.org>\r\n";
				// $headers .= "Content-type: text/html; charset=iso-8859-1\r\n";
				 
				 
				 
		require_once "../../lib/mail/Mail.php";  
  
	/* SMTP server name, port, user/passwd */  
	$smtpinfo["host"] = "ssl://smtp.gmail.com";  
	$smtpinfo["port"] = "465";  
	$smtpinfo["auth"] = true;  
	$smtpinfo["username"] = "oasismailservice@gmail.com";  
	$smtpinfo["password"] = "1234_qwer";
	
	$to      = $email; 
	$headers = array ('From' => $from,'To' => $to,'Subject' => $subject);  
	$smtp = &Mail::factory('smtp', $smtpinfo ); 
	$mail = $smtp->send($to, $headers, $message); 
				 
				 
				 
				 
				 if($mail) 
				  echo 1;
				 else
				  echo "Email Not Send Successfully!";	
				
			
					
				
				
			
			}else {
	echo "Email Does Not Exist in our Database !";	
}	 
		

sqlsrv_close( $dbinfo );
		
	
	
		 
?>