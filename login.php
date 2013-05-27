<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Oasis Web Login</title>
<link href="css/login.css" rel="stylesheet" type="text/css" />
</head>

<body>
<form id="login" action='php/login.php' method='post'>
    <h1>iMMAP - OASIS</h1>
    <?php
    if ($_REQUEST['q']=='false'){
    	echo "<h5>Please input the correct username and password..!</h5>";
	}
	?>	
    <fieldset id="inputs">
        <input name="username" id="username" type="text" placeholder="Username" autofocus required>   
        <input name="password" id="password" type="password" placeholder="Password" required>
    </fieldset>
    <fieldset id="actions">
        <input type="submit" id="submit" value="Log in">
        <a href="registration.php">Register</a>
    </fieldset>
    <h6>Best viewed with Mozilla Firefox browser</h6>
</form>



</body>
</html>
