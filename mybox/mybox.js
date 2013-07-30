	jQuery(function(){
	
		jQuery.fn.mybox = function(op){
		
			var defaults = {
				height		: '100',
				close_img 	: 'closelabel.gif'
			};
			
			// getting the default values if it is not set
			var op = jQuery.extend( {} , defaults , op);
			
			// retrun for each values which used
			return this.each(function(){
			
				obj = jQuery(this);
				
				val = obj.attr('href');
				
				// getting values
				
				div = '<div class="mybox">\
							<div class="mybox_popup">\
								<table>\
									<tr>\
										<td class="tl"></td>\
										<td class="b"></td>\
										<td class="tr"></td>\
									</tr>\
									<tr>\
										<td class="b"></td>\
										<td class="mybox_body">\
										  <div class="mybox_content"></div>\
										  <div class="mybox_footer" align="right">\
											<div  class="mybox_close">\
											</div>\
										  </div>\
										</td>\
										<td class="b"></td>\
									</tr>\
									<tr>\
										<td class="bl"></td>\
										<td class="b"></td>\
										<td class="br"></td>\
									</tr>\
								</table>\
							</div>\
						</div>\
						';
				
				if(val)
				{
					
										
					body_w = jQuery(window).width()/2;
					body_h = jQuery(window).height()/2;
					
					val_w = jQuery(val).width()/2;
					val_h = jQuery(val).height()/2;
					
					//appending div to the body
					jQuery('body').append(div);
					
					w = body_w - val_w;
					//h = body_h- val_h;
					h = op.height;

					// getting the id of the div value
					val_id = jQuery(val).attr('id');
					
					jQuery(val).css({
						position:'relative',
						backgroundColor:"#ffffff"
					});
					
					jQuery(".mybox_content").before(jQuery(val));
					
					jQuery(val).show().removeAttr('id');
					jQuery('.mybox').attr('id', val_id).hide().css({position:'absolute',backgroundColor:'#ffffff'});
					//top:h+'px',
					jQuery(val).css({
								left:w+'px',
								top:'10px',
								width : 'auto',
								height :'auto'
								});
				} 
				
				obj.click(function(){
						
							jQuery('html,body').animate({scrollTop: 0}, 1000,function(){
														  
								//jQuery('a[href=#show_plan]').trigger('click');													  								
								jQuery(val).fadeIn('slow');
								
														  });	
						
					});
					
					
				jQuery('.mybox_close').click(function(){
					
					jQuery(val).fadeOut('slow');
					window.location.href='index.php';
				});
				
			});
			
		} // end of main mybox
	});
	
	


