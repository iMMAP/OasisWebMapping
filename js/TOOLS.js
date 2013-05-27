Ext.ns('TOOLS');
TOOLS = function() {
	return {
		toolPanel: null,
		init: function () {
		
			var formPanel = Ext.create('Ext.form.Panel', {
		        frame: false,
		        width: 340,
		        border : false,
		        bodyPadding: 5,
		        fieldDefaults: {
		            labelAlign: 'left',
		            labelWidth: 90,
		            anchor: '100%'
		        },
		
		        items: [{
		            xtype: 'radiofield',
		            name: 'type',
		            value: 'line',
		            id:'line',
		            fieldLabel: 'Measure type',
		            boxLabel: 'Distances',
		            checked : true,
		            listeners: {
		            	click : {
				        	element: 'el', //bind to the underlying el property on the panel
			            	fn: function(){CONTROL.toggleControl(this);}
			            }
					}	
		        }, {
		            xtype: 'radiofield',
		            name: 'type',
		            value: 'polygon',
		            id:'polygon',
		            fieldLabel: '',
		            labelSeparator: '',
		            hideEmptyLabel: false,
		            boxLabel: 'Area',
		            listeners: {
		            	click : {
				        	element: 'el', //bind to the underlying el property on the panel
			            	fn: function(){CONTROL.toggleControl(this);}
			            }
					}
		        }, {
		            xtype: 'checkboxfield',
		            name: 'geodesic',
		            id : 'geodesicToggle',
		            fieldLabel: 'Calculation',
		            boxLabel: 'geodesic',
		            listeners: {
		            	click : {
				        	element: 'el', //bind to the underlying el property on the panel
			            	fn: function(){CONTROL.toggleGeodesic(this);}
			            }
					}
		        }, {
		            xtype: 'checkboxfield',
		            name: 'immediate',
		            id : 'immediateToggle',
		            fieldLabel: '',
		            hideEmptyLabel: false,
		            boxLabel: 'immediate',
		            listeners: {
		            	click : {
				        	element: 'el', //bind to the underlying el property on the panel
			            	fn: function(){CONTROL.toggleImmediate(this);}
			            }
					}
		        }, {
		            xtype: 'tbtext',
		            text : 'Results : ',
		            hideEmptyLabel: false
		        }, {
		            xtype: 'tbtext',
		            id : 'results',
		            text : '',
		            hideEmptyLabel: false
		        }]
		    });
			
			this.toolPanel = Ext.create('Ext.Panel',{
				title: 'Tools',
				id: 'toolPanel',
				layout: 'fit',
				border: false,
				items: [formPanel],
				listeners: {
					'expand': function(a, b){
						CONTROL.measureControls['line'].activate();
						UTILS.showHelpTip('Tools', 'Choose measure and calculation type then draw on the map to get the measure results.', 7200);
					},
					'collapse': function(a, b){
						CONTROL.measureControls['polygon'].deactivate();
						CONTROL.measureControls['line'].deactivate();
					}
				}
			});			
	
		}
		
	}
}();	

 