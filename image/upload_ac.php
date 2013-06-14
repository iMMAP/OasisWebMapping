<?php
//set where you want to store files
//in this example we keep file in folder upload 
//$HTTP_POST_FILES['ufile']['name']; = upload file name
//for example upload file name cartoon.gif . $path will be upload/cartoon.gif

$path= "./".$HTTP_POST_FILES['ufile']['name'];
if($ufile !=none)
{
if(copy($HTTP_POST_FILES['ufile']['tmp_name'], $path))
{
echo "Successful<BR/>"; 

//$HTTP_POST_FILES['ufile']['name'] = file name
//$HTTP_POST_FILES['ufile']['size'] = file size
//$HTTP_POST_FILES['ufile']['type'] = type of file

echo "File Name :".$HTTP_POST_FILES['ufile']['name']."<BR/>"; 
echo "File Size :".$HTTP_POST_FILES['ufile']['size']."<BR/>"; 
echo "File Type :".$HTTP_POST_FILES['ufile']['type']."<BR/>"; 
echo "<img src=\"$path\" width=\"150\" height=\"150\">";
}
else
{
echo "Error";
}
}
?>
