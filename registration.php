<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<title>Oasis Web Registration Page</title>
<script type="text/javascript" src="lib/jquery.js"></script>
<script type="text/javascript" src="js/pages/default.js"></script>
<script type="text/javascript" src="js/pages/registration.js"></script>
<link href="css/registration.css" rel="stylesheet" type="text/css" />
<link href="css/default.css" rel="stylesheet" type="text/css" />
</head>

<body>
<form id="login" action='php/registration.php' id="frmLogin" method='post'>
    <h1>Registration</h1>
    <fieldset id="inputs">
	<div id="err" class="error" style="display:none"></div>
	<div id="success" class="success" style="display:none"></div>
        Name:<input name="name" id="name" type="text" class="sign_inp" placeholder="Name">
        Email:<input name="email" id="email" type="text" class="sign_inp"  placeholder="Email">
        <!-- Designation:<input name="designation" id="designation" class="sign_inp"  type="text" placeholder="Designation"> -->
        <!-- Organization:<input name="organization" id="organization" class="sign_inp"  type="text" placeholder="Organization" > -->
        <!-- Mobile:<input name="mobile" id="mobile" type="text" class="sign_inp"  placeholder="03423451245 "> -->
    </fieldset>
    <fieldset id="actions">
        <input type="submit" id="submit" value="Register">
        
         <a href="login.php">Login</a>
    </fieldset>
</form>
</body>
</html>
