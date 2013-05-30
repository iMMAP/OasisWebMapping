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
    
Install apache, php, pear, gd, mapscript, and more..

    sudo apt-get install apache2 php5 libapache2-mod-php5 php-pear php5-gd php5-mapscript php5-pgsql
    
Install SMTP server and support

    sudo apt-get install postfix             (set as internet service, and enter your domain name)
    sudo pear install Net_SMTP
    
Reconfigure postfix SMTP server using

    sudo dpkg-reconfigure postfix
    
Restart apache

    sudo service apache2 restart
    
Get the code

    cd /var/www
    sudo apt-get install git
    sudo git clone https://github.com/iMMAP/OasisMapping.git

<b>------ CONFIGURATION ------</b>   

Set your postgis server connection string here   

    sudo vi /var/www/OasisMapping/php/conf.php
    
Set the base url here 

    sudo vi /var/www/OasisMapping/php/configUrl.php  
    
Set your layer config

    sudo vi /var/www/OasisMapping/check_nodes.json

Restart apache

    sudo service apache2 restart
    
<b>------ MSSQL COMPATIBILITY ------</b>   

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

<b>------ Enjoy :) ------</b>   
