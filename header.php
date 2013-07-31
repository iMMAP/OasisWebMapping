<div class="headerinner">
  <div class="oaisislogo"><a href="#"><img src="OASIS/images/oasislogo.png" width="220" height="80"></a></div>
  <div class="topbar"> <a href="#">Help Desk :</a> 021-35837242  <a href="#">Feedback :</a> oasispk@immap.org</div>
  <div class="menu">
  <div id='cssmenu'>
<?php 
 $page_m = basename($_SERVER['PHP_SELF']);
?>
  <ul>
  <?php 
   if($page_m == 'login.php')
   {
   	?>
   	   	<li class='active'><a href='login.php'><span>Home</span></a></li>
   	 <?php 
   	   	
   }
  else
   {
   	?>
   	<li ><a href='login.php'><span>Home</span></a></li>
   	<?php 

   }
   ?>
</ul>


</div>

  
  </div>
</div>
