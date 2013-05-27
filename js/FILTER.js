Ext.ns('FILTER');
FILTER = function() {
	return {
		form : null,
		init: function () {
			this.form = new Ext.FormPanel({
			      frame: false,
			      width: 185,
			      border : false,
			      style: 'padding-top: 5px; padding-left: 3px;',
			      items: [
			        {
			          xtype: 'textfield',
			          name: 'to_no',
			          width: 180
			        }
			      ], 
			      buttons: [{
			            text: 'Send'
			        }]
			    });			
		}
		
	}
}();	

 