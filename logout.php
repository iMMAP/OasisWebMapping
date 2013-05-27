<?php
session_start();

if(session_is_registered('user')){

session_unset();
session_destroy();
header( "Location: login.php" );
}
else{

header( "Location: login.php" );
}
?>