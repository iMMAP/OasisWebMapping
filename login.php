<?php
 $msg = isset($_REQUEST["act"])?$_REQUEST["act"]:"";
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
 <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>OASIS-Pakistan</title>
  <meta name="description" content="OASISWeb brings together live information feeds for earthquakes, fires, precipitation, wind speed, temperature, lightning and cloud cover. Combined with this there are historical datasets for floods, and arange of public data sources for Pakistan." />
  <meta name="keywords" content="imnmap information management platform, flood, mapping, GIS, remote sensing, Information management tools, weather, forecast, disaster, emergency"/>
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="stylesheet" href="OASIS/Js/responsiveslides.css">
  <link rel="stylesheet" href="OASIS/style.css">
  <link href="mybox/mybox.css" rel="stylesheet" type="text/css" />
  <script src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
  <script type="text/javascript" src="js/pages/default.js"></script>
  <script src="mybox/mybox.js" type="text/javascript"></script>
  <script type="text/javascript" src="js/pages/registration.js"></script>
  <script src="OASIS/Js/responsiveslides.min.js"></script>
   
  <script>
    // You can also use "$(window).load(function() {"
    jQuery(function () {

      // Slideshow 1
      jQuery("#slider1").responsiveSlides({
        maxwidth: 700,
        speed: 500
      });

     
    });
  </script>
</head>
<body>
<div class="header">
<?php include 'header.php';?>
<div class="banner">
<div class="bannerinner">
  <div class="loginarea">
  <form name="login" id="frm_login" method="post" action="php/login.php"  onsubmit="return validateLogin()">
  <table width="82%" border="0" align="center">
  <tr>
    <td height="74"><div class="memberlogin">Member Login</div></td>
  </tr>
  <tr>
    <td><div class="lgh1">Email Address</div></td>
  </tr>
  <tr>
    <td>
    
      <label for="textfield"></label>
      <input name="username" type="text" class="lgtfield" id="username">
    </td>
  </tr>
  <tr>
    <td><div class="lgh1">Password</div></td>
  </tr>
  <tr>
    <td><input name="password" type="password" class="lgtfield" id="password"></td>
  </tr>
  <tr>
    <td><div class="lgh2"><a href="#forget" rel="mybox"><strong>Forgot Password ?</strong></a></div></td>
  </tr>
  <tr>
    <td height="49">
      <input name="button" type="submit" class="loginB1" id="button" value="Login">
    </td>
  </tr>
</table>
</form>
  <div class="loginBottom">
    <div class="lgh3"> </div>
  </div>

  </div>
  <div class="slideshow">
    <!-- Slideshow 1 -->
<ul class="rslides" id="slider1">
      <li><img src="OASIS/images/1.jpg" alt=""></li>
      <li><img src="OASIS/images/2.jpg" alt=""></li>
      <li><img src="OASIS/images/3.jpg" alt=""></li>
      <li><img src="OASIS/images/4.jpg" alt=""></li>
      <li><img src="OASIS/images/5.jpg" alt=""></li>
      <li><img src="OASIS/images/6.jpg" alt=""></li>
      <li><img src="OASIS/images/7.jpg" alt=""></li>
      <li><img src="OASIS/images/8.jpg" alt=""></li>
    </ul>
    </div>
    <div class="highlights"><strong></strong></div>
    
</div>
</div>
<div class="form1">
  <div class="form1inner">
    <div class="form1inner">
      <form name="frmSignup" id ="frmSignup" method="post" action="php/registration.php" onsubmit="return validateForm()">
      <table width="98%" border="0" align="center">
        <tr>
          <td height="43" colspan="3"><div class="RegisterH1">Register 
            
          </div>
            <div class="caption">Please fill the below text fields, and we will send you a password <strong>code </strong></div></td>
          </tr>
          <tr>
          <td colspan="3">
          		<?php
          		$style = 'style="display:none"';
 					
 					if($msg)
 					{
 						if($msg == 'suc')
 						{
 							$msg = "Your registration has been successfully completed, Your password has been sent to your email address.";
 							$style = 'style="display:block"';
 						}	 							
 						else if($msg == 'err') 
 						{
 							$msg = "Error while registring";
 							$style = 'style="display:block"';
 						}
 							
 							
 						
 					}
          		?>
          		<div id="err" class="error" <?php echo $style;?>><?php echo $msg;?></div>
				<div id="success" class="success" style="display:none"></div></td>
          
        </tr>
        <tr>
          <td width="32%" height="31"><div class="RegisterH2">Name</div></td>
          <td width="33%"><div class="RegisterH2">Email</div></td>
          <td width="35%"><div class="RegisterH2">Designation</div></td>
        </tr>
        <tr>
          <td><input name="name" type="text" class="registerF" id="name"></td>
          <td><input name="email" type="text" class="registerF" id="email"></td>
          <td><input name="designation" type="text" class="registerF" id="designation"></td>
        </tr>
        <tr>
          <td><div class="RegisterH2">Organization</div></td>
          <td><div class="RegisterH2">Mobile</div></td>
          <td>&nbsp;</td>
        </tr>
        <tr>
          <td><input name="organization" type="text" class="registerF" id="organization"></td>
          <td><input name="mobile" type="text" class="registerF" id="mobile"></td>
          <td>
          <input name="button" type="submit" class="loginB1" id="submit" value="Register">
          <!-- <img src="OASIS/images/register_btn.png" width="169" height="39"> --></td>
        </tr>
        <tr>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
          <td>&nbsp;</td>
        </tr>
      </table>
    </div>
  </div>
</div>
<?php include 'footer.php'; ?>
</div>
</body>
</html>


<div  id="forget" style="width:400px;height:160px;display:none">
	<div>&nbsp;</div>
	<span class="hd2">Forgot Password?</span>
	<div>&nbsp;</div>
	<form name="form_signup" id="form_signup" action="" method="post" >
	<div class="main_txt"  align="left"  style="width:370px;height:50px;">
		<div>You can recover your lost password by entering your email address.  We will email you your password shortly.</div>
		<div style="width:365px;padding:3px;margin-top:10px;"><input type="text" name="for_email" id="for_email" value="" class="field1"  style="width:300px;"  /></div>
		
		<div align="left">
		<input type="button" name="for" id="for" value="Submit"     />
		</div>
		<div id="error_" style="padding-left:20px; padding-bottom:20px; ">&nbsp;</div>
	</div>
	</form>
</div>
