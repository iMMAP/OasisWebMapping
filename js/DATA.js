Ext.ns('DATA');
DATA = function() {
	return {
		datapanel: null,
		dataEditor : null,
		setFormInput : function(obj){
			for (var key in obj){
				if (key = 'incidenttime'){
					if (obj[key]==''){
						var tmpdate = Ext.Date.format(new Date(), "m/d/Y");
						obj[key] = Ext.Date.parse(tmpdate, 'm/d/Y' );
					} else {
						// var tmpdate = Ext.Date.format(obj[key], "m/d/Y");
						// console.log(obj[key]);
						// obj[key] = Ext.Date.parse(obj[key], "Y-m-d");
					}	
				}
			}
			return obj;
		},
		init: function () {
			
			this.dataEditor = new Ext.grid.PropertyGrid({
				id: 'featPropertyGrid',
				layout: 'fit',
				//anchor:'100% 100%',
				closable: false,
				border: false,
				trackMouseOver: true,
				disabledCls: 'x-props-grid x-grid3-td-name x-grid3-cell-inner disabled',
				source: {},
				propertyNames: {},
				customEditors: {},
				 listeners: {
			      'beforeedit':{
			         fn:function(){
			            return false;
			         }
			      }// end beforeedit
			   }//end listeners
			});
			var locaccuracy = Ext.create('Ext.data.Store', {
					fields: ['locaccuracy'],
					data : [
						{"locaccuracy":"Accurate"},
						{"locaccuracy":"Estimate"}
						]
			});
			var rateinfo = Ext.create('Ext.data.Store', {
					fields: ['code', 'rateinfo'],
					data : [
						{"code":"1", "rateinfo":"Confirmed"},
						{"code":"2", "rateinfo":"Probably True"},
						{"code":"3", "rateinfo":"Possibly True"},
						{"code":"4", "rateinfo":"Doubtfully True"},
						{"code":"5", "rateinfo":"Improbable"},
						{"code":"6", "rateinfo":"Cannot Be Judged"}
						]
			});
			var sourcerate = Ext.create('Ext.data.Store', {
					fields: ['code', 'sourcerate'],
					data : [
						{"code":"A", "sourcerate":"Reliable "},
						{"code":"B", "sourcerate":"Usually Reliable"},
						{"code":"C", "sourcerate":"Fairly Reliable"},
						{"code":"D", "sourcerate":"Not Usually Reliable"},
						{"code":"E", "sourcerate":"Unreliable"},
						{"code":"F", "sourcerate":"Cannot Be Judged"}
						]
			});
			var incident = Ext.create('Ext.data.Store', {
					fields: ['incidenttype', 'incidentname'],
					data : [
						{"incidenttype":"1", "incidentname":"Army operation"},
						{"incidenttype":"2", "incidentname":"Demonstration"},
						{"incidenttype":"3", "incidentname":"Human remains find"},
						{"incidenttype":"4", "incidentname":"IED explosion"},
						{"incidenttype":"5", "incidentname":"IED find"},
						{"incidenttype":"6", "incidentname":"IED threat"},
						{"incidenttype":"7", "incidentname":"Kidnapping"},
						{"incidenttype":"8", "incidentname":"Police operation"},
						{"incidenttype":"9", "incidentname":"Rioting"},
						{"incidenttype":"10", "incidentname":"Robbery"},
						{"incidenttype":"11", "incidentname":"Security forces operation"},
						{"incidenttype":"12", "incidentname":"Shooting (criminal)"},
						{"incidenttype":"13", "incidentname":"Shooting (insurgency)"},
						{"incidenttype":"14", "incidentname":"Shooting (political)"},
						{"incidenttype":"15", "incidentname":"Vehicle hijacking"},
						{"incidenttype":"16", "incidentname":"Weapons cache find"}
						]
			});	    
			DATA.dataEditor.customRenderers = {
				URL : function( v ) {
							var res = "<a href='"+v+"' target='_blank'>"+v+"</a>";		
				            return res;
				            
				       },
				picture : function( v ) {
							// var res = "<a href='php/getMDCPhoto.php?key="+v+"' target='_blank'>link</a>";
							var url = 	"php/getMDCPhoto.php?key="+v;	
							var res = "<a href='#' onclick=UTILS.createImageViewer('"+url+"');>link</a>";
				            return res;
				            
				       }       
			};
			    
			DATA.dataEditor.customEditors = {
					// URL : Ext.create('Ext.Button', {
									    // text: 'Link to the document',  
									    // // iconCls : 'wb_button',    
									    // // enableToggle : true,
									    // // hidden : true,
									    // handler: function() {
// 									       
									       // /// here
// 											
									    // }
									// }),
					incidenttyppe : Ext.create('Ext.form.ComboBox', {                       
						store: incident,
						queryMode: 'local',
						displayField: 'incidentname',
						valueField: 'incidenttype'								                        
					}),
					sourcerate : Ext.create('Ext.form.ComboBox', {                       
						store: sourcerate,
						queryMode: 'local',
						displayField: 'sourcerate',
						valueField: 'code'								                        
					}),
					sourcerateinfo : Ext.create('Ext.form.ComboBox', {                       
						store: rateinfo,
						queryMode: 'local',
						displayField: 'rateinfo',
						valueField: 'code'								                        
					}),
					locaccuraccy : Ext.create('Ext.form.ComboBox', {                       
						store: locaccuracy,
						queryMode: 'local',
						displayField: 'locaccuracy',
						valueField: 'locaccuracy'								                        
					}),
					noaffectedperson : Ext.create('Ext.form.NumberField', {                       
						value: 0,
				        maxValue: 10000,
				        minValue: 0								                        
					}),
					nopersoninjured : Ext.create('Ext.form.NumberField', {                       
						value: 0,
				        maxValue: 10000,
				        minValue: 0								                        
					}),
					nopersonkilled : Ext.create('Ext.form.NumberField', {                       
						value: 0,
				        maxValue: 10000,
				        minValue: 0								                        
					}),
					incidenttime : Ext.create('Ext.ux.form.field.DateTime', {                       
						                        
					})
					
			};
			
			this.dataEditor.on('beforepropertychange', function(source, recordId, value, oldValue, eOpts ) { 
				if (recordId == 'gid'){
					return false;
				}
			});
			
			this.datapanel = Ext.create('Ext.Panel',{
				title: 'Properties',
				id: 'dataPanel',
				layout: 'fit',
				border: false,
				items: [this.dataEditor],
				listeners: {
					'expand': function(a, b){
						this.render();
						this.doLayout();
						UTILS.showHelpTip('Object Properties', 'Click the layer checkbox to activate or unactivate layers, Click on the map to inspect an object on map and showing in Properties panel. Click Shift+Drag mouse cursor for rectangle zoom in', 7200);
					}
				}
			});
		}
		
	}
}();	

 