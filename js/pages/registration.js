// JavaScript Document

jQuery(function(){


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

var name = jQuery("#name");
var email = jQuery("#email");
var designation = jQuery("#designation");
var organization = jQuery("#organization");
var mobile = jQuery("#mobile");


var err_txt = "";
	var err = "";
	var num = 0;
			jQuery(".sign_inp").css({border:bbclr});
	
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
			
				
				
			

			
				
			if(err == 1)
			 {
				//id  = jQuery(this).attr('id');.fadeOut(5000)
				pos = jQuery('.frmLogin').offset();
				jQuery('html,body').animate({scrollTop: pos.top}, 1000);
				 jQuery('#err').show().html(err_txt);	
				 return false;
			 }
			else
			 {
				frm_signup.submit(); 
			 }


}