OasisMapping
============

<b>------ ASSUMPTIONS ------</b>
- you are installing on ubuntu server LTS 12.04
- postgresql and/or mssql databases reside independently of this config
- system tables for the app are setup on the postgressql instance (more to come on this)

<b>------ iNSTALLATION ------</b>         

Prepare the system

    sudo apt-get update
    sudo apt-get upgrade

Install postgresql client

    sudo apt-get install postgresql-client 
    
Install apache, php, pear, gd, mapscript, pdfprint, and more..

    sudo apt-get install apache2 php5 libapache2-mod-php5 php-pear php5-gd php5-mapscript php5-pgsql pdftk
    
Install SMTP server and support

    sudo apt-get install postfix             (set as internet service, and enter your domain name)
    sudo pear install Net_SMTP
    
Reconfigure postfix SMTP server using

    sudo dpkg-reconfigure postfix
    
Setup for Google Projection

    sudo vi /usr/share/proj/epsg
    
and in that file add the following:

    <900913> +proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +no_defs <>
    
Restart apache

    sudo service apache2 restart
    
Get the code

    cd /var/www
    sudo apt-get install git
    sudo git clone https://github.com/iMMAP/OasisMapping.git

<b>------ CONFIGURATION ------</b>   

Set your postgis server connection string here   

    sudo vi /var/www/OasisMapping/php/conf.php
    sudo vi /var/www/OasisMapping/php/dbconnect.php
    
Set the base url here 

    sudo vi /var/www/OasisMapping/php/configUrl.php  
    
Set your layer config

    sudo vi /var/www/OasisMapping/check_nodes.json
    
Default extent

    variables in APP.JS file defLng, defLat, defZoom
    
Set logo

    image/logo.png

Restart apache

    sudo service apache2 restart
    
<b>------ MSSQL COMPATIBILITY (CURRENTLY NOT SUPPORTED IN MAPSERVER UBUNTU) ------</b>   

If you have issues with connecting to MSSQL check out these links:
- http://davejamesmiller.com/blog/connecting-php-to-microsoft-sql-server-on-debianubuntu
- http://www.unixodbc.org/doc/FreeTDS.html
- http://mailman.unixodbc.org/pipermail/unixodbc-support/2008-November/001842.html
- http://askubuntu.com/questions/167491/connecting-ms-sql-using-freetds-and-unixodbc-isql-no-default-driver-specified
   

in short, create a file called: unixodbc.freetds.driver.template.in:

    [FreeTDS]
    Description     = FreeTDS unixODBC Driver
    Driver          = /usr/lib/x86_64-linux-gnu/odbc/libtdsodbc.so
    
and run: 

    sudo odbcinst -i -d -f unixodbc.freetds.driver.template.in

finally, to test try:

    ogrinfo -al "MSSQL:driver=FreeTDS;server=SERVERIP,PORT;
    database=DBNAME;uid=UID;pwd=PWD;tables=TABLENAME(SPATIAL_COLUMNNAME)" TABLENAME

<b>------ CONNECTING TO EXTERNAL WMS ------</b>   

change apache httpd.conf:

    ScriptAlias /cgi-bin/ /usr/lib/cgi-bin/
    <Directory "/usr/lib/cgi-bin/">
          AllowOverride None
          Options +ExecCGI -MultiViews +SymLinksIfOwnerMatch
          Order allow,deny
          Allow from all
    </Directory>
    
also add the servername:port to allowedHosts in /usr/lib/cgi-bin/proxy.cgi

for the moment you need to modify the following to your custom WMS:
https://github.com/iMMAP/OasisWebMapping/commit/044f1a8665587f240d6750eea7932b909d4b90f8

we will be adding support for multiple sources later

<b>------ Enjoy :) ------</b>   
