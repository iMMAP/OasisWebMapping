Ext.ns('CONTROL');
CONTROL = function() {
	return {
		featureInfo: null, //for WMSgetFeatureInfo
		featureSelectorWindow : null,
		featureSelectorStore : null,
		featureSelectorGrid : null,
		measureControls : null,
		geoextpopup : null,
		drag : null,
		startDrag : function(feature, pixel) {
		    lastPixel = pixel;
		},	
		doDrag : function(feature, pixel) {
		    for (f in APP.hilites.selectedFeatures) {
		        if (feature != APP.hilites.selectedFeatures[f]) {
		            var res = APP.map.getResolution();
		            APP.hilites.selectedFeatures[f].geometry.move(res * (pixel.x - lastPixel.x), res * (lastPixel.y - pixel.y));
		            APP.hilites.drawFeature(APP.hilites.selectedFeatures[f]);
		        }
		    }
		    lastPixel = pixel;
		},
		endDrag : function(feature, pixel) {
		    for (f in APP.hilites.selectedFeatures) {
		        f.state = OpenLayers.State.UPDATE;
		    }
		    // var lonlat = new OpenLayers.LonLat(Ext.getCmp('ddE').value, Ext.getCmp('ddN').value);
			// lonlat.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));										
			// var icon = new OpenLayers.Icon('http://maps.google.com/mapfiles/ms/icons/red-pushpin.png');
			// APP.markers.clearMarkers();
			// APP.markers.addMarker(new OpenLayers.Marker(lonlat, icon));
		},
		initOtherControl : function(){
			
			this.drag = new OpenLayers.Control.DragFeature(APP.hilites, {
			  onStart: this.startDrag,
			  onDrag: this.doDrag,
			  onComplete: this.endDrag
			});
			
			APP.map.addControl(this.drag);
			
			var scaleBar = new OpenLayers.Control.Scale();
			scaleBar.div = document.getElementById('scaleDiv');
			APP.map.addControl(scaleBar);
			scaleBar.activate();
			var scaleLine = new OpenLayers.Control.ScaleLine(); 
			scaleLine.div = document.getElementById('scaleDiv');
			APP.map.addControl(scaleLine);
			scaleLine.activate();
					
			ctrlMousePos = new OpenLayers.Control.MousePosition({div: document.getElementById('xyInfoDiv')});
			ctrlMousePos.prefix ='Longitude, Latitude: <br/>';
			APP.map.addControl(ctrlMousePos); 
			ctrlMousePos.activate();	
		},
		toggleControl : function(element) {
            for(key in CONTROL.measureControls) {
                var control = CONTROL.measureControls[key];
                if(element.id == key) {
                    control.activate();
                } else {
                    control.deactivate();
                }
            }
        },     
        toggleGeodesic : function(element) {
            for(key in CONTROL.measureControls) {
                var control = CONTROL.measureControls[key];
                control.geodesic = element.checked;
            }
        },       
        toggleImmediate : function(element) {
            for(key in CONTROL.measureControls) {
                var control = CONTROL.measureControls[key];
                control.setImmediate(element.checked);
            }
        },
		handleMeasurements : function(event) {
			
            var geometry = event.geometry;
            geometry.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
            // console.log(geometry.getGeodesicLength());
            var units = event.units;
            var order = event.order;
            var measure = geometry.getGeodesicLength();
            measure = measure/1000;
            var element = Ext.getCmp('results');
            var out = "";
            if(order == 1) {
                out += "measure: " + measure.toFixed(3) + " " + units;
            } else {
                out += "measure: " + measure.toFixed(3) + " " + units + "<sup>2</" + "sup>";
            }
            element.setText(out);
        },
		initToolControl : function(){
			 var sketchSymbolizers = {
                "Point": {
                    pointRadius: 4,
                    graphicName: "square",
                    fillColor: "white",
                    fillOpacity: 1,
                    strokeWidth: 1,
                    strokeOpacity: 1,
                    strokeColor: "#333333"
                },
                "Line": {
                    strokeWidth: 3,
                    strokeOpacity: 1,
                    strokeColor: "#666666",
                    strokeDashstyle: "dash"
                },
                "Polygon": {
                    strokeWidth: 2,
                    strokeOpacity: 1,
                    strokeColor: "#666666",
                    fillColor: "white",
                    fillOpacity: 0.3
                }
            };
            var style = new OpenLayers.Style();
            style.addRules([
                new OpenLayers.Rule({symbolizer: sketchSymbolizers})
            ]);
            var styleMap = new OpenLayers.StyleMap({"default": style});
            var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
            renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
            this.measureControls = {
                line: new OpenLayers.Control.Measure(
                    OpenLayers.Handler.Path, {
                        persist: true,
                        handlerOptions: {
                            layerOptions: {
                                renderers: renderer,
                                styleMap: styleMap
                            }
                        }
                    }
                ),
                polygon: new OpenLayers.Control.Measure(
                    OpenLayers.Handler.Polygon, {
                        persist: true,
                        handlerOptions: {
                            layerOptions: {
                                renderers: renderer,
                                styleMap: styleMap
                            }
                        }
                    }
                )
            };
            var control;
            for(var key in this.measureControls) {
                control = this.measureControls[key];
                control.events.on({
                    "measure": this.handleMeasurements,
                    "measurepartial": this.handleMeasurements
                });
                APP.map.addControl(control);
            }
		},
		hilightFeature : function (feature) {
			APP.hilites.removeAllFeatures();	
            APP.hilites.addFeatures(feature);
            APP.hilites.setVisibility(true);
		},
		highlight_them : function(features) {
			// DATAVIEW.dataStore.clearFilter();
			// DATAVIEW.dataStore.filter("Location_ID", features.attributes.Location_ID);
			// DATAVIEW.dataStore.filters.items[0].exactMatch = true;
			APP.hilites.removeAllFeatures();	
            APP.hilites.addFeatures(features);
            APP.hilites.setVisibility(true);
            

            // this.geoextpopup = new GeoExt.Popup({
	            // title: 'Detail Info',
	            // location: features,
	            // map : APP.map,
	            // width:450,
	            // height : 310,
	            // items : [DATAVIEW.dataGrid],
	            // maximizable: true,
	            // collapsible: true
	        // });
// 	        
	        // // unselect feature when the popup
	        // // is closed
	        // this.geoextpopup.on({
	            // close: function() {
					// this.destroy();
	            // }
	        // });
	        // this.geoextpopup.show();
	        
	        DATAVIEW.getDetailData(features);
	        
	  		// var text = '';
	  		// for(var key in features.data){
	  			// if (features.data[key]!=null)
	  				// text += key+" : "+features.data[key]+"<BR>";
	  		// }	
// 
            // APP.popup = new OpenLayers.Popup.FramedCloud("chicken", 
	            // features.geometry.getBounds().getCenterLonLat(),
	            // null,
	            // text+
	            // "<BR><img src='http://chart.apis.google.com/chart?cht=p3&chs=450x100&chd=t:73,13,10,3,1&chco=80C65A,224499,FF0000&chl=Provision of Safe Water|Promotion of Hygiene|Distribution of Poultry|Distribution of Small Ruminants|Households receiving Tents'>",
            // null, true);
            // features.popup = APP.popup;
            // APP.map.addPopup(APP.popup);
	  },
		showFeature : function(feature){
			if (typeof feature != 'undefined'){
				if (APP.targetLayer != null){
					CONTROL.drag.deactivate();
					Ext.getCmp('editNewData').setDisabled(false);
					Ext.getCmp('deleteNewData').setDisabled(false);
					Ext.getCmp('saveNewData').setDisabled(true);
				}	
				DATA.datapanel.expand();
				DATA.dataEditor.setSource(feature.attributes);
				// DATA.dataEditor.setSource(DATA.setFormInput(feature.attributes));
				if (feature.type!="dataLayer"){
					this.hilightFeature(feature);
				} else {
					this.highlight_them(feature);
				}
			}	
		},
		initFeatureSelector : function(){
			
			var myData = [ ];
			
			this.featureSelectorStore = new Ext.data.ArrayStore({
		        fields: [
		           {name: 'type'}
		        ]
		    });
		    this.featureSelectorStore.loadData(myData);
		    
		    
			
			this.featureSelectorGrid = new Ext.grid.GridPanel({
		        store: this.featureSelectorStore,
		        columns: [
		            {id:'id',header: "Selected Features", sortable: true, dataIndex: 'type', width : '150'}
		        ],
		        stripeRows: true,
		        autoExpandColumn: 'id',
		        height:110,
		        listeners: {
		        	itemclick:function( grid, record, item, index, event){
		        		//record.data.CLASS_NAME = "OpenLayers.Feature.Vector";
		        		CONTROL.showFeature(record.data);
						CONTROL.featureSelectorWindow.hide();
					}
				}
		    });
		
			this.featureSelectorWindow = Ext.create("Ext.Window",{
			    title : 'Select a feature',
			    width : 150,                            
			    height: 150,
			    closable : false,                        
			    modal : true,
			    items : [this.featureSelectorGrid]
			});

		},
		onFeatureInfo: function (e) {
			//console.log(e);
			if (e.features.length > 1){
				var dt = [];
				for(var key in e.features){ 
					dt.push(e.features[key]);
				}
				this.featureSelectorStore.loadData(dt);
				//console.log(this.featureSelectorStore.getRange());
				// console.log(dt);			
				this.featureSelectorWindow.show();
			} else {
				this.showFeature(e.features[0]);	
			}		
		},		
		addWMSGetFeatureInfo : function (url) {
			this.featureInfo = new OpenLayers.Control.WMSGetFeatureInfo({
				//url: url,
				layerUrls : url,
				title: 'Identify features by clicking',
				layers: APP.map.layers,//wmsLayers
				vendorParams: {
					RADIUS: 5 
				}, 
				queryVisible: true,
				maxFeatures: 10
			});
	
			this.featureInfo.infoFormat = 'application/vnd.ogc.gml';
			this.featureInfo.events.register("getfeatureinfo", this, this.onFeatureInfo);
			APP.map.addControl(this.featureInfo);
			this.featureInfo.activate();
		},
		init: function () {
			this.addWMSGetFeatureInfo(APP.wmsUrl);
			this.initFeatureSelector();		
			this.initToolControl();	
			this.initOtherControl();	
		}		

		
	}
}();	
