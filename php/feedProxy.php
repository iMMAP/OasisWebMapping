<?php
libxml_use_internal_errors(true);
$doc = new DOMDocument;

header('Content-Type: text/xml');
$xdoc = new DOMDocument;
$xdoc->recover = true;
libxml_clear_errors();

if (isset($_REQUEST['url']) && ($_REQUEST['url']!='null') && ($_REQUEST['url']!=''))
	$xdoc->Load($_REQUEST['url']);
echo $xdoc ->saveXML();	
?>
