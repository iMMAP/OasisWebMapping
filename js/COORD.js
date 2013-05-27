// Coordinate Converter
Ext.ns('COORD');
COORD = function() {
	return {
		coordPanel: null,
		coordState : 'DD2DMS',
		dd2dms : function (dd){
			var mm, ss, ff; //dd = whole degrees, mm = minutes, ss = seconds ff + fractional part
			var test = '30.2561';
			ff = dd.split('.');
			ff = '0.' + ff[1];
			dd = parseInt(dd);
			mm = 60 * parseFloat(ff);
			ff = mm.toString().split('.');
			ff = '0.' + ff[1];
			mm = parseInt(mm);
			ss = 60*parseFloat(ff);
			ss = parseFloat(ss);
			
			return {'dd':dd,'mm':mm,'ss':ss}; 
		},
		dms2dd : function(ddN, mmN, ssN, ddE, mmE, ssE){
			var n, e;
			//var ddff = parseFloat(Ext.getCmp('ddN'));
			n = parseInt(ddN) + (parseInt(mmN)/60) + (parseFloat(ssN)/3600);
			e = parseInt(ddE) + (parseInt(mmE)/60) + (parseFloat(ssE)/3600);
			
			return {'N':n,'E':e}; 
		},		
		init: function () {
			
	
			
			this.coordPanel = Ext.create('Ext.Panel',{
				title: 'Coordinate Converter',
				id: 'coordPanel',
				layout: 'fit',
				border: false,
				items: [{
					xtype: 'form',
					height: 'auto',
					padding: 5,
					border: false,
					width: 337,
	//				bodyStyle:'padding:4px 4px 4px 4px',
					items:[
					    {
					    	layout:'absolute',
					    	xtype:'fieldset',
					    	height:60,
					    	defaults:{
								layout:'form',
								border:false
							},
							title:'Decimal Degrees',
					    	items: [
					    	    {
									x:5,
									y:0,
					    	    	xtype:'label',
									html:'Latitude:',
									width: 75
								},
								{
									x:55,
									y:0,
					    	    	xtype:'textfield',
					    	    	disabledClass: '',
					    	    	maxLength: 10,
					    	    	//vtype:'decdeg',
					    	    	//maskRe:/[-]?[0-9]*[.]{0,1}[0-9]{0,8}/,
					    	    	id: 'ddN',
									width: 60
									
								},
								{
									x:140,
									y:0,
					    	    	xtype:'label',
									html:'Longitude:',
									width: 75
								},
								{
									x:195,
									y:0,
									xtype:'textfield',
									disabledClass: '',
									maxLength: 10,
									id: 'ddE',
									width: 60
								}
					    	]
						},
						{
							layout: 'absolute',
							xtype:'fieldset',
							height:95,
							defaults:{
								labelWidth:50,
								layout:'form',
								border:false,
								style: {
	//					            marginBottom: '1.5em'
						        }
							},
							title: 'Degrees Minutes Seconds coordinate',
							items:[
								{
									x:5,
									y:5,
									xtype: 'label',
									html: 'Latitude:',
									width:75
			 					},
								{
									x:65,
									y:5,
									xtype:'textfield',
									disabledClass: '',
									id: 'dmsND',
									//disabled: true,
									maxLength: 2,
									width: 30
								},
								{
									x:95,
									y:5,
									xtype: 'label',
									html: '&nbsp;&deg;&nbsp;&nbsp;'
								},
								{
									x:110,
									y:5,
									width:30,
									maxLength: 2,
									id: 'dmsNM',
									//disabled: true,
									disabledClass: '',
								    xtype:'textfield'  
								},
								{
									x:140,
									y:5,
									xtype: 'label',
									html: '&nbsp;\'&nbsp;&nbsp;'
								},
								{
									x:155,
									y:5,
									width:40,
									maxLength: 5,
									id: 'dmsNS',
									//disabled: true,
									disabledClass: '',
								    xtype:'textfield'   
								},
								{
									x:195,
									y:5,
									xtype: 'label',
									html: '&nbsp;\'\''
								},
								{
									x:5,
									y:35,
									xtype: 'label',
									html: 'Longitude:',
									width:75
			 					},
								{
									x:65,
									y:35,
									xtype:'textfield',
									//disabled: true,
									id: 'dmsED',
									disabledClass: '',
									maxLength: 3,
									width: 30
								},
								{
									x:95,
									y:35,
									xtype: 'label',
									html: '&nbsp;&deg;&nbsp;&nbsp;'
								},
								{
									x:110,
									y:35,
									width:30,
									maxLength: 2,
									//disabled: true,
									id: 'dmsEM',
									disabledClass: '',
								    xtype:'textfield'  
								},
								{
									x:140,
									y:35,
									xtype: 'label',
									html: '&nbsp;\'&nbsp;&nbsp;'
								},
								{
									x:155,
									y:35,
									width:40,
									maxLength: 5,
									//disabled: true,
									id: 'dmsES',
									disabledClass: '',
								    xtype:'textfield'   
								},
								{
									x:195,
									y:35,
									xtype: 'label',
									html: '&nbsp;\'\''
								}
							]
						},
						{
					        text: 'Convert',
					        xtype: 'button',
					        style: {
					            marginBottom: '1em',
					            marginLeft: '10em'
					        },
					        listeners: 
					             {
					            	'click': function(comp, evt){
					            		if (COORD.coordState == 'DD2DMS'){
					            			var dms = COORD.dd2dms(Ext.getCmp('ddN').getValue());
						            		Ext.getCmp('dmsND').setValue(dms.dd);
						            		Ext.getCmp('dmsNM').setValue(dms.mm);
						            		Ext.getCmp('dmsNS').setValue(dms.ss);
						            		
						            		dms = COORD.dd2dms(Ext.getCmp('ddE').getValue());
						            		Ext.getCmp('dmsED').setValue(dms.dd);
						            		Ext.getCmp('dmsEM').setValue(dms.mm);
						            		Ext.getCmp('dmsES').setValue(dms.ss);
					            		}else{
					            			var dd = COORD.dms2dd(Ext.getCmp('dmsND').getValue(), Ext.getCmp('dmsNM').getValue(), Ext.getCmp('dmsNS').getValue(), Ext.getCmp('dmsED').getValue(),Ext.getCmp('dmsEM').getValue(),Ext.getCmp('dmsES').getValue());
					            			Ext.getCmp('ddN').setValue(dd.N);
					            			Ext.getCmp('ddE').setValue(dd.E);
					            		}
					            		
					            	}
					             }
					    },
					    {
				            xtype: 'radiogroup',
				            hideLabel:true,
				            height: 60,
				            columns: 1,
				            style: {
					            marginLeft: '1.25em'
					        },
				            itemCls: 'x-check-group-alt',
				            items: [
				                {
				                	boxLabel: 'Decimal Degree to Degree Minute Second',
				                	name: 'opt',
				                	inputValue:1,
				                	checked: true,
				                	listeners: {
				                		'change': function(a,b){
				                			if (b){
				                				COORD.coordState = 'DD2DMS';
				                			}
					                	}
					                }
					            },
					            {
					            	boxLabel: 'Degree Minute Second to Decimal Degree',
					            	name: 'opt',
					            	inputValue:2,
					            	listeners: {
				                		'change': function(a,b){
							            	if (b){
							            		COORD.coordState = 'DMS2DD';
					            			}
					                	}
					                }
					            }
				            ]
				        },
						{
							xtype:'label',
							html:'<b>Examples:</b><br><p>Decimal Degrees could be something like <br><b>45.7324</b> N <b>34.5315</b> E</p><br><p>For Degrees Minutes Seconds coordinates you can fill e.g. <br><b>45</b> &deg; <b>23</b> \' <b>12</b> \'\'</p>'
						}
						]//end columns
			    }],
				listeners: {
					'expand': function(a, b){
						UTILS.showHelpTip('Coordinate Converter', 'Convert from decimal to degree or degree to decimal', 7200);
					},
					'collapse': function(a, b){

					}
				}
			});
	
	
		}
		
	}
}();	

 