Ext.ns('LYCUSTOM');
LYCUSTOM = function() {
	return {
		form : null,
		win : null,
		styleForm : null,
		setSymbol : function(sender, file){
			// console.log(sender);
			sender.setValue(file);
		},
		pickSymbol : function(sender){
				
				Ext.define('symbol', {
			        extend: 'Ext.data.Model',
			        fields: [
			            {name: 'name'},
			            {name: 'file'}
			        ]
			    });
			    
			    var store = Ext.create('Ext.data.Store', {
				    model: 'symbol',
				    proxy: {
				        type: 'ajax',
				        url : 'php/getSymbol.php',
				        reader: {
				            type: 'json',
				            root: 'symbol'
				        }
				    },
				    autoLoad: true
				});
				
				var dataview = Ext.create('Ext.view.View', {
			        deferInitialRefresh: false,
			        store: store,
			        tpl  : Ext.create('Ext.XTemplate',
			            '<tpl for=".">',
			                '<div class="phone">',
			                    (!Ext.isIE6? '<img width="25" height="25" src="mapfile/image/{file}" />' :
			                     '<div style="width:30px;height:30px;filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(src=\'mapfile/images/{file}\',sizingMethod=\'scale\')"></div>'),
				                    '<strong>{name}</strong>',
			                    // '<span>{price:usMoney} ({reviews} Review{[values.reviews == 1 ? "" : "s"]})</span>',
			                '</div>',
			            '</tpl>'
			        ),
					listeners: {
				        itemclick: function(view,rec,item,index,eventObj) {            
				            console.log(rec.data.name); 
				            LYCUSTOM.setSymbol(sender,rec.data.name)    
				            win.close();     
				        }
				    },
			        plugins : [
			            Ext.create('Ext.ux.DataView.Animated', {
			                duration  : 550,
			                idProperty: 'id'
			            })
			        ],
			        id: 'phones',
			
			        itemSelector: 'div.phone',
			        overItemCls : 'phone-hover',
			        multiSelect : true,
			        autoScroll  : true
			   });
			   
			   
			   
			   var win = Ext.widget('window', {
	                title: 'Choose Symbol',
	                closeAction: 'destroy',
	                width: 400,
	                height: 300,
	                layout: 'fit',
	                resizable: true,
	                modal: true,
	                items: dataview,
	                tbar  : [
			            'Find symbol by name :',
			            ' ',
			            {
	                    	xtype: 'textfield',
	                        margins: '0 0 0 5',
	                        listeners: {
					            change: {
					                buffer: 70,
					                fn    : function(obj){
					                			
					                			store.suspendEvents();
										        store.clearFilter();
										        store.resumeEvents();
										        store.filter([{
										        	property     : 'name',
													value        : obj.value,
													anyMatch     : true, //optional, defaults to true
													caseSensitive: false  //optional, defaults to true
										            // fn: function(record) {
										                // return record.get('name') == "%" + obj.value + "%";
										            // }
										        }]);
										        store.sort('name', 'ASC');
					                }
					            }
					        }
	                    }
			        ]
	            }).show();
				
		},
		getStyleContainer : function(){
			var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
			var container = {
				 	xtype: 'fieldcontainer',
					fieldLabel: '',
					labelStyle: 'font-weight:bold;padding:0',
					layout: 'hbox', 
					defaultType: 'textfield', 
					fieldDefaults: { 
						labelAlign: 'top' 
					},
					items: [{
				            xtype: 'filefield',
				            flex: 3,
				            // id: 'symbolFiles',
				            emptyText: 'Select icon',
				            fieldLabel: 'Symbol',
				            afterLabelTextTpl: required,
				            name: 'symbol[]',
				            buttonText: '',
				            buttonConfig: {
				                	iconCls: 'iconUpload'
				            	}
						},{
	                        flex: 1,
	                        xtype: 'numberfield',
	                        value: 3,
					        maxValue: 99,
					        minValue: 0,
	                        name: 'size[]',
	                        margins: '0 0 0 5',
	                        fieldLabel: 'Size'
	                    },{
	                        flex: 1,
	                        xtype: 'numberfield',
	                        value: 3,
					        maxValue: 99,
					        minValue: 0,
	                        name: 'width[]',
	                        margins: '0 0 0 5',
	                        fieldLabel: 'Width'
	                    },	
	                    // Ext.create('Ext.menu.ColorPicker', {
						        // handler: function(cm, color){
						            // Ext.example.msg('Color Selected', '<span style="color:#' + color + ';">You choose {0}.</span>', color);
						        // }
						    // }),
                        {
	                    	xtype: 'textfield',
	                        flex: 2,
	                        name: 'color[]',
	                        margins: '0 0 0 5',
	                        fieldLabel: 'Color'
	                    },{
	                        flex: 2,
	                        name: 'outlinecolor[]',
	                        margins: '0 0 0 5',
	                        fieldLabel: 'Outline Color'
	                    },	Ext.create('Ext.Button', {
										iconCls: 'iconColorPicker',
	                        			margins: '18 0 0 5',
	                        			menu:[{
	                        				text: 'color',
	                        				menu: {
						                        xtype: 'colormenu',
						                        value: '000000',
						                        handler: function (obj, rgb) {
						                            Ext.Msg.alert('color: ' + rgb.toString());
						                        } // handler
						                    } // menu
	                        			},{
	                        				text: 'outline color',
	                        				menu: {
						                        xtype: 'colormenu',
						                        value: '000000',
						                        handler: function (obj, rgb) {
						                            Ext.Msg.alert('outline color: ' + rgb.toString());
						                        } // handler
						                    } // menu
	                        			}]

							})
						
						,	Ext.create('Ext.Button', {
										iconCls: 'iconAdd',
	                        			margins: '18 0 0 5',
										handler: function() {
											LYCUSTOM.styleForm.add(LYCUSTOM.getStyleContainer());
											this.setVisible(false);
										}
							})			
					]					
			};
			return container;
		},
		getFieldContainer : function(sw){
				var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
				// The data
				var lines = [
				   {"code":"line-one","name":"line-one"}//,
				   // {"code":"line-two","name":"line-two"},
				   // {"code":"line-three","name":"line-three"},
				   // {"code":"line-four","name":"line-four"},
				   // {"code":"line-five","name":"line-five"},
				   // {"code":"line-six","name":"line-six"},
				];                
				
				// Model
				Ext.define("line", {extend: "Ext.data.Model",
				    fields: [
				        {type: 'string', name: 'code'},
				        {type: 'string', name: 'name'}
				    ]
				});
				
				// The data store
				var lineStore = Ext.create('Ext.data.Store', {
				    model: 'line',
				    data: lines
				});
								
				if (sw=='point'){			
					var container = {
		                    xtype: 'fieldcontainer',
		                    fieldLabel: '',
		                    labelStyle: 'font-weight:bold;padding:0',
		                    layout: 'hbox',
		                    defaultType: 'textfield',
		
		                    fieldDefaults: {
		                        labelAlign: 'top'
		                    },
		
		                    items: [
		                    {
		                        flex: 1,
		                        name: 'stylename[]',
		                        afterLabelTextTpl: required,
		                        fieldLabel: 'Name',
		                        allowBlank: false
		                    }, {
		                        width: 30,
		                        name: 'key[]',
		                        fieldLabel: 'Key',
		                        margins: '0 0 0 5',
		                        allowBlank: false
		                    },{
		                   		flex: 2,
		                        name: 'symbol[]',
		                        afterLabelTextTpl: required,
		                        fieldLabel: 'Point Symbol',
		                        margins: '0 0 0 5',
		                        allowBlank: false
						    },
						    Ext.create('Ext.Button', {
											iconCls : 'iconUpload',
		                        			margins: '18 0 0 5',
											handler: function() {
												// console.log(this.previousSibling());
												LYCUSTOM.pickSymbol(this.previousSibling());
											}
							}),	
						    {
		                        flex: 1,
		                        xtype: 'numberfield',
		                        value: 3,
						        maxValue: 99,
						        minValue: 0,
		                        name: 'size[]',
		                        margins: '0 0 0 5',
		                        fieldLabel: 'Symbol size'
		                   },	
							Ext.create('Ext.Button', {
											iconCls : 'iconAdd',
		                        			margins: '18 0 0 5',
											handler: function() {
												// console.log(this);
												this.setVisible(false);
												LYCUSTOM.form.add(LYCUSTOM.getFieldContainer(sw));
											}
							})]
		               };
		           } else if (sw=='line'){
		           		
		           		var container = {
		                    xtype: 'fieldcontainer',
		                    fieldLabel: '',
		                    labelStyle: 'font-weight:bold;padding:0',
		                    layout: 'hbox',
		                    defaultType: 'textfield',
		
		                    fieldDefaults: {
		                        labelAlign: 'top'
		                    },
		
		                    items: [
		                    {
		                        flex: 1,
		                        name: 'stylename[]',
		                        afterLabelTextTpl: required,
		                        fieldLabel: 'Name',
		                        allowBlank: false
		                    }, {
		                        width: 30,
		                        name: 'key[]',
		                        fieldLabel: 'Key',
		                        margins: '0 0 0 5',
		                        allowBlank: false
		                    },
		                    Ext.create('Ext.form.field.ComboBox', {
		                    	flex: 2,
		                    	name: 'symbol[]',
							    displayField : 'name',
							    valueField   : 'code',
							    afterLabelTextTpl: required,
		                        fieldLabel: 'Line Symbol',
		                        margins: '0 0 0 5',
		                        allowBlank: false,
							    grow         : true,
							    store        : lineStore,
							    queryMode    : 'local',
							    listConfig: {
							        getInnerTpl: function() {
							            // here you place the images in your combo
							            var tpl = 
							                      '<img src="image/{name}.png">&nbsp;'+
							                      '{name}';
							            return tpl;
							        }
							    }
							}),
							{
						      xtype:'hidden',                       
						      name:'color[]',                       
						   },	
							Ext.create('Ext.Button', {
											// iconCls : 'iconAdd',
		                        			margins: '18 0 0 5',
											menu: [{
							                    text: 'color',
							                    menu: {
							                        xtype: 'colormenu',
							                        value: '000000',
							                        handler: function (obj, rgb) {
							                            // Ext.Msg.alert('background-color: ' + rgb.toString());
							                            // console.log(this.up('menu').floatParent.floatParent.previousSibling());
							                            this.up('menu').floatParent.floatParent.previousSibling().setValue(rgb.toString()); 
							                            console.log(this.up('menu').floatParent.floatParent.previousSibling().value);
							                        } // handler
							                    } // menu
							                }]
							}),
						    {
		                        flex: 1,
		                        xtype: 'numberfield',
		                        value: 3,
						        maxValue: 99,
						        minValue: 0,
		                        name: 'size[]',
		                        margins: '0 0 0 5',
		                        fieldLabel: 'Line width'
		                   },	
							Ext.create('Ext.Button', {
											iconCls : 'iconAdd',
		                        			margins: '18 0 0 5',
											handler: function() {
												// console.log(this);
												this.setVisible(false);
												LYCUSTOM.form.add(LYCUSTOM.getFieldContainer(sw));
											}
							})]
		               };
		           } else if (sw=='polygon'){
		           		
		           		var container = {
		                    xtype: 'fieldcontainer',
		                    fieldLabel: '',
		                    labelStyle: 'font-weight:bold;padding:0',
		                    layout: 'hbox',
		                    defaultType: 'textfield',
		
		                    fieldDefaults: {
		                        labelAlign: 'top'
		                    },
		
		                    items: [
		                    {
		                        flex: 1,
		                        name: 'stylename[]',
		                        afterLabelTextTpl: required,
		                        fieldLabel: 'Name',
		                        allowBlank: false
		                    }, {
		                        width: 30,
		                        name: 'key[]',
		                        fieldLabel: 'Key',
		                        margins: '0 0 0 5',
		                        allowBlank: false
		                    },
							{
						      xtype:'hidden',                       
						      name:'color[]',                       
						   },
							{
						      xtype:'hidden',                       
						      name:'outlinecolor[]',                       
						   },	
							Ext.create('Ext.Button', {
											// iconCls : 'iconAdd',
		                        			margins: '18 0 0 5',
											menu: [{
							                    text: 'color',
							                    menu: {
							                        xtype: 'colormenu',
							                        value: '000000',
							                        handler: function (obj, rgb) {
							                            // Ext.Msg.alert('background-color: ' + rgb.toString());
							                            console.log(this.up('menu').floatParent.floatParent.previousSibling().previousSibling());
							                            this.up('menu').floatParent.floatParent.previousSibling().previousSibling().setValue(rgb.toString()); 
							                            // console.log(this.up('menu').floatParent.floatParent.previousSibling().value);
							                        } // handler
							                    } // menu
							                },{
							                    text: 'outlinecolor',
							                    menu: {
							                        xtype: 'colormenu',
							                        value: '000000',
							                        handler: function (obj, rgb) {
							                            // Ext.Msg.alert('background-color: ' + rgb.toString());
							                            console.log(this.up('menu').floatParent.floatParent.previousSibling());
							                            this.up('menu').floatParent.floatParent.previousSibling().setValue(rgb.toString()); 
							                            // console.log(this.up('menu').floatParent.floatParent.previousSibling().value);
							                        } // handler
							                    } // menu
							                }]
							}),	
							Ext.create('Ext.Button', {
											iconCls : 'iconAdd',
		                        			margins: '18 0 0 5',
											handler: function() {
												// console.log(this);
												this.setVisible(false);
												LYCUSTOM.form.add(LYCUSTOM.getFieldContainer(sw));
											}
							})]
		               };
		           }	
		             
	               return container;
		},
		init: function () {
// 		  
		},
		openwindow: function (node) {
			// console.log(node);
			var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
    				
			this.form = Ext.widget('form', {
					fileUpload: true,
					// url:'php/test.php',
	                layout: {
	                    type: 'vbox',
	                    align: 'stretch'
	                },
	                border: false,
	                bodyPadding: 10,
	
	                fieldDefaults: {
	                    labelAlign: 'top',
	                    labelWidth: 100,
	                    labelStyle: 'font-weight:bold'
	                },
	                items: [{
	                    xtype: 'textfield',
	                    fieldLabel: 'Description',
	                    afterLabelTextTpl: required,
	                    allowBlank: false,
	                    name : 'desc'
	                },{
	                    xtype: 'textfield',
	                    fieldLabel: 'Name',
	                    afterLabelTextTpl: required,
	                    allowBlank: false,
	                    name : 'name'
	                },	new Ext.form.ComboBox({
							store: new Ext.data.ArrayStore({
						        data   : [
							        ['point'],
							        ['line'],
							        ['polygon']
							    ],
						        fields : ['name']
						    }),
							displayField: 'name',
							fieldLabel: 'Type',
							width : 100,
							valueField: 'name',
							typeAhead: true,
							mode: 'local',
							triggerAction: 'all',
							emptyText: 'choose one from the list..',
							selectOnFocus: true,
							afterLabelTextTpl: required,
	                    	allowBlank: false,
							listeners: {
								select: function(){
									this.up('form').remove(this.up('form').items.items[6]);
									this.up('form').add(LYCUSTOM.getFieldContainer(this.value));
								}
							},
	                   		name : 'type'
						}),	new Ext.form.ComboBox({
							store: new Ext.data.ArrayStore({
						        data   : [
							        ['shapefile']
							    ],
						        fields : ['name']
						    }),
							displayField: 'name',
							fieldLabel: 'Format',
							width : 100,
							valueField: 'name',
							typeAhead: true,
							mode: 'local',
							triggerAction: 'all',
							emptyText: 'choose one from the list..',
							selectOnFocus: true,
							afterLabelTextTpl: required,
	                    	allowBlank: false,
							listeners: {
								select: function(){
								}
							},
	                   		name : 'format'
						}),
					{
			            xtype: 'filefield',
			            // id: 'shpfiles',
			            emptyText: 'Select data',
			            fieldLabel: 'Data',
			            afterLabelTextTpl: required,
			            name: 'data',
			            buttonText: '',
			            buttonConfig: {
			                iconCls: 'iconUpload'
			            }
			        },{
	                    xtype: 'textfield',
	                    fieldLabel: 'Category Item',
	                    afterLabelTextTpl: required,
	                    allowBlank: true,
	                    name : 'catitem'
	                },LYCUSTOM.getFieldContainer('point')],
	
	                buttons: [{
	                    text: 'Cancel',
	                    handler: function() {
	                        this.up('form').getForm().reset();
	                        this.up('window').hide();
	                    }
	                }, {
	                    text: 'Save',
	                    handler: function() {
	                    	
	                        if (this.up('form').getForm().isValid()) {
	                        	// console.log(this.up('form').getForm());
	                            // In a real application, this would submit the form to the configured url
	                            // this.up('form').getForm().submit();
	                            this.up('form').getForm().submit({
	                            	url: 'php/userUpload.php',
	                            	waitMsg: 'Sending Data',
	                            	success: function(form, o) {
	                            		// console.log(Ext.decode(o.response.responseText).result);
	                            		var res = Ext.decode(o.response.responseText).result;
	                            		// var newNode =  Ext.create('Ext.tree.TreeNode', res);
	                            		// node.appendChild(res);
	                            		// console.log(Ext.encode(res));
	                            		// console.log(node);
	                            	}
	                            });

	                            // // this.up('form').getForm().reset();
	                            // this.up('window').hide();
	                            // // Ext.MessageBox.alert('Thank you!', 'Your inquiry has been sent. We will respond as soon as possible.');
	                            // var data = this.up('form').getForm().getFieldValues();
	                            // var results = {
	                            	// "text" 			: data.desc, 
	                            	// "layer"			: data.name,
	                            	// "layertype"		: data.type,
	                            	// "sourceformat"	: data.format,
	                            	// // "data"			: Ext.getCmp('shpfiles').value,
	                            	// "classitem"		: data.catitem,
	                            	// "category"		: {},
	                            	// "leaf"			: true,
	                            	// "checked"		: false
	                            // };
	                            // console.log(data);
	                        }
	                        // this.up('form').getForm().reset();
	                        this.up('window').hide();
	                    }
	                }]
	            });
	
	            this.win = Ext.widget('window', {
	                title: 'Add Layer',
	                closeAction: 'destroy',
	                width: 400,
	                height: 600,
	                layout: 'fit',
	                resizable: true,
	                modal: true,
	                items: this.form
	            }).show();
		        	
		}
		
	}
}();	

 