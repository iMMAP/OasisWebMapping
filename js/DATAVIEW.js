Ext.ns('DATAVIEW');
DATAVIEW = function() {
	return {
		tabPanel : null,	
		dataGrid :  null,
		dataStore : null,
		detailGrid : null,
		detailStore : null,
		floatWindow : null,
		getChartModule : function (chartData, chartField, chartFullField){	    

		    var store = Ext.create('Ext.data.JsonStore', {
		        fields: chartFullField,
		        data: chartData
		    });	
		    
		    var test = Ext.create('Ext.chart.Chart', {
			    animate: true,
	            shadow: true,
	            store: store,
	            height: 300,
	            width : 400,
	            legend: {
	                position: 'right'
	            },
	            axes: [{
	                type: 'Numeric',
	                position: 'bottom',
	                fields: chartField,
	                title: false,
	                grid: true,
	                label: {
	                    renderer: function(v) {
	                        return String(v).replace(/000000$/, 'M');
	                    }
	                },
	                roundToDecimal: false
	            }, {
	                type: 'Category',
	                position: 'left',
	                label: {
	                	renderer: function(storeItem, item) {
	                        this.font = "0px Arial, Helvetica, sans-serif";
	                    }
	                },
	                fields: ['title'],
	                title: false
	            }],
	            series: [{
	                type: 'bar',
	                axis: 'bottom',
	                gutter: 80,
	                xField: 'title',
	                yField: chartField,
	                stacked: true,
	                tips: {
	                    trackMouse: true,
	                    width: 1000,
	                    height: 50,
	                    renderer: function(storeItem, item) {
	                        this.setTitle(item.value[0] + ' : ' + String(item.value[1]));
	                    }
	                }
	            }]
	        });	
	        return test;	
		},
		getDetailData : function (features){

			Ext.Ajax.request({
				loadMask: true,
				url : 'php/getBottomGridData.php',
				params: {query:TREE.gridqry,field:1, id : features.attributes.Location_ID},
				success: function(resp) {
					// resp is the XmlHttpRequest object
					var model = Ext.decode(resp.responseText).model;
					var field = Ext.decode(resp.responseText).gridcolumn;
					var data = Ext.decode(resp.responseText).rows;
					
					var chartData = Ext.decode(resp.responseText).data;
					var chartFullField = Ext.decode(resp.responseText).fullfield;
					var chartField = Ext.decode(resp.responseText).field;

					var tempModel =  {
						extend: 'Ext.data.Model',
						fields: model
					};
					eval("Ext.define('Item',"+Ext.encode(tempModel)+");");
					
					var tabPanel = new Ext.TabPanel({
						border : false,
						layoutOnTabChange: true,
						frame : false,
						autoScroll: true, 
						margins:'0 3 3 0',
						activeTab:0,
						items:[{
				    		title: 'Grid',
				    		closable:false,
				    		autoScroll:true,
				    		frame : false,
				    		items : Ext.create('Ext.grid.Panel', {
						        height: 300,
						        autoScroll : true,
						        layout: 'fit',
				    			autowidth: true,
				    			autoHeight: true,
						        store: Ext.create('Ext.data.JsonStore', {
						        	autoLoad: true, 
							    	proxy: {
							           type: 'ajax',
							           url : 'php/getBottomGridData.php',
							           method:'POST',
							           model: 'Item',
							           extraParams:{query:TREE.gridqry, id : features.attributes.Location_ID},
							           reader: {
							               type: 'json',
							               root: 'rows'
							           },
							           fields: []
							       }
							    }),
						        stateful: true,
						        border : false,
						        viewConfig: {
						            stripeRows: true
						        },
						        columns:field
						    }),
				    		border : false
						}/*,{
				    		title: 'Chart',
				    		closable:false,
				    		autoScroll:true,
				    		border : false,
				    		items : DATAVIEW.getChartModule(chartData, chartField, chartFullField)
						}*/]
				    });
					
					this.geoextpopup = new GeoExt.Popup({
			            title: 'Detail Info',
			            location: features,
			            map : APP.map,
			            width:450,
			            height : 373,
			            resizable : false,
			            resizable : false,
			            items : [tabPanel],
			            maximizable: false,
			            collapsible: true,
			            border : false
			        });
			        
			        // unselect feature when the popup
			        // is closed
			        this.geoextpopup.on({
			            close: function() {
							this.destroy();
			            }
			        });
			        this.geoextpopup.show();
							
					// DATAVIEW.dataStore.getProxy().setModel('Item');
		    		// DATAVIEW.dataStore.proxy.extraParams = {query:TREE.gridqry, id : id};
// 
		    		// DATAVIEW.dataGrid.reconfigure(DATAVIEW.dataStore, field);
		    		// DATAVIEW.dataStore.load();
		    		// DATAVIEW.dataGrid.doLayout();
		    				
		    		// DATAVIEW.dataGrid.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
						// // row click on the grid
					// });
					

				}
			});			
		},
		init: function () {
		
		    // create the Data Store
		    Ext.define('Item', {
			    extend: 'Ext.data.Model',
			    fields: []
			});
		    
		    this.dataStore = Ext.create('Ext.data.JsonStore', {
		    	proxy: {
		           type: 'ajax',
		           url : 'php/getBottomGridData.php',
		           method:'POST',
		           model: 'Item',
		           extraParams:{},
		           reader: {
		               type: 'json',
		               root: 'rows'
		           },
		           fields: []
		       }
		    });

		    this.dataGrid = Ext.create('Ext.grid.Panel', {
		        height: 260,
		        autoScroll : true,
		        layout: 'fit',
    			autowidth: true,
    			autoHeight: true,
		        store: this.dataStore,
		        stateful: true,
		        border : false,
		        sm: Ext.create('Ext.selection.RowModel').setSelectionMode('SINGLE'),
		        viewConfig: {
		            stripeRows: true//,
		            //forceFit: true
		        },
		        columns:[]
		    });

		    this.detailStore = Ext.create('Ext.data.JsonStore', {
		    	proxy: {
		           type: 'ajax',
		           url : 'php/getBottomGridData.php',
		           method:'POST',
		           model: 'Item',
		           extraParams:{},
		           reader: {
		               type: 'json',
		               root: 'rows'
		           },
		           fields: []
		       }
		    });

		    this.detailGrid = Ext.create('Ext.grid.Panel', {
		        height: 125,
		        layout: 'fit',
    			autowidth: true,
    			autoHeight: true,
		        store: this.detailStore,
		        stateful: true,
		        border : false,
		        sm: Ext.create('Ext.selection.RowModel').setSelectionMode('SINGLE'),
		        viewConfig: {
		            stripeRows: true
		        },
		        columns:[]
		    });		
		    
			this.floatWindow = Ext.create('Ext.window.Window', {
                    width: 450,
                    height: 300,
                    title: 'Details',
                    constrainHeader: true,
                    collapsible : true,
                    frame : false,
                    closeAction:'hide',
                    items : [
                    //this.dataGrid
                    ]
            });		
            
            // this.floatWindow.on('resize', function() {
				// DATAVIEW.dataGrid.height = DATAVIEW.floatWindow.height - 40;
				// // DATAVIEW.dataGrid.width = DATAVIEW.floatWindow.width;	
				// DATAVIEW.dataGrid.doLayout();
			// });       
		    			
			// this.tabPanel = new Ext.TabPanel({
				// border : false,
				// //deferredRender:false,
				// layoutOnTabChange: true,
				// autoScroll: true, 
				// margins:'0 4 4 0',
				// activeTab:0,
				// items:[{
					// id:'tab1',
		    		// title: 'Summary',
		    		// closable:false,
		    		// autoScroll:true,
		    		// items : [this.dataGrid],
		    		// border : false
				// },{
					// id:'tab2',
		    		// title: 'Detail Info',
		    		// closable:false,
		    		// autoScroll:true,
		    		// items : [this.detailGrid],
		    		// border : false
				// }]
		    // });
		}
		
	}
}();	

 