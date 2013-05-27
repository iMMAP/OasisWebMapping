Ext.ns('FILTER');
SECURITY = function() {
	return {
		formLogin : null,
		changePassForm : null,
		showPassForm : function(){
			this.changePassForm.show();
		},
		init: function () {
			this.formLogin = new Ext.FormPanel({
		 		frame: true,
		 		border: true,
		 		buttonAlign: 'center',
		 		margins: '5 5 5 5',
		 		url: 'php/changepass.php',
		 		method: 'POST',
		 		id: 'frmLogin',
		 		labelWidth: 175,
		 		items: [{
		 			xtype: 'textfield',
		 			fieldLabel: 'Enter password',
		 			id: 'oldpass',
		 			name: 'oldpass',
		 			allowBlank: false,
		 			inputType: 'password'
		 		}, {
		 			xtype: 'textfield',
		 			fieldLabel: 'New password',
		 			id: 'newpass1',
		 			name: 'newpass1',
		 			allowBlank: false,
		 			inputType: 'password'
		 		}, {
		 			xtype: 'textfield',
		 			fieldLabel: 'Retype new password',
		 			id: 'newpass2',
		 			name: 'newpass2',
		 			allowBlank: false,
		 			inputType: 'password'
		 		}],
		 		buttons: [{
		 			text: 'Save',
		 			handler: function(){
		 				SECURITY.formLogin.getForm().submit({
		 					success: function(f, a){
		 						Ext.Msg.alert('Success', a.result.Msg);
		 						SECURITY.changePassForm.close();
		 					},
		 					failure: function(f, a){
								if (a.failureType === Ext.form.Action.CONNECT_FAILURE){
		                             Ext.Msg.alert('Failure', 'Server reported:'+a.response.status+' '+a.response.statusText);
		                        }
								if (a.failureType === Ext.form.Action.SERVER_INVALID) {
									Ext.Msg.alert('Warning', a.result.Msg);
								}	
		 						SECURITY.changePassForm.close();
		 					}
		 				});
		 			}
		 		}, {
		 			text: 'Cancel',
		 			handler: function(){
		 				SECURITY.changePassForm.close();
		 			}
		 		}]
		 	});	
		 	
		 	this.changePassForm = new Ext.Window({
		 		layout: 'fit',
		 		width: 300,
				title:'Change password',
		 		height: 170,
		 		cls: 'imgLegend',
		 		closeAction: 'close',
		 		modal: true,
		 		closable: true,
		 		collapsible: false,
		 		split: true,
		 		autoScroll: true,
		 		constrain: true,
		 		// renderTo: APP.viewport.body,
		 		defaults: {
		 			width: 180
		 		},
		 		items: this.formLogin
		 	});	
		}
		
	}
}();
