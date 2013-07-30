Ext.ns('TREE');
TREE = function() {
	return {
		store : null,
		treePanel : null,
		selectedShowCB : "UC",
		selectedDataLayerNode : null,
		gridqry : null,
		layerFilter : new Array(),
		userList : [],
		redrawLayer : function (layer){
			APP.map.getLayersByName(layer)[0].redraw(true);
		},
		sentSharedUser : function (users, layer){
			//console.log(users);
			//console.log(layer);
			Ext.Ajax.request({
				loadMask: true,
				url : 'php/sharedUser.php',
				params: {
			        users: Ext.encode(users),
			        layer: layer
			    },
				success: function(resp) {
					UTILS.showHelpTip('Data Shared', 'Layer shared successfully to another user', 7200);
				},
				failure: function(resp) {}
			});	
		},
		setUserlist : function (){
			// console.log(Ext.getCmp('textResult'));
			
			// console.log(this.userList.length);
			var text = "";
			for (var i=0;i<this.userList.length;i++){
				if (i==0) {
					text = text + this.userList[i].name;
				} else {
					text = text + ", " + this.userList[i].name;
				}	
			}
			Ext.getCmp('textResult').update(text);
			// console.log(this.userList);
		},
		addUserList : function (name, id){
			this.userList.push({id : id, name:name});
		},
		showSharedLayer : function (layer){
			 Ext.define("Post", {
		        extend: 'Ext.data.Model',
		        proxy: {
		            type: 'jsonp',
		            url : 'php/getUser.php',
		            reader: {
		                type: 'json',
		                root: 'data'//,
		                // totalProperty: 'totalCount'
		            }
		        },
		
		        fields: [
		            {name: 'id', mapping: 'id'},
		            {name: 'email', mapping: 'email'},
		            {name: 'name', mapping: 'name'},
		            {name: 'designation', mapping: 'designation'},
		            {name: 'organization', mapping: 'organization'}
		        ]
		    });
		
		    var ds = Ext.create('Ext.data.Store', {
		        pageSize: 10,
		        model: 'Post'
		    });
		
		    var panel = Ext.create('Ext.panel.Panel', {
		        title: 'Search the users',
		        width: 600,
		        bodyPadding: 2,
		        layout: 'anchor',
		
		        items: [{
		            xtype: 'combo',
		            store: ds,
		            displayField: 'title',
		            typeAhead: false,
		            hideLabel: true,
		            hideTrigger:true,
		            anchor: '100%',
		
		            listConfig: {
		                loadingText: 'Searching...',
		                emptyText: 'No matching posts found.',
		
		                // Custom rendering template for each item
		                getInnerTpl: function() {
		                    return '<a class="search-item" href="#" onClick="TREE.addUserList(\'{name}\',\'{email}\');TREE.setUserlist();">' +
		                        '<h3><span><br />{name}</span>{title}</h3>' +
		                        '{organization}' +
		                    '</a>';
		                }
		            },
		            pageSize: 10
		        }, {
		            xtype: 'component',
		            id : 'textResult',
		            style: 'margin-top:10px',
		            html: 'Live search requires a minimum of 4 characters.',
		            anchor: '100%'
		        }]	
		    });
		    
		    var win = new Ext.Window({
		 		layout: 'fit',
		 		width: 400,
				// title:'Choose User',
		 		height: 170,
		 		// cls: 'imgLegend',
		 		closeAction: 'close',
		 		modal: true,
		 		closable: true,
		 		collapsible: false,
		 		split: true,
		 		autoScroll: true,
		 		constrain: true,
		 		defaults: {
		 			width: 180
		 		},
		 		items: [panel],
		        buttons: [{
		 			text: 'Reset',
		 			handler: function(){
		 				TREE.userList = [];
		 				Ext.getCmp('textResult').update('');
		 			}
		 			},{
		 			text: 'Cancel',
		 			handler: function(){
		 				win.close();
		 			}
		 			},{
		 			text: 'Share',
		 			handler: function(){
		 				TREE.sentSharedUser(TREE.userList, layer);
		 				win.close();
		 			}
		 			}]
		 	}).show();		
		},
		getMenuLayer	: function(record,e){
					if ((e=='Base Layers') || (e=='Editable Layers') || (e=='WMS')){	
							var pre = 
		                	[{
		                		text: 'Redraw',
		                		iconCls: 'refresh',
		                		listeners : {
		                			'click': function(){
										TREE.redrawLayer(record.raw.layer);
		                			}
		                		}
		                	},{
		                		text: 'Filter',
		                		iconCls: 'iconFilter',
		                		listeners : {
		                			'click': function(){
						    
									    Ext.define('data', {
										    extend: 'Ext.data.Model',
										    fields: [
										        {name: 'text', type: 'string'}
										    ]
										});
										
										var logicStore = Ext.create('Ext.data.Store', {
										    model: 'data',
										    data : [
										        {text: '='},
										        {text: '<>'},
										        {text: '<'},
										        {text: '<='},
										        {text: '>'},
										        {text: '>='}
										    ]
										});
									    var myStore = Ext.create('Ext.data.Store', {
										    model: 'data',
										    proxy: {
										        type: 'ajax',
										        url : 'php/get-node.php?layer='+record.raw.layer,
										        reader: {
										            type: 'json',
										            root: 'data'
										        }
										    },
										    autoLoad: true
										});

									    var myForm = Ext.create('Ext.form.Panel', {
									        title: '',
									        width: 275,
									        border : false,
									        items: [{
									            xtype: 'button',
									            text: 'click me to add',
									            iconCls : 'iconAdd',
									            handler: function() {

									                myForm.add({ xtype: 'fieldcontainer',

												        // The body area will contain three text fields, arranged
												        // horizontally, separated by draggable splitters.
												        layout: 'hbox',
												        items: [
													        Ext.create('Ext.form.ComboBox', {
															    store: myStore,
															    queryMode: 'local',
															    displayField: 'text',
															    valueField: 'text',
															    width : 100
														}), {
												            xtype: 'splitter'
												        }, 
												        	Ext.create('Ext.form.ComboBox', {
															    store: logicStore,
															    queryMode: 'local',
															    displayField: 'text',
															    valueField: 'text',
															    width : 50
														}), {
												            xtype: 'splitter'
												        }, {
												            xtype: 'textfield',
															width : 100
												        }]
												    });
									            }
									        }],
									        buttons: [
									            {   
									                text: 'Save',
									                handler: function() {
									                	var x = myForm.items.items;
									                	var temp1 = new Array();
									                	for (var i=1;i<x.length;i++){
									                		var y = x[i].items.items;
									                		var temp2 = new Array();
									                		for (var l=0;l<y.length;l++){
										                		// console.log(y[l]);
										                		
										                		if (y[l].xtype!='splitter'){
										                			//console.log(y[l].value);
										                			temp2.push(y[l].value);
										                			
										                		}
										                		
										                		
									                		}
									                		temp1.push(temp2);
									                	}
									                	TREE.layerFilter[record.raw.layer] = temp1;
									                	// console.log(TREE.layerFilter);
									                	// console.log(TREE.layerFilter[record.raw.layer].length);
									                	var sentCriteria = TREE.getInsertCriteria(record.raw.layer);
									                	
									                	var selectedLayer = APP.map.getLayersByName(record.raw.layer)[0];
									                	selectedLayer.mergeNewParams({
									                		criteria : sentCriteria
									                	});
									                	win.hide();
									                	
									                }
									            },
									            {   
									                text: 'Cancel',
									                handler: function() {
									                	win.hide();
									                }
									            }
									        ]
									    });
    
		                				var win = Ext.create('widget.window', {
							                title: record.raw.layer + ' filtering window',
							                closable: true,
							                modal : true,
							                closeAction: 'destroy',
							                width: 300,
							                minWidth: 200,
							                height: 350,
							                layout: {
							                    type: 'border',
							                    padding: 5
							                },
							                items: [{
							                    // region: 'west',
							                    // title: '',
							                    // width: 200,
							                    // split: true,
							                    // collapsible: false,
							                    // floatable: false//,
							                    // //items : [tree]
							                // }, {
							                    region: 'center',
							                    title: '',
							                    width: 300,
							                    split: true,
							                    border : false,
							                    collapsible: false,
							                    floatable: false,
							                    items: [myForm]	
							                }]
							            }).show();
		                			}
		                		}
		                	},{
		                		text: 'Raise this Layer',
		                		iconCls: 'iconRaise',
		                		listeners : {
		                			'click': function(){
										var selectedLayer = APP.map.getLayersByName(record.raw.layer)[0];
										// console.log(APP.map.getLayerIndex(	selectedLayer	));
										APP.map.raiseLayer(selectedLayer, 100);
										// console.log(APP.map.getLayerIndex(	selectedLayer	));
		                			}
		                		}
		                	},{
		                		text: 'Chart Statistics',
		                		iconCls: 'charts',
		                		listeners : {
		                			'click': function(){
										var selectedLayer = APP.map.getLayersByName(record.raw.layer)[0];
										var fieldplus = new Array();
										var field = new Array();
										var realfield = new Array();
										fieldplus.push('provinces');
										for (var key in record.raw.category) {
											var manageword = key.toLowerCase();
											manageword = manageword.replace(/\ /g,"");
											fieldplus.push(manageword);
											field.push(manageword);
											realfield.push(key);
										}
										// console.log(fieldplus);
										var store = Ext.create('Ext.data.JsonStore', {
									        fields: fieldplus,
									        proxy: {
										        type: 'ajax',
										        url : 'php/getDevCharts.php?field='+field+'&realfield='+realfield+'&table='+record.raw.tableitem+'&class='+record.raw.classitem,
										        reader: {
										            type: 'json',
										            root: 'data'
										        }
										    },
										    autoLoad : true
									    });

									    var chart = Ext.create('Ext.chart.Chart',{
									            animate: true,
									            shadow: true,
									            store: store,
									            legend: {
									                position: 'right'
									            },
									            axes: [{
									                type: 'Numeric',
									                position: 'bottom',
									                fields: field,
									                title: false,
									                grid: true,
									                label: {
									                    renderer: function(v) {
									                        return String(v);
									                    }
									                }
									            }, {
									                type: 'Category',
									                position: 'left',
									                fields: ['provinces'],
									                title: false
									            }],
									            series: [{
									                type: 'bar',
									                axis: 'bottom',
									                gutter: 80,
									                xField: 'provinces',
									                yField: field,
									                stacked: true,
									                tips: {
									                    trackMouse: true,
									                    width: 65,
									                    height: 28,
									                    renderer: function(storeItem, item) {
									                        this.setTitle(String(item.value[1]));
									                    }
									                }
									            }]
									        });
										
										
										var win = Ext.create('widget.window', {
							                title: record.raw.layer + ' chart window',
							                closable: true,
							                modal : true,
							                closeAction: 'destroy',
							                width: 600,
							                minWidth: 200,
							                height: 400,
							                layout: {
							                    type: 'border',
							                    padding: 5
							                },
							                items : [{
							                    region: 'center',
							                    title: '',
							                    width: 580,
							                    split: true,
							                    border : false,
							                    collapsible: false,
							                    floatable: false,
							                    items: [chart]	,
							                     layout: {
								                    type: 'fit',
								                    padding: 5
								                },
							                }],
									        tbar: [{
									            text: 'Reload',
									            handler: function() {
									            	store.load();
									                // Ext.MessageBox.confirm('Confirm Download', 'Would you like to download the chart as an image?', function(choice){
									                    // if(choice == 'yes'){
									                        // chart.save({
									                            // type: 'image/png'
									                        // });
									                    // }
									                // });
									            }
									        }]
							            }).show();
									   
		                			}
		                		}
		                	}];	
		                	
		                	if (record.parentNode.data.text != 'DFID Projects'){
		                		pre.splice(3, 1);
		                	}	
		                	
		                	// console.log(record);
		                } else if (e=='External Data'){
		                	var pre = [{
		                		text: 'Redraw',
		                		iconCls: 'refresh',
		                		listeners : {
		                			'click': function(){
										TREE.redrawLayer(record.raw.layer);
		                			}
		                		}
		                	},Ext.create('Ext.slider.Single', {
						        // renderTo: 'custom-slider',
						        hideLabel: true,
						        width: 100,
						        increment: 30,
						        minValue: -360,
						        maxValue: -30,
						        value : 0,
						        listeners: {
				                    change: function(e,val){
				                    	// console.log(val);
				                    	var selectedlayer = APP.map.getLayersByName(record.raw.layer)[0];
				                    	selectedlayer.mergeNewParams({
									    	histLayer : -val
									    });
				                    	//console.log(-val);
				                    	selectedlayer.redraw();
				                    },
				                    scope: this
				               	},
						        tipText: function(thumb){
						        	//console.log(thumb);
						        	var val = thumb.value/60;
						        	return Ext.String.format('<b>'+(-val)+' hour(s) ago</b>', thumb.value);
						        }
						    }),{
		                		text: 'Raise this Layer',
		                		iconCls: 'iconRaise',
		                		listeners : {
		                			'click': function(){
										var selectedLayer = APP.map.getLayersByName(record.raw.layer)[0];
										// console.log(APP.map.getLayerIndex(	selectedLayer	));
										APP.map.raiseLayer(selectedLayer, 100);
										// console.log(APP.map.getLayerIndex(	selectedLayer	));
		                			}
		                		}
		                	}];	
						} else if (e=='KML'){
		                	var pre = [{
		                		text: 'Redraw',
		                		iconCls: 'refresh',
		                		listeners : {
		                			'click': function(){
										TREE.redrawLayer(record.raw.layer);
		                			}
		                		}
		                	},{
		                		text: 'Raise this Layer',
		                		iconCls: 'iconRaise',
		                		listeners : {
		                			'click': function(){
										var selectedLayer = APP.map.getLayersByName(record.raw.layer)[0];
										// console.log(APP.map.getLayerIndex(	selectedLayer	));
										APP.map.raiseLayer(selectedLayer, 100);
										// console.log(APP.map.getLayerIndex(	selectedLayer	));
		                			}
		                		}
		                	}];    
		                } else if (e=='WMS_PD'){	
		                	var pre = [{
		                		text: 'Redraw',
		                		iconCls: 'refresh',
		                		listeners : {
		                			'click': function(){
										TREE.redrawLayer(record.raw.layer);
		                			}
		                		}
		                	},{
		                		text: 'Set Date',
		                		iconCls : 'refresh',
		                		menu : Ext.create('Ext.menu.DatePicker', {
		                					value: APP.currentDate,
										    handler: function(dp, date){
										    	APP.currentDate = date;
										    	// console.log(record.raw.layer);
										    	var selectedLayer = APP.map.getLayersByName(record.raw.layer)[0];
									            console.log(selectedLayer);
									            selectedLayer.mergeNewParams({
									                layers : record.raw.layer+'_'+UTILS.getDateCode(APP.currentDate)
									             });
										    	TREE.redrawLayer(record.raw.layer);										
										    }
										})
		                	},{
		                		text: 'Raise this Layer',
		                		iconCls: 'iconRaise',
		                		listeners : {
		                			'click': function(){
										var selectedLayer = APP.map.getLayersByName(record.raw.layer)[0];
										// console.log(APP.map.getLayerIndex(	selectedLayer	));
										APP.map.raiseLayer(selectedLayer, 100);
										// console.log(APP.map.getLayerIndex(	selectedLayer	));
		                			}
		                		}
		                	}];
		                } else {
							var pre = [{
		                		text: 'Redraw',
		                		iconCls: 'refresh',
		                		listeners : {
		                			'click': function(){
										TREE.redrawLayer(record.data.layer);
		                			}
		                		}
		                	},{
		                		text: 'Filter',
		                		iconCls: 'iconFilter',
		                		listeners : {
		                			'click': function(){
						    
									    Ext.define('data', {
										    extend: 'Ext.data.Model',
										    fields: [
										        {name: 'text', type: 'string'}
										    ]
										});
										
										var logicStore = Ext.create('Ext.data.Store', {
										    model: 'data',
										    data : [
										        {text: '='},
										        {text: '<>'},
										        {text: '<'},
										        {text: '<='},
										        {text: '>'},
										        {text: '>='}
										    ]
										});
									    var myStore = Ext.create('Ext.data.Store', {
										    model: 'data',
										    proxy: {
										        type: 'ajax',
										        url : 'php/get-node.php?layer='+record.data.layer,
										        reader: {
										            type: 'json',
										            root: 'data'
										        }
										    },
										    autoLoad: true
										});

									    var myForm = Ext.create('Ext.form.Panel', {
									        title: '',
									        width: 275,
									        border : false,
									        items: [{
									            xtype: 'button',
									            text: 'click me to add',
									            iconCls : 'iconAdd',
									            handler: function() {

									                myForm.add({ xtype: 'fieldcontainer',

												        // The body area will contain three text fields, arranged
												        // horizontally, separated by draggable splitters.
												        layout: 'hbox',
												        items: [
													        Ext.create('Ext.form.ComboBox', {
															    store: myStore,
															    queryMode: 'local',
															    displayField: 'text',
															    valueField: 'text',
															    width : 100
														}), {
												            xtype: 'splitter'
												        }, 
												        	Ext.create('Ext.form.ComboBox', {
															    store: logicStore,
															    queryMode: 'local',
															    displayField: 'text',
															    valueField: 'text',
															    width : 50
														}), {
												            xtype: 'splitter'
												        }, {
												            xtype: 'textfield',
															width : 100
												        }]
												    });
									            }
									        }],
									        buttons: [
									            {   
									                text: 'Save',
									                handler: function() {
									                	var x = myForm.items.items;
									                	var temp1 = new Array();
									                	for (var i=1;i<x.length;i++){
									                		var y = x[i].items.items;
									                		var temp2 = new Array();
									                		for (var l=0;l<y.length;l++){
										                		// console.log(y[l]);
										                		
										                		if (y[l].xtype!='splitter'){
										                			//console.log(y[l].value);
										                			temp2.push(y[l].value);
										                			
										                		}
										                		
										                		
									                		}
									                		temp1.push(temp2);
									                	}
									                	TREE.layerFilter[record.data.layer] = temp1;
									                	// console.log(TREE.layerFilter);
									                	// console.log(TREE.layerFilter[record.raw.layer].length);
									                	var sentCriteria = TREE.getInsertCriteria(record.data.layer);
									                	
									                	var selectedLayer = APP.map.getLayersByName(record.data.layer)[0];
									                	selectedLayer.mergeNewParams({
									                		criteria : sentCriteria
									                	});
									                	win.hide();
									                	
									                }
									            },
									            {   
									                text: 'Cancel',
									                handler: function() {
									                	win.hide();
									                }
									            }
									        ]
									    });
    
		                				var win = Ext.create('widget.window', {
							                title: record.data.layer + ' filtering window',
							                closable: true,
							                modal : true,
							                closeAction: 'destroy',
							                width: 300,
							                minWidth: 200,
							                height: 350,
							                layout: {
							                    type: 'border',
							                    padding: 5
							                },
							                items: [{
							                    // region: 'west',
							                    // title: '',
							                    // width: 200,
							                    // split: true,
							                    // collapsible: false,
							                    // floatable: false//,
							                    // //items : [tree]
							                // }, {
							                    region: 'center',
							                    title: '',
							                    width: 300,
							                    split: true,
							                    border : false,
							                    collapsible: false,
							                    floatable: false,
							                    items: [myForm]	
							                }]
							            }).show();
		                			}
		                		}
		                	},
		                	{
		                		text: 'Share',
		                		iconCls: 'iconShare',
		                		listeners : {
		                			'click': function(){
		                				TREE.showSharedLayer(record.data.layer);
		                				TREE.setUserlist();
		                			}
		                		}
		                	},
		                	{
		                		text: 'Edit',
		                		disabled : true,
		                		iconCls: 'iconEdit',
		                		listeners : {
		                			'click': function(){alert('sorry, under construction');}
		                		}
		                	},
		                	{
		                		text: 'Delete',
		                		disabled : true,
		                		iconCls: 'iconDelete',
		                		listeners : {
		                			'click': function(){alert('sorry, under construction');}
		                		}
		                	},
		                	{
		                		text: 'Properties',
		                		disabled : true,
		                		iconCls: 'iconProperties',
		                		listeners : {
		                			'click': function(){alert('sorry, under construction');}
		                		}
		                	},{
		                		text: 'Raise this Layer',
		                		iconCls: 'iconRaise',
		                		listeners : {
		                			'click': function(){
										var selectedLayer = APP.map.getLayersByName(record.raw.layer)[0];
										// console.log(APP.map.getLayerIndex(	selectedLayer	));
										APP.map.raiseLayer(selectedLayer, 100);
										// console.log(APP.map.getLayerIndex(	selectedLayer	));
		                			}
		                		}
		                	}];	
		                					                	
		                }
		           return pre;		
		},
		getFilterCriteria : function (layer){
			var sentCriteriaPre = "";
			var sentCriteriapost = "";
			
			var sentCriteria = new Object();
			sentCriteria.pre = "";
			sentCriteria.post= "";
			
			if (TREE.layerFilter[layer]!=undefined){
				for (var i=0;i<TREE.layerFilter[layer].length;i++){
					sentCriteriaPre = sentCriteriaPre + "<AND>";
					var res = "";
					switch (TREE.layerFilter[layer][i][1])
					{
					case "=":
						res = "PropertyIsEqualTo";
						break;
					case "<>":
						res = "PropertyIsNotEqualTo";
						break;
					case "<":
						res = "PropertyIsLessThan";
						break;
					case ">":
						res = "PropertyIsGreaterThan";
						break;
					case "<=":
						res = "PropertyIsLessThanOrEqualTo";
						break;
					case ">=":
						res = "PropertyIsGreaterThanOrEqualTo";
						break;					
					}
					sentCriteriapost = sentCriteriapost + "<ogc:"+res+"><ogc:PropertyName>"+TREE.layerFilter[layer][i][0]+"</ogc:PropertyName><ogc:Literal>"+TREE.layerFilter[layer][i][2]+"</ogc:Literal></ogc:"+res+"></AND>";
					// sentCriteria = sentCriteria + " AND ('["+TREE.layerFilter[layer][i][0]+"]' "+TREE.layerFilter[layer][i][1]+" '"+TREE.layerFilter[layer][i][2]+"')";  
				}
				
				sentCriteria.pre = sentCriteriaPre;
				sentCriteria.post= sentCriteriapost;
				
			}	
			return sentCriteria;
		},		
		getInsertCriteria : function (layer){
			var sentCriteria = "";
			if (TREE.layerFilter[layer]!=undefined){
				for (var i=0;i<TREE.layerFilter[layer].length;i++){
					// console.log(TREE.layerFilter[record.raw.layer][i]);
					sentCriteria = sentCriteria + " AND ('["+TREE.layerFilter[layer][i][0]+"]' "+TREE.layerFilter[layer][i][1]+" '"+TREE.layerFilter[layer][i][2]+"')";  
				}
				return sentCriteria;
			}	
		},
		getClassRow : function(node, send){
			APP.map.getLayersByName('Print Layer')[0].setZIndex(2500);
			// console.log(APP.map.getLayersByName('Print Layer')[0].getZIndex());
			// console.log(APP.map.getLayersByName('ndh-earthquake-distribution-peak-ground-acceleration')[0].getZIndex());
			// console.log(node);
			var flag = 0;
			if (node.raw.layertype == 'WMS'){
				if (node.raw.layer =='clouds'){
					var classUrl = 'http://openweathermap.org/img/a/NT.png';
					flag=1;
				} else if(node.raw.layer =='precipitation'){	
					var classUrl = 'http://openweathermap.org/img/a/PR.png';
					flag=1;
				} else if(node.raw.layer =='pressure'){	
					var classUrl = 'http://openweathermap.org/img/a/PN.png';
					flag=1;
				} else if(node.raw.layer =='wind'){	
					var classUrl = 'http://openweathermap.org/img/a/UV.png';
					flag=1;
				} else if(node.raw.layer =='temp'){	
					var classUrl = 'http://openweathermap.org/img/a/TT.png';
					flag=1;			
				} else if(node.raw.layer =='snow'){	
					var classUrl = 'http://openweathermap.org/img/a/SN.png';
					flag=1;				
				} else {
					var classUrl = 'http://sedac.ciesin.columbia.edu/geoserver/wms?width=15&height=15&legend_options=border:false;mx:0.05;my:0.02;dx:0.2;dy:0.07;fontSize:11;bandInfo:false;&';					
					flag = 3;
					if (node.raw.wgs84only){
						flag = 2;
						var classUrl = node.raw.url;
					}
				}	
			} else if (node.raw.layer =='wbprojects001'){
				var classUrl = 'image/wbLegend.png';
				flag=1;
			} else {
				var classUrl = 'php/getmap.php?';
			}
			var tempcode = new Array();
			tempcode.push(node.raw);
			var parentUrl = window.location.href;
			parentUrl = parentUrl.substring( 0, parentUrl.lastIndexOf( "/" ) + 1);
			if (flag==0){
				OpenLayers.Request.GET({
			        url: parentUrl + "sld/"+node.raw.category,
			        params: {
			            // service: "WMS",
			            // version: "1.1.1",
			            // request: "GetStyles",
			            // SLD : "http://localhost/oasisweb_pre/sld/"+node.raw.category,
			            // LAYERS: node.raw.layer.replace(" ", "_"),
			            // LAYER : node.raw.layer.replace(" ", "_"),
			            // mapquery : APP.dataLayer.params.MAPQUERY,
			            // classitem : APP.dataLayer.params.CLASSITEM,
						// tableitem : APP.dataLayer.params.TABLEITEM,
						// GROUP : node.parentNode.raw.text
			        },
			        callback: function(response) {
			        	var tempcode = new Array();
						tempcode.push(node.raw);
						var parentUrl = window.location.href;
						parentUrl = parentUrl.substring( 0, parentUrl.lastIndexOf( "/" ) + 1);
			            var sld = new OpenLayers.Format.SLD().read(response.responseText);
			            var layer = node.raw.layer.replace(" ", "_");
			            var height = 0;
			            // console.log(node);
			            var mess = "Source : ";
			            mess += "<a href='"+node.raw.link+"' target='_blank'>"+node.raw.source+"</a><br/>";			            
			            if (sld.namedLayers[layer]){
				            var styleRow = sld.namedLayers[layer].userStyles[0];
				            
				            if (styleRow.description != null)
				            	mess += styleRow.description;
				            
				            if (node.raw.layertype == 'WMS'){				            	
				            	if (styleRow.rules.length > 1){
				            		var height = styleRow.rules.length * 17.5;	
				            	} else {
				            		var height = styleRow.rules[0].symbolizer.Raster.colorMap.length * 17.5;
				            	}	
				            } else {
				            	var height = styleRow.rules.length * 17.5;
				            }
				            
				        }    
				        UTILS.showHelpTip("Layer "+node.raw.text, mess, 150000);    
			            var style = document.createElement('style');
						style.type = 'text/css';
						style.media="all";
						if (layer!="dataLayer"){
							// style.innerHTML = "."+node.lastChild.internalId+" { background-image:url('php/getmap.php?SENTPARAMS="+Ext.encode(tempcode)+"&LAYER="+layer+"&FORMAT=image%2Fpng&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic') !important; height:"+height+"px; background-repeat:no-repeat;background-position:43px 0px;}";
							style.innerHTML = "."+node.lastChild.internalId+" { background-image:url('"+classUrl+"GROUP="+node.parentNode.raw.text+"&SLD="+parentUrl+"sld/"+node.raw.category+"&LAYER="+layer+"&FORMAT=image%2Fpng&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic') !important; height:"+height+"px; background-repeat:no-repeat;background-position:43px 0px;}";
						} else {
							style.innerHTML = send + "height:"+height+"px; background-repeat:no-repeat;background-position:60px 0px;}";
						}
						document.getElementsByTagName('head')[0].appendChild(style);
						node.expand();
			        }
			   });
			} else if (flag == 1) {
				var mess = "Source : ";
			    mess += "<a href='"+node.raw.link+"' target='_blank'>"+node.raw.source+"</a><br/>";
			    UTILS.showHelpTip("Layer "+node.raw.text, mess, 150000);
				var style = document.createElement('style');
				style.type = 'text/css';
				style.media="all";
				style.innerHTML = "."+node.lastChild.internalId+" { background-image:url('"+classUrl+"') !important; height:275px; background-repeat:no-repeat;background-position:43px 0px;}";
				document.getElementsByTagName('head')[0].appendChild(style);
				node.expand();
			} else if (flag == 1) {
				
				OpenLayers.Request.GET({
			        url: classUrl,
			        params: {
			            service: "WMS",
			            version: "1.1.1",
			            request: "GetCapabilities",
			            LAYERS: node.raw.layer.replace(" ", "_"),
			            LAYER : node.raw.layer.replace(" ", "_")
			        },
			        callback: function(response) {
			        	var mess = "Source : ";
						mess += "<a href='"+node.raw.link+"' target='_blank'>"+node.raw.source+"</a><br/>";
					    var format = new OpenLayers.Format.WMSCapabilities();
					    var capabilities = format.read(response.responseXML);
					    for (var i=0, len=capabilities.capability.layers.length; i<len; i++) {
					    	if (capabilities.capability.layers[i].name == node.raw.layer){ 	 	
					    		console.log(capabilities.capability.layers[i]);
					    		mess += "Abstract : "+capabilities.capability.layers[i].abstract+"<br/><br/>";
					    		mess += "Forecast time : <br/>";
					    		for (var t=0, tlen=capabilities.capability.layers[i].dimensions.time.values.length;t<tlen;t++){
					    			mess += capabilities.capability.layers[i].dimensions.time.values[t]+"<br/>";
					    		}
					    	}	
						}						
						UTILS.showHelpTip("Layer "+node.raw.text, mess, 150000);							
			        }
			   });
			   	var mess = "Source : ";
				mess += "<a href='"+node.raw.link+"' target='_blank'>"+node.raw.source+"</a><br/><br/>";
				mess += "get metadata ... <br/>";
				UTILS.showHelpTip("Layer "+node.raw.text, mess, 150000);	
				var style = document.createElement('style');
				style.type = 'text/css';
				style.media="all";
				style.innerHTML = "."+node.lastChild.internalId+" { background-image:url('"+classUrl+"&request=GetLegend&layers="+node.raw.layer+"') !important; height:50px; background-repeat:no-repeat;background-position:15px 0px;}";
				document.getElementsByTagName('head')[0].appendChild(style);
				node.expand();	
			} else if (flag == 3) {	
				OpenLayers.Request.GET({
			        url: classUrl,
			        params: {
			            service: "WMS",
			            version: "1.1.1",
			            request: "GetStyles",
			            LAYERS: node.raw.layer.replace(" ", "_"),
			            LAYER : node.raw.layer.replace(" ", "_"),
						GROUP : node.parentNode.raw.text
			        },
			        callback: function(response) {
			        	var tempcode = new Array();
						tempcode.push(node.raw);
						
			            var sld = new OpenLayers.Format.SLD().read(response.responseText);
			            var layer = node.raw.layer.replace(" ", "_");
			            var height = 0;
			            // console.log(node);
			            var mess = "Source : ";
			            mess += "<a href='"+node.raw.link+"' target='_blank'>"+node.raw.source+"</a><br/>";			            
			            if (sld.namedLayers[layer]){
				            var styleRow = sld.namedLayers[layer].userStyles[0];
				            
				            if (styleRow.description != null)
				            	mess += styleRow.description;
				            
				            if (node.raw.layertype == 'WMS'){				            	
				            	if (styleRow.rules.length > 1){
				            		var height = styleRow.rules.length * 17.5;	
				            	} else {
				            		var height = styleRow.rules[0].symbolizer.Raster.colorMap.length * 17.5;
				            	}	
				            } else {
				            	var height = styleRow.rules.length * 17.5;
				            }
				            
				        }    
				        UTILS.showHelpTip("Layer "+node.raw.text, mess, 150000);    
			            var style = document.createElement('style');
						style.type = 'text/css';
						style.media="all";
						if (layer!="dataLayer"){
							// style.innerHTML = "."+node.lastChild.internalId+" { background-image:url('php/getmap.php?SENTPARAMS="+Ext.encode(tempcode)+"&LAYER="+layer+"&FORMAT=image%2Fpng&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic') !important; height:"+height+"px; background-repeat:no-repeat;background-position:43px 0px;}";
							style.innerHTML = "."+node.lastChild.internalId+" { background-image:url('"+classUrl+"GROUP="+node.parentNode.raw.text+"&LAYER="+layer+"&FORMAT=image%2Fpng&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic') !important; height:"+height+"px; background-repeat:no-repeat;background-position:43px 0px;}";
						} else {
							style.innerHTML = send + "height:"+height+"px; background-repeat:no-repeat;background-position:60px 0px;}";
						}
						document.getElementsByTagName('head')[0].appendChild(style);
						node.expand();
			        }
			   });
			}	   
		},
		modifywmsgetfeatureparams : function (){
			for(var key in APP.map.controls){
				
				if (APP.map.controls[key].CLASS_NAME == "OpenLayers.Control.WMSGetFeatureInfo"){
					CONTROL.featureInfo.vendorParams = {
						mapquery : APP.dataLayer.params.MAPQUERY,
						classitem : APP.dataLayer.params.CLASSITEM,
						tableitem : APP.dataLayer.params.TABLEITEM,
						layer : 'dataLayer',
						RADIUS: 3 
					};
				}
			}
	
		},
		refreshDataLayer : function (node){
	                var temp_mapquery;
	            	var tableitem;
	            	
	            	if (TREE.selectedShowCB == "Tehsil"){
	            		temp_mapquery = node.raw.mapquery[0].tehsil;
	            		tableitem = node.raw.tableitem[0].tehsil;
	            		TREE.gridqry = node.raw.gridquery[0].tehsil;
	            	} else if (TREE.selectedShowCB == "District"){
	            		temp_mapquery = node.raw.mapquery[0].district;	
	            		tableitem = node.raw.tableitem[0].district;
	            		TREE.gridqry = node.raw.gridquery[0].district;
	            	} else if (TREE.selectedShowCB == "Province"){
	            		temp_mapquery = node.raw.mapquery[0].province;	
	            		tableitem = node.raw.tableitem[0].province;
	            		TREE.gridqry = node.raw.gridquery[0].province;
	            	} else {
	            		temp_mapquery = node.raw.mapquery[0].uc;
	            		tableitem = node.raw.tableitem[0].uc;
	            		TREE.gridqry = node.raw.gridquery[0].uc;
	            	}

	                APP.dataLayer.mergeNewParams(
	                	{
	                		mapquery : temp_mapquery, 
	                		classitem : node.raw.classitem, 
	                		tableitem : tableitem,
	                		text : node.raw.text
	                	});
	                APP.dataLayer.redraw();	
	                this.modifywmsgetfeatureparams();
	                ///node.set("qtip", "<img src='php/getmap.php?MAPQUERY="+temp_mapquery+"&CLASSITEM="+node.raw.classitem+"&TABLEITEM="+tableitem+"&LAYER=dataLayer&FORMAT=image%2Fpng&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic'>");		
	                
	                node.set('leaf', false);
	            	if (node.childNodes.length == 0){
		                node.appendChild({
		                    leaf: true,
		                    text: ''
		                });
		
		            }	
		            
		            var send = "."+node.lastChild.internalId+" { background-image:url('php/getmap.php?MAPQUERY="+temp_mapquery+"&CLASSITEM="+node.raw.classitem+"&TABLEITEM="+tableitem+"&LAYER=dataLayer&FORMAT=image%2Fpng&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic') !important; ";
		            			
					TREE.getClassRow(node, send);
					
					node.lastChild.set('iconCls', "");
					node.lastChild.set('iconCls', "legendRow");
	                node.lastChild.set('cls', node.lastChild.internalId);
	                


		},
		init: function () {
			this.store = Ext.create('Ext.data.TreeStore', {
		        proxy: {
		            type: 'ajax',
		            url: 'php/getJSON4tree.php'
		        },
		        listeners: {
		        	load: function(sender, node, records) {
			            Ext.each(records, function(record, index){
			                if (record.data.text == 'Situational Awareness' || record.data.text == 'DFID Projects'){
				                if (incidentFlag!=1){
				                	record.remove(true);
	    							TREE.store.sync();
    							// console.log(incidentFlag);
    							}
			                }
			            }, this);
			        }
		        }
		    });    
		    		    
			this.treePanel = Ext.create('Ext.tree.Panel', {
		        store: this.store,
		        rootVisible: false,
		        loaded: true,
		        border : false,
		        flex: 6,
		        scroll : false,
		        // useArrows: true,
		        viewConfig      : {
				    style           : { overflow: 'auto', overflowX: 'hidden' }
				  },
		        multiSelect: false,
  				singleSelect: true,
		        frame: false,
		        autoWidth : true,
		        //height: 300,
		        lines : true,
		        dockedItems: [{
		            xtype: 'toolbar',
		            items: [{
								xtype: 'tbfill'
						},{
		                text: 'Show : ',
		                xtype: 'tbtext'
		            },
		            	new Ext.form.ComboBox({
							store: new Ext.data.ArrayStore({
						        data   : [
							        ['Province'],
							        ['District'],
							        ['Tehsil'],
							        ['UC']
							    ],
						        fields : ['name']
						    }),
							displayField: 'name',
							width : 100,
							valueField: 'name',
							typeAhead: true,
							mode: 'local',
							triggerAction: 'all',
							emptyText: 'UC',
							selectOnFocus: true,
							listeners: {
								select: function(){
									TREE.selectedShowCB = this.value;
									if (TREE.selectedDataLayerNode!=null){
										TREE.refreshDataLayer(TREE.selectedDataLayerNode);
									}
								}
							}
						})
		            ]
		        }]
		    });
		   
		   this.treePanel.on('itemclick', function(view, record, item, index, event){	   		
		   		if ((record.data.depth == 2) && (record.parentNode.raw.group == 'Editable Layers')){
		   			Ext.getCmp('layerLbl').setValue(record.data.text);
		   			APP.targetLayer = record.raw.layer;
		   			APP.targetDBF = record.raw.tableitem,
		   			Ext.getCmp('addNewData').setDisabled(false);
		   			Ext.getCmp('editNewData').setDisabled(true);
		   			Ext.getCmp('saveNewData').setDisabled(true);
		   			Ext.getCmp('deleteNewData').setDisabled(true);
		   		} else {
		   			Ext.getCmp('layerLbl').setValue('');
		   			APP.targetLayer = null;
		   			APP.targetDBF = null,
		   			Ext.getCmp('addNewData').setDisabled(true);
		   			Ext.getCmp('editNewData').setDisabled(true);
		   			Ext.getCmp('saveNewData').setDisabled(true);
		   			Ext.getCmp('deleteNewData').setDisabled(true);
		   		}
		   });
		   this.treePanel.on('itemcontextmenu', function(view, record, item, index, event){
            	// console.log(record.parentNode);
            	// console.log(record.data);
            	if ((record.data.depth == 2) && (record.parentNode.raw.group != 'Aggregate Layers')){
	            	var x = event.browserEvent.clientX;
		            var y = event.browserEvent.clientY;
		            new Ext.menu.Menu({
		       			items: [TREE.getMenuLayer(record,record.parentNode.raw.group)]
		   			}).showAt([x, y]);
	           } else if ((record.data.depth == 1) && (record.raw.group == 'Private Layers')){
	           		var x = event.browserEvent.clientX;
		            var y = event.browserEvent.clientY;
		            new Ext.menu.Menu({
		       			items: [
		                	{
		                		text: 'Reload Layer',
		                		iconCls: 'refresh',
		                		listeners : {
		                			'click': function(){
		                				// console.log(record);
		                				Ext.Ajax.request({
											loadMask: true,
											url : 'php/getUserLayers.php',
											success: function(resp) {
												// console.log(Ext.decode(resp.responseText));
												var res = Ext.decode(resp.responseText);
												record.removeAll();
												
												
												if (res != null){
													for (var i=0;i<res.length;i++){
														var data = Ext.decode(res[i]);
														record.appendChild(data);
														// console.log(data);
														APP.map.addLayer(new OpenLayers.Layer.WMS(data.layer,
									                    	["php/getmap.php"],
									                    	// "php/getmap.php",
									                    	{
									                    		layers: data.layer,	
									                    		transparent: true,
	                    										text : data.text
									                    	}, {
									                    		isBaseLayer : false,
									                   			visibility : false,
									                   			singleTile : true
									                     })); 
	
								                     }
								                } else {
								                	UTILS.showHelpTip('Your Data is Empty', 'Upload a shapefile', 7200);
								                }     
							                     
// 							                     
											}
										});	
		                				// 
		                			}
		                		}
		                	},{
		                		text: 'Add Layer',
		                		iconCls: 'iconAddNew',
		                		listeners : {
		                			'click': function(){
		                				LYCUSTOM.openwindow(record);
		                			}
		                		}
		                	}]
		            }).showAt([x, y]);    			
	           }
			}, this);
			
		   this.treePanel.on('checkchange', function(node, checked){
            if (checked) {
                var checkedNodes = TREE.treePanel.getChecked(); // get all the checked checkbox               
                if (node.data.depth!=2){ // only for Project Layer to make sure only have one checked
	                for (i = 0; i < checkedNodes.length; i++) {
	                	if (checkedNodes[i].data.depth > 2){
	                    	checkedNodes[i].set('checked', false);
	                    }	
	                } 
	                TREE.selectedDataLayerNode = node;    	                         
					TREE.refreshDataLayer(node);
	                node.set('checked', true);	                
	                APP.map.getLayersByName("dataLayer")[0].setVisibility(true);
	            } else {    /// this is for baselayers, can have multiple boxes checked
	            	node.set('leaf', false);
	            	if (node.childNodes.length == 0){
		                node.appendChild({
		                    leaf: true,
		                    text: ''
		                });
		
		            }
		            
		            if (node.raw == undefined){
		            	node.raw = node.data;
		            }
		            if ((node.raw.layer != 'fire24') && (node.raw.layer != 'fire48') && (node.raw.layer != 'flood1') && (node.raw.layer != 'flood2')){		         	            			
						TREE.getClassRow(node);
					} else {
						var mess = "Source : ";
					    mess += "<a href='"+node.raw.link+"' target='_blank'>"+node.raw.source+"</a><br/>";
					    UTILS.showHelpTip("Layer "+node.raw.text, mess, 150000);
					}
					
					if (node.raw.layer == 'flood2'){
						var doc = document.getElementById('legendDiv');
						doc.innerHTML = '<img src="mapfile/legend/legend-MPE.png" />';
					}
					
					if ((node.raw.layer == '3hrainfallleft') || (node.raw.layer == '3hrainfallright')){
						var doc = document.getElementById('legendDiv2');
						doc.innerHTML = '<img style="height: 60px;" src="http://trmm.gsfc.nasa.gov/trmm_rain/Events/tafd_3hr_rain_dump_google_wedge.png" />';
						
					}
						
					if (node.raw.layer == 'wbprojects001' || node.raw.layer == 'ngoprojects001'){
						APP.weatherSelectControl.deactivate(); 
					}	
							
		            // console.log(APP.map.getLayersByName(node.raw.layer)[0]);			
					// console.log(APP.map);
					node.lastChild.set('iconCls', "");
					node.lastChild.set('iconCls', "legendRow");
	                node.lastChild.set('cls', node.lastChild.internalId);
	                node.set('checked', true);
	                APP.map.getLayersByName(node.raw.layer)[0].setVisibility(true);

	                //node.set("qtip", "<img src='php/getmap.php?LAYER="+node.raw.layer.replace(" ", "_")+"&FORMAT=image%2Fpng&SERVICE=WMS&VERSION=1.1.1&REQUEST=GetLegendGraphic'>");
               }
            } else { //this is for all the layers, base and data/project layers
            	if (node.raw.layer == 'flood2'){
					var doc = document.getElementById('legendDiv');
					doc.innerHTML = '';
				}
				if (node.raw.layer == 'wbprojects001' || node.raw.layer == 'ngoprojects001'){
					APP.weatherSelectControl.activate(); 
				}
				if ((node.raw.layer == '3hrainfallleft') || (node.raw.layer == '3hrainfallright')){
					var doc = document.getElementById('legendDiv2');
					doc.innerHTML = '';
				}
            	if (node.data.depth!=2){
            		APP.map.getLayersByName("dataLayer")[0].setVisibility(false);
            		TREE.selectedDataLayerNode = null; 
            		// Ext.getCmp('tabPanel').collapse();
            	} else {	
            		APP.map.getLayersByName(node.raw.layer)[0].setVisibility(false);
            	}	
            }
        });   
		    
		}
	}
}();




