@ECHO OFF

REM Execute this file before running the GDAL, MapServer, Proj, Shapelib, and shp2tile
REM commandline utilities. After executing this file you should be able 
REM to run the utilities from any commandline location.

set PATH=C:\ms4w;C:\ms4w\Apache\cgi-bin;C:\ms4w\tools\gdal-ogr;C:\ms4w\tools\mapserv;C:\ms4w\tools\shapelib;C:\ms4w\proj\bin;C:\ms4w\tools\shp2tile;C:\ms4w\tools\shpdiff;C:\ms4w\tools\avce00;C:\ms4w\python\gdal;%PATH%
echo GDAL, mapserv, PROJ, and shapelib dll paths set

set GDAL_DATA=C:\ms4w\gdaldata
echo GDAL_DATA path set

set GDAL_DRIVER_PATH=C:\ms4w\gdalplugins
echo GDAL_DRIVER_PATH set

set PROJ_LIB=C:\ms4w\proj\nad
echo PROJ_LIB set

set CURL_CA_BUNDLE=C:\ms4w\Apache\conf\ca-bundle\cacert.pem
echo CURL_CA_BUNDLE set

cd C:\ms4w\apache\htdocs\oasisweb\php
php -f download3HRainfall.php