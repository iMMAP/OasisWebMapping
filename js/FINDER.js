// Coordinate Converter
Ext.ns('FINDER');
FINDER = function() {
	return {
		dataPool : [],
		sentUrl : null,
		filter : [],
		layerActive : null,
		tempLayerName : null,
		finderStore : null,
		finderGrid  : null,
		finderPanel: null,
		polygonLayer : null,
		drawPolygonControl : null,
		drawCircleControl : null,
		modifyFeatureControl : null,
		radiusTool : false,
		polygonTool : false,
		popData : null,
		mergeObjects : function(objOne, objTwo) {
		        if (objOne instanceof Array) {
		            return objOne.concat(objTwo);
		        }
		        var merge = {};
		        var property;
		        for (property in objOne) {
		            merge[property] = objOne[property];
		        }
		        for (property in objTwo) {
		            merge[property] = objTwo[property];
		        }
		        return merge;
		},
		pop_serialized : function (response){
			// console.log(response);
			// console.log(response[0].data);
			// console.log(response[0].attributes);
			// console.log(JSON.stringify(response[0].attributes));
			var tempData = {"Cell Count":response[0].attributes.COUNT, "Min":response[0].attributes.MIN, "Max":response[0].attributes.MAX, "Range":response[0].attributes.RANGE, "Mean":response[0].attributes.MEAN, "Standard Deviation":response[0].attributes.STD, "Land Area km2":response[0].attributes.LANDAREA, "Mean Unit Area km2":response[0].attributes.MEANUNITAREA, "Population 2005":response[0].attributes.POPULATION05};
			FINDER.popData = tempData;
			// var tempData = {"Cell_Count":"", "Min":"", "Max":"", "Range":"", "Mean":"", "Standard_Deviation":"", "Land_Area_km2":"", "Mean_Unit_Area_km2":"", "Population_2005":""};
			// console.log(tempData);
			var temp = {'layer' : 'Gridded Population of the World (GPW), v3'};
			var data = [];
			var results = FINDER.mergeObjects(temp,{'desc' : JSON.stringify(tempData)});
			data.push(results);
			FINDER.dataPool = FINDER.mergeObjects(FINDER.dataPool,data);
			FINDER.finderStore.loadData(FINDER.dataPool);	
 		    	
		},
		serialized : function (response){

			var features = new OpenLayers.Format.GML().read(response.responseText);
			//console.log(this);

			var data = [];
			
			for (key in features){
				var temp = {'layer' : this.layer};
				var results = FINDER.mergeObjects(temp,{'desc' : JSON.stringify(features[key].attributes)});
				data.push(results);
			}
			FINDER.dataPool = FINDER.mergeObjects(FINDER.dataPool,data);	
			//FINDER.dataPool.push(data);
			FINDER.finderStore.loadData(FINDER.dataPool);
			//console.log(FINDER.dataPool);
			// console.log(Ext.getCmp('btExport'));
			Ext.getCmp('btExport').setDisabled(false);
		    	
		},
		setFinderEvent : function (obj, val){
			FINDER.polygonLayer.destroyFeatures();
			if(obj.checked == true){
				if (obj.id=='radius'){
					UTILS.showHelpTip('Resource Finder tips', 'Pick a position on the map as the center point of radius', 7200);
					FINDER.radiusTool = true;
					FINDER.polygonTool = false;
				} else {
					UTILS.showHelpTip('Resource Finder tips', 'Draw a polygon on the map', 7200);
					FINDER.polygonTool = true;					
					FINDER.radiusTool = false;
				}	
			}	
		},
		drawRadius : function (origin, clientx, clienty){
			var radius = 0;
			
			new Ext.Window({
				x: clientx,
				y: clienty,
				title	:'Set radius',
				id: 'radiusPromt',
				width: 100,
				height: 40,
				layout: 'fit',
				resizable: false,
				items: new Ext.FormPanel({
					id: 'radiusForm',
					border: false,
					padding: 5,
					layout: 'column',
					items: [
						new Ext.form.NumberField({
							name: 'radiusField',
							fieldLabel: 'Radius',
							hideLabel: true,
							value: 10,
							width: 80,
							style: {
						    	marginRight: '10px'
						    }
						}),
						new Ext.Button({
							text: 'OK',
							handler: function () {
								radius = Ext.getCmp('radiusForm').getForm().findField('radiusField').getValue() * 1000;
								Ext.getCmp('radiusPromt').close();

								var circleFeature = new OpenLayers.Feature.Vector(OpenLayers.Geometry.Polygon.createRegularPolygon(
								new OpenLayers.Geometry.Point(origin.lon, origin.lat), 
										radius, 
										40
									),
									null,
									null
								);
								
								
								FINDER.polygonLayer.addFeatures(circleFeature);
								FINDER.modifyFeatureControl.mode = OpenLayers.Control.ModifyFeature.RESIZE | OpenLayers.Control.ModifyFeature.DRAG;	
								FINDER.modifyFeatureControl.activate();
								
								
							}
						})
					]
				})
			}).show();			
		},
		init: function () {
			this.polygonLayer = new OpenLayers.Layer.Vector("Draw Area");
			APP.map.addLayers([this.polygonLayer]);
			this.drawPolygonControl = new OpenLayers.Control.DrawFeature(
				this.polygonLayer, 
				OpenLayers.Handler.Polygon, {
					featureAdded: function(feature) {
						FINDER.modifyFeatureControl.mode = OpenLayers.Control.ModifyFeature.RESHAPE | OpenLayers.Control.ModifyFeature.DRAG;
						this.deactivate();
						FINDER.modifyFeatureControl.activate();
					}
			});
			
			this.drawCircleControl = new OpenLayers.Control.DrawFeature(
				this.polygonLayer, 
				OpenLayers.Handler.RegularPolygon, {
					handlerOptions: {
						sides: 40
					},
					featureAdded: function(feature) {
						FINDER.modifyFeatureControl.mode = OpenLayers.Control.ModifyFeature.RESIZE | OpenLayers.Control.ModifyFeature.DRAG;
						this.deactivate();
						FINDER.modifyFeatureControl.activate();
					}
			});
			
			this.modifyFeatureControl = new OpenLayers.Control.ModifyFeature(this.polygonLayer);
			APP.map.addControl(this.modifyFeatureControl);
			APP.map.addControl(this.drawPolygonControl);
			
			
		 	var fsf = Ext.create('Ext.form.Panel', {
		        bodyStyle:'padding:5px 5px 0',
		        id: 'finderInnerPanel',
		        border : false,
		        autoScroll : true,
		        //width: 350,
		        fieldDefaults: {
		            msgTarget: 'side',
		            labelWidth: 75
		        },
		        defaults: {
		            anchor: '95%'
		        },
		
		        items: [{
		            xtype:'fieldset',
		            //checkboxToggle:true,
		            title: 'Geo Scope',
		            defaultType: 'textfield',
		            //collapsed: true,
		            layout: 'anchor',
		            defaults: {
		                anchor: '100%'
		            },
		            items :[{
			            xtype: 'radiofield',
			            id : 'radius',
			            name: 'geoscope',
			            value: 'radius',
			            fieldLabel: '',
			            boxLabel: 'Radius',
			            handler: FINDER.setFinderEvent
			        }, {
			            xtype: 'radiofield',
			            name: 'geoscope',
			            id : 'polygon1',
			            value: 'polygon',
			            fieldLabel: '',
			            boxLabel: 'Free Form',
			            handler: FINDER.setFinderEvent
			        }]
		        },{
		        	xtype: 'toolbar',
		        	frame :  false,
		            items: [{
								xtype: 'tbfill'
							},{
		                		text: 'Search',
		                		iconCls : 'iconSearch',
		                		listeners: {
									click: function(){
										//console.log(FINDER.polygonLayer.features[0].geometry.getBounds());
										FINDER.dataPool = [];
										this.layerActive = PRINT.getActiveLayersName();


							            var WFS = new OpenLayers.Layer.WFS( "test",
							                "php/getmap.php?",
											{ typename: 'Aerodromes' },
											{ 
												extractAttributes: true, 
												projection : new OpenLayers.Projection("EPSG:900913") 
											}
										);										
										
										var gg = FINDER.polygonLayer.features[0].geometry.clone();
										gg.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
										
										// var writer4 = new OpenLayers.Format.GML();
										// var gml4 = writer4.buildGeometryNode(gg);
										// console.log(gml4);	
									    // var gml4wps = OpenLayers.Format.XML.prototype.write.apply(this, [gml4]);
										// console.log(gml4wps);
										
										var xmltext = '<wps:Execute service="WPS" version="1.0.0" xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:ows="http://www.opengis.net/ows/1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://geoserver.itc.nl:8080/wps/schemas/wps/1.0.0/wpsExecute_request.xsd">';
										xmltext += '<ows:Identifier>org.ciesin.gis.wps.algorithms.PopStats</ows:Identifier>';
										xmltext += '<wps:DataInputs>';
										xmltext += '<wps:Input>';
										xmltext += '<ows:Identifier>data</ows:Identifier>';
										xmltext += '<wps:Data>';
										xmltext += '<wps:ComplexData>';
										xmltext += '<GMLPacket xmlns="http://www.opengis.net/examples/packet" xmlns:gml="http://www.opengis.net/gml">';
										xmltext += '<gml:description>This is a test polygon.</gml:description>';
										xmltext += '<gml:name>TestPolygon</gml:name>';
										xmltext += '<packetMember>';
										xmltext += '<StaticFeature>';
										xmltext += '<gml:polygonProperty>';
										
										xmltext += '<gml:Polygon srsDimensions="2" srsName="um:ogc:def:crs:EPSG:6.6:4326">';
										xmltext += '<gml:outerBoundaryIs>';
										xmltext += '<gml:LinearRing>';
										
										
										for (var node in gg.components[0].components){	
											xmltext += '<gml:coord><gml:X>'+gg.components[0].components[node].x+'</gml:X><gml:Y>'+gg.components[0].components[node].y+'</gml:Y></gml:coord>';
										}	
										// xmltext += gml4wps.replace('xmlns:gml="http://www.opengis.net/gml"', 'srsDimensions="2" srsName="um:ogc:def:crs:EPSG:6.6:4326"');
										// xmltext += '<gml:Polygon srsDimensions="2" srsName="um:ogc:def:crs:EPSG:6.6:4326"><gml:outerBoundaryIs><gml:LinearRing><gml:coord><gml:X>17.138671875</gml:X><gml:Y>16.102115623322454</gml:Y></gml:coord><gml:coord><gml:X>20.654296875</gml:X><gml:Y>5.061761321824827</gml:Y></gml:coord><gml:coord><gml:X>38.056640625</gml:X><gml:Y>25.29768131196427</gml:Y></gml:coord><gml:coord><gml:X>9.931640625</gml:X><gml:Y>33.26012492489797</gml:Y></gml:coord><gml:coord><gml:X>4.833984375</gml:X><gml:Y>26.876346759424234</gml:Y></gml:coord><gml:coord><gml:X>4.833984375</gml:X><gml:Y>26.876346759424234</gml:Y></gml:coord><gml:coord><gml:X>4.833984375</gml:X><gml:Y>26.876346759424234</gml:Y></gml:coord><gml:coord><gml:X>17.138671875</gml:X><gml:Y>16.102115623322454</gml:Y></gml:coord></gml:LinearRing></gml:outerBoundaryIs><gml:innerBoundaryIs></gml:innerBoundaryIs></gml:Polygon>';										
										
										xmltext += '</gml:LinearRing></gml:outerBoundaryIs>';
										xmltext += '<gml:innerBoundaryIs></gml:innerBoundaryIs>';
										xmltext += '</gml:Polygon>';
										
										xmltext += '</gml:polygonProperty>';
										xmltext += '</StaticFeature>';
										xmltext += '</packetMember>';
										xmltext += '</GMLPacket>';
										xmltext += '</wps:ComplexData>';
										xmltext += '</wps:Data>';
										xmltext += '</wps:Input>';
										xmltext += '</wps:DataInputs>';
										xmltext += '<wps:ResponseForm>';
										xmltext += '<wps:ResponseDocument storeExecuteResponse="false">';
										xmltext += '<wps:Output asReference="false">';
										xmltext += '<ows:Identifier>result</ows:Identifier>';
										xmltext += '</wps:Output>';
										xmltext += '</wps:ResponseDocument>';
										xmltext += '</wps:ResponseForm>';
										xmltext += '</wps:Execute>';
										
										var request = new OpenLayers.Request.POST({
									        url: 'http://sedac.ciesin.columbia.edu/wps/WebProcessingService',
									        data: xmltext,
									        headers: {
									            "Content-Type": "text/xml;charset=utf-8"
									        },
									        callback: function (response) {
									            //read the response from GeoServer
									            var gmlParser = new OpenLayers.Format.GML();
									            var xmlSum = gmlParser.read(response.responseText);
									            FINDER.pop_serialized(xmlSum);
									        },
									        failure: function (response) {
									            alert("Something went wrong in the request");
									        }
									    });
										
										FINDER.sentUrl = "";
										FINDER.filter = [];
										for (var key in this.layerActive){	
											FINDER.tempLayerName = this.layerActive[key];

									        var writer = new OpenLayers.Format.GML();
									        var gml = writer.buildGeometryNode(FINDER.polygonLayer.features[0].geometry);	
									        var gml2 = OpenLayers.Format.XML.prototype.write.apply(this, [gml]);
									        //console.log(gml2.replace('xmlns:gml="http://www.opengis.net/gml"', 'srsName="EPSG:900913"'));
									        
									        var receivedFilter = TREE.getFilterCriteria(FINDER.tempLayerName);
									        								
										    var url = WFS.getFullRequestString({
										                REQUEST: "GetFeature",
										                EXCEPTIONS: "application/vnd.ogc.se_xml",
										                INFO_FORMAT: 'text/plain',
										                QUERY_LAYERS: FINDER.tempLayerName,
										                TYPENAME: FINDER.tempLayerName,
										                FEATURE_COUNT: 10,
										                FILTER : "<ogc:Filter>"+receivedFilter.pre+"<Intersects><ogc:PropertyName>geom</ogc:PropertyName>"+gml2.replace('xmlns:gml="http://www.opengis.net/gml"', 'srsName="EPSG:900913"')+"</Intersects>"+receivedFilter.post+"</ogc:Filter>"
									        			},
										              "php/getmap.php?");
	              
										    var sent = {'layer' : FINDER.tempLayerName};  
											FINDER.sentUrl= url;
											FINDER.filter.push({'layer':FINDER.tempLayerName, 'url':"<ogc:Filter>"+receivedFilter.pre+"<Intersects><ogc:PropertyName>geom</ogc:PropertyName>"+gml2.replace('xmlns:gml="http://www.opengis.net/gml"', 'srsName="EPSG:900913"')+"</Intersects>"+receivedFilter.post+"</ogc:Filter>"});
										    OpenLayers.loadURL(url, '', sent, FINDER.serialized);
										}
										FINDER.filter=Ext.encode(FINDER.filter);
										var scale = APP.map.getScale();
										var scaleData = PRINT.scaleStore.getRange();
										var scaleRange = new Array();
										for(var key in scaleData){
											scaleRange.push(scaleData[key].data.value);
										}
										
										scale = PRINT.getClosestValues(scaleRange, scale);
										// APP.map.zoomTo(PRINT.getGoogleScale(scale));
										APP.map.setCenter(new OpenLayers.LonLat(FINDER.polygonLayer.features[0].geometry.getCentroid().x, FINDER.polygonLayer.features[0].geometry.getCentroid().y), PRINT.getGoogleScale(scale));
									}
								}		
		            		},{
		            			text: 'Download PDF',
		            			id : 'btExport',
		            			iconCls : 'iconPrint',
		            			disabled : true,
		                		listeners: {
									click: function(){
										PRINT.printLoad.show();
										// PRINT.printLoad.show();	
										// PRINT.printLoad.msg = 'generate pdf...';
										// var printBody = Ext.getBody();
										// var printFrame = printBody.createChild({
											// tag:'iframe',
											// cls:'x-hidden',
											// id:'iframePrint',
											// name:'iframePrint'
										// });
// 												
										// var printForm = printBody.createChild({
											// tag:'form',
											// cls:'x-hidden',
											// id:'formPrint',
											// action:'php/resourceExport.php?activelayer='+PRINT.getActiveLayersGroup(),//+'&filterSent='+FINDER.filter,
											// method:'post',
											// target:'iframePrint'
										// });
// 										
										// //no idea why the json string is not being sent - have to re-do queries in pdf
										// printForm.appendChild(printBody.createChild({tag:'input', type:'hidden', name:'sentUrl', value: FINDER.sentUrl}));
										// // printForm.appendChild(printBody.createChild({tag:'input', type:'hidden', name:'filterSent', value: Ext.encode(FINDER.filter)}));
										// printForm.dom.submit();
										// PRINT.printLoad.hide();	
										
										var scale = APP.map.getScale();	
										var scaleData = PRINT.scaleStore.getRange();
										var scaleRange = new Array();
										for(var key in scaleData){
											scaleRange.push(scaleData[key].data.value);
										}
										
										scale = PRINT.getClosestValues(scaleRange, scale/2);			
										var center = APP.map.getCenter();
										center = center.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
										var bounds = APP.map.getExtent();
										bounds = bounds.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
										// console.log(FINDER.polygonLayer.features[0].geometry.toString());
										var tempGeom = FINDER.polygonLayer.features[0].geometry.clone();
										tempGeom.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
										// console.log(tempGeom);
										var filterShape = tempGeom.toString();
										
										PRINT.doPrintMapCustom(PRINT.getGoogleScale(scale), "A4 Landscape", center, bounds, scale, 'stat', filterShape);		
									}
								}	
		            		},{
		            			text: 'Clear',
		            			id : 'btClear',
		            			iconCls : 'iconClear',
		            			disabled : false,
		                		listeners: {
									click: function(){
										FINDER.polygonLayer.destroyFeatures();
										FINDER.finderStore.removeAll();
										console.log(FINDER.finderStore);
									}
								}
							}]
		        }]
		    });	
		    		
			this.finderPanel = Ext.create('Ext.Panel',{
				title: 'Resource Finder',
				id: 'finderPanel',
				layout: 'fit',
				border: false,
				items: [fsf],
				listeners: {
					'expand': function(a, b){
						UTILS.showHelpTip('Resource Finder', 'Choose radius/free form geoscope, draw on the map then click proceed to get available resources from active layers.', 7200);
					},
					'collapse': function(a, b){
						FINDER.polygonLayer.destroyFeatures();
						FINDER.drawPolygonControl.deactivate();
						FINDER.polygonTool = false;	
						FINDER.radiusTool = false;
						FINDER.modifyFeatureControl.deactivate();
					}
				}
			});
	
			var tempModel =  {
						extend: 'Ext.data.Model',
						fields: ['layer', 'dec', 'geom']
					};
					
			eval("Ext.define('Item',"+Ext.encode(tempModel)+");");
			
			this.finderStore = Ext.create('Ext.data.Store', {
	                model: 'Item',
	                autoLoad : true,
	                groupField: 'layer',
	                proxy: {
		                type: 'memory',
		                data: [],
		                reader: {
		                    type : 'json'
		                }
		            }
	           });
			var groupingFeature = Ext.create('Ext.grid.feature.Grouping',{
		        groupHeaderTpl: 'Layer: {name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})',
		        hideGroupedHeader: true
		    });
			this.finderGrid = Ext.create('Ext.grid.Panel', {
				features: [groupingFeature],
		        autoScroll : true,
		        id : 'finderGrid',
		        layout: 'fit',
    			//height : 250,
    			anchor: '95%',
		        store: this.finderStore,
		        stateful: true,
		        border : false,
		        sm: Ext.create('Ext.selection.RowModel').setSelectionMode('SINGLE'),
		        viewConfig: {
		            stripeRows: true
		        },
		        columns: [
		        	{header : 'Layers', dataIndex : 'layer'},
		        	{header : 'Description', dataIndex : 'desc', renderer: columnWrap},
		        	{header : 'Geometry', dataIndex : 'geom', hidden : true, flex:1}
		        ]
		    });
		    function columnWrap(val){
		    	var data = Ext.decode(val);
		    	var results = "";
		    	// console.log(data);
		    	for (var singleObject in data) {
		    		// console.log(singleObject + " : " + data[singleObject] + "<BR>");
		    		if (data[singleObject]!=null){
		    			results = results + singleObject + " : " + data[singleObject] + "<BR>";
		    		}
				}	
				
			    return '<div style="white-space:normal !important;">'+ results+'</div>';
			}

		    this.finderGrid.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
				console.log(selectedRecord);
			});
						
			Ext.getCmp('finderInnerPanel').add(this.finderGrid);
		}
		
	}
}();	

 