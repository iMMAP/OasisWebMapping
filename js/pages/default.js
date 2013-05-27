// JavaScript Document

// for checking valid email;
var email_chk = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/; 

// validate numeric
var numeric  =  /(^-?\d\d*\.\d*$)|(^-?\d\d*$)|(^-?\.\d\d*$)/;

// validate date
var date = /^\d{1,2}(\-|\/|\.)\d{1,2}\1\d{4}$/;

// validate integer
var integer  = /(^-?\d\d*$)/;

// bgcolor for the website
var bgclr  = '#FFD39F';

// bgcolor for the top inupt
var top_bgclr  = '#C53737';

// bordercolor for the website
var bclr  = '2px solid #D82719';

// bordercolor for the website
var bbclr  = '2px solid #BFBFBF';

// bordercolor for the website
var redclr  = '2px solid #FF0000';

// bordercolor green for the website
var bclrgreen  = '2px solid #3C7E36';

// bordercolor for the text
var bgp  = '#E5DFFF';

// bordercolor for the text
var clr  = '';

/**************************************************************************/

 jQuery.noConflict();

function call()
{
 //var cn = confirm("Are you sure, you want to Delete?");
 if(confirm("Are you sure, you want to Delete?"))
	return true;
 else
	 return false;  
  
}

