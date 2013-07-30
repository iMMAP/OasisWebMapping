// JavaScript Document

jQuery(function(){

jQuery("a[rel*='mybox']").mybox();	
jQuery("a[rel*='mybox']").click(function(){
										 jQuery("#error_").text('');
										 var email = "";
										 email = jQuery('#for_email');
										 email.css({border:bbclr});
										 email.val('');
										 })

	jQuery('#for').click(function(){
			
			jQuery('#error_').show().html("<span style='color:#993300; padding-top:3px;'><strong>Processing...</strong></span>");	
			var box1 = "";
			var email ="";
			box1 = jQuery('.signup_box_1');
			email = jQuery('#for_email');
			
			box1.find('> div').css({border:''});
			
			if(email.val() == "" || !email_chk.test(email.val()) )
			{
				
				email.css({border:bclr});
				email.focus();
				 jQuery('#error_').show().html("<span style='color:#993300; padding-top:3px;'><strong>Empty or Invalid Email!</strong></span>");
				return false;
			}
			else
			{
				var email  = email.val();
							 param =  "email="+email+"&sId="+Math.random();

							jQuery.ajax({
								   type		: "GET",
								   data 	: param,
								   url 		: 'php/ajax/forget.php',
								   success 	: function(msg){
											  
													  if( msg==1 )
														{
														 jQuery('#error_').show().html("<span style='color:#993300; padding-top:3px;'><strong>Your Password has been sent to your Email Address!</strong></span>");
														}
														
													   else
														{
															jQuery('#error_').show().html("<span style='color:#993300; padding-top:3px;'><strong>"+msg+"</strong></span>");
														}
												}
								   });
		
				return false;
			}
		
		});
										 
										 
jQuery("#email").change(function(){
	 jQuery("#success").hide()
	 jQuery("#err").hide()
	 
	 jQuery("#email").css({border:bbclr});
	 var email = jQuery("#email").val();				 
	 var path = "php/ajax/chk_signup.php";
	 var param = "email="+email+"&act=email";
	 if(!email_chk.test(email) )
		  {				
					jQuery("#email").css({border:bclr});
					jQuery("#err").show().html("Email is invalid!");							
					return false;
					
		  }
		else
		 {
		
		jQuery.ajax({
				type: 	'POST',
				data: 	param,
				url:	path,
				success:function(msg){
						if(msg == 1)
						 { 
							jQuery('#email').val('');
							jQuery("#email").css({border:bclr});
							jQuery("#email").focus();
							jQuery("#err").show().html("Email address already taken!");							
							return false;						
						 }
						else
						 {
							jQuery("#success").show().html("Email address available!");	
						 }
						
						
					}
				})
	     
		 }})


	})

// prototype function

function validateForm()
{
	jQuery("#success").hide()
	 jQuery("#err").hide()
var name = jQuery("#name");
var email = jQuery("#email");
var designation = jQuery("#designation");
var organization = jQuery("#organization");
var mobile = jQuery("#mobile");


var err_txt = "";
	var err = "";
	var num = 0;
			jQuery(".registerF").css({border:bbclr});
	
		if(name.val() == "" )
				{
					num++;
					name.css({border:bclr});
					err_txt = err_txt+num+"- Name must be filled out<br>";
					err = 1;
					
				}
		if(email.val() == ""  )
				{
					num++;
					email.css({border:bclr});
					err_txt = err_txt+num+"- Email must be filled out<br>";
					err = 1;
					
				}	
			else if(!email_chk.test(email.val()) )
				{
					num++;
					email.css({border:bclr});
					err_txt = err_txt+num+"- Email is invalid<br>";
					err = 1;
					
				}	
			if(designation.val() == "" )
				{
					num++;
					designation.css({border:bclr});
					err_txt = err_txt+num+"- Designation field must be filled out<br>";
					err = 1;
					
				}

			if(organization.val() == "" )
				{
					num++;
					organization.css({border:bclr});
					err_txt = err_txt+num+"- Organization name must be filled out<br>";
					err = 1;
					
				}
			
					
				
			if(mobile.val() == "" )
				{
					num++;
					mobile.css({border:bclr});
					err_txt = err_txt+num+"- Mobile number must be filled out<br>";
					err = 1;
					
				}
			else if(!numeric.test(mobile.val()))
			 {
			 	
			 	num++;
					mobile.css({border:bclr});
					err_txt = err_txt+num+"- Invalid mobile number<br>";
					err = 1;
			 }	
				
				
			

			
				
			if(err == 1)
			 {
				//id  = jQuery(this).attr('id');.fadeOut(5000)
				pos = jQuery('#frmSignup').offset();
				jQuery('html,body').animate({scrollTop: pos.top}, 1000);
				 jQuery('#err').show().html(err_txt);	
				 return false;
			 }
			else
			 {
				jQuery("#frmSignup").submit(); 
			 }


}


function validateLogin()
{
jQuery("#success").hide()
jQuery("#err").hide()

var username = jQuery("#username");
var password = jQuery("#password");



var err_txt = "";
	var err = "";
	var num = 0;
			jQuery(".lgtfield").css({border:bbnone});
	
		if(username.val() == "" )
				{
					num++;
					username.css({border:bclr});
					err = 1;
					
				}
		if(password.val() == ""  )
				{
					num++;
					password.css({border:bclr});					
					err = 1;
					
				}	
			
			
				
			if(err == 1)
			 {
				//id  = jQuery(this).attr('id');.fadeOut(5000)
				
				 return false;
			 }
			else
			 {
				jQuery("#frm_login").submit(); 
			 }


}