Ext.BLANK_IMAGE_URL = './lib/ext-4.0.7-gpl/resources/themes/images/gray/tree/s.gif';
OpenLayers.ProxyHost = "../cgi-bin/proxy.cgi?url=";//windows_path
Ext.ns('APP');


APP = function() {
	return {
		layersObject : null,
		activeBaseLayer : null,
		tileDefault : null,
		markers : null,
		vector : null,
		tileOSM : null,
		themeCB : null,
		map : null,
		ghyb : null,
		gphy : null,
		gstr : null,
		gsat : null,
		grss : null,
		arcstreet : null,
		arctopo : null,
		arcimage : null,
		// fire24Layer : null,
		// fire48Layer : null,
		// healthLayer : null,
		// provinceLayer :null,
		// settlementLayer :null,
		// flood2010 : null,
		// flood2011 : null,
		dataLayer : null,
		// riverLayer : null,
		// roadLayer : null,
		viewport : null,
		hilites : null,
		wfs_url : null,
		wmsUrl: "php/getmap.php?",
		wmsUrls : ["php/getmap.php?","http://windows.oasiswebservice.org:8899/geoserver/mssql/ows?"],
		popup : null,
		featureInfo: null, //for WMSgetFeatureInfo
		tempLayer : null,
		navHistory : null,
		editControl : null,
		insertGeomMode : false,
		targetLayer : null,
		targetDBF : null,
		procState : null,
		currentDate : new Date(),
		inverseMercator: function(x, y) {
	 
	        var lon = (x / 20037508.34) * 180;
	        var lat = (y / 20037508.34) * 180;
	 
	        lat = 180/Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180)) - Math.PI / 2);
	 
	        return new OpenLayers.LonLat(lon, lat);
	    },
		setLiveImage : function (){
			function getwmsurl(bounds){
				
				// console.log(APP.inverseMercator(bounds.left, bounds.bottom));
				// console.log(this.map.getResolution());
				// var minPos = APP.inverseMercator(bounds.left, bounds.bottom);
				// var maxPos = APP.inverseMercator(bounds.right, bounds.top)
				// minPos.lon += this.params.deltaX;
				// maxPos.lon += this.params.deltaX;
				// minPos.lat += this.params.deltaY;
				// maxPos.lat += this.params.deltaY;
				// console.log(minPos);
				bounds.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
				bounds.left += this.params.deltaX;
            	bounds.right += this.params.deltaX;
            	bounds.top += this.params.deltaY;
           	 	bounds.bottom += this.params.deltaY;
				// console.log(bounds.left, bounds.bottom);
				// console.log(parseFloat(bounds.left).toFixed(2)+"+"+parseFloat(bounds.bottom).toFixed(2)+"+"+parseFloat(bounds.right).toFixed(2)+"+"+parseFloat(bounds.top).toFixed(2));
				var url = this.url;
				url += "&layers="+this.params.layers;
				url += "&map="+this.params.map;
				url += "&mode="+this.params.mode;
				url += "&map_imagetype="+this.params.map_imagetype;
				url += "&mapext="+parseFloat(bounds.left).toFixed(2)+"+"+parseFloat(bounds.bottom).toFixed(2)+"+"+parseFloat(bounds.right).toFixed(2)+"+"+parseFloat(bounds.top).toFixed(2);
				url += "&imgext="+parseFloat(bounds.left).toFixed(2)+"+"+parseFloat(bounds.bottom).toFixed(2)+"+"+parseFloat(bounds.right).toFixed(2)+"+"+parseFloat(bounds.top).toFixed(2);
				// url += "&mapext="+minPos.lon+"+"+minPos.lat+"+"+maxPos.lon+"+"+maxPos.lat;
				// url += "&imgext="+minPos.lon+"+"+minPos.lat+"+"+maxPos.lon+"+"+maxPos.lat;
				url += "&map_size=256+256";
				url += "&imgx=128";
				url += "&imgy=128";
				url += "&imgxy=256+256";
				return url;
			}
			var Terra250_721 = new OpenLayers.Layer.WMS('Terra_721_20121215', 'http://hyperquad.ucsd.edu/cgi-bin/lance_modis?', {layers: 'Terra_721_20121217', transparent: 'true'});
		    
		    
		    APP.map.addLayer(Terra250_721);
		    APP.map.addControl( new OpenLayers.Control.LayerSwitcher() );


		},
		doSearch : function(resp){
			var data = Ext.decode(resp.responseText);
			SEARCH.searchStore.loadRawData(data);
			SEARCH.searchPanel.expand();
		},
		searchPre : function (){
			var address = document.getElementById('search').value;
			address = encodeURI(address);
			OpenLayers.loadURL('http://maps.googleapis.com/maps/api/geocode/json?address='+address+'&sensor=false','',null,APP.doSearch);
		},
		setEditControl : function(){
			
			this.editControl = Ext.create('Ext.toolbar.Toolbar', {
			    renderTo: 'editControl',
			    width   : 320,
			    items: [
			    	'Target layer', 
			        {
			            xtype    : 'textfield',
			            id : 'layerLbl',
			            name     : 'field1',
			            value: '',
			            disabled : true 
			        },		        
			        Ext.create('Ext.Button', {
			        	id : 'addNewData',
						tooltip : 'Add new data',  
						iconCls : 'iconAdd',   
						disabled : true, 
						handler: function() {
							APP.procState = 'add';
							APP.insertGeomMode = true;
							var win = new Ext.Window(
						    {
						        layout: 'fit',
						        width: 150,
						        height: 150,
						        modal: false,
						        closeAction: 'destroy',
						        items: [{
									x:5,
									// y:0,
					    	    	xtype:'label',
									html:'Latitude:',
									width: 75
								},
								{
									x:5,
									// y:0,
					    	    	xtype:'textfield',
					    	    	disabledClass: '',
					    	    	maxLength: 10,
					    	    	//vtype:'decdeg',
					    	    	//maskRe:/[-]?[0-9]*[.]{0,1}[0-9]{0,8}/,
					    	    	id: 'ddN',
									width: 145
									
								},{
									x:5,
									// y:0,
					    	    	xtype:'label',
									html:'Longitude:',
									width: 75
								},
								{
									x:5,
									// y:0,
					    	    	xtype:'textfield',
					    	    	disabledClass: '',
					    	    	maxLength: 10,
					    	    	//vtype:'decdeg',
					    	    	//maskRe:/[-]?[0-9]*[.]{0,1}[0-9]{0,8}/,
					    	    	id: 'ddE',
									width: 145
									
								},{
									x:5,y:3,
									xtype: 'button',
									text: 'Use Coordinate',
									iconCls : 'iconAdd',
									handler: function() {
										APP.insertGeomMode = false;
										var lonlat = new OpenLayers.LonLat(Ext.getCmp('ddE').value, Ext.getCmp('ddN').value);
										lonlat.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));										
										
										var icon = new OpenLayers.Icon('http://maps.google.com/mapfiles/ms/icons/red-pushpin.png');
										APP.markers.clearMarkers();
										APP.markers.addMarker(new OpenLayers.Marker(lonlat, icon));
										// console.log(DATA.dataEditor);
										
										Ext.Ajax.request({
										   url: 'php/get-blanknode.php?layer='+APP.targetLayer,
										   success: function(response, opts) {
										      var obj = Ext.decode(response.responseText);
										      DATA.datapanel.expand();
										      // DATA.dataEditor.setSource(DATA.setFormInput(obj));
										      DATA.dataEditor.setSource(obj);
										      Ext.getCmp('saveNewData').setDisabled(false);
	   										
										   },
										   failure: function(response, opts) {
										      console.log('server-side failure with status code ' + response.status);
										   }
										});
										
										win.close();
							            
									}
								}/*,{
									x:15,y:3,
									xtype: 'button',
									text: 'Use Coord.',
									iconCls : 'iconAdd',
									handler: function() {}
								}*/]
						    }).show();
						}
					}),		        
			        Ext.create('Ext.Button', {
						id : 'editNewData',
						tooltip : 'Edit data',  
						iconCls : 'iconEdit', 
						disabled : true,    
						handler: function() {
							APP.procState = 'edit';
							CONTROL.drag.activate();
							// console.log(DATA.dataEditor);
							Ext.getCmp('saveNewData').setDisabled(false);
						}
					}),		        
			        Ext.create('Ext.Button', {
			        	id : 'deleteNewData',
						tooltip : 'Delete data',  
						iconCls : 'iconDelete',
						disabled : true,     
						handler: function() {
							Ext.Ajax.request({
								url: 'php/addshape.php?state=delete&dbf='+APP.targetDBF+'&data='+Ext.encode(DATA.dataEditor.getSource()),
								success: function(response, opts) {
									APP.map.getLayersByName(APP.targetLayer)[0].redraw();
									if (APP.hilites.features.length > 0){
										APP.hilites.removeAllFeatures();
										DATA.dataEditor.setSource({});										
									}
									UTILS.showHelpTip('Warning', 'Data deleted successfully', 7200);
								},
								failure : function(response, opts) {
									UTILS.showHelpTip('Error', 'server-side failure with status code ' + response.status, 7200);
								}
							});							
						}
					}),		        
			        Ext.create('Ext.Button', {
			        	id : 'saveNewData',
						tooltip : 'Save data',  
						iconCls : 'iconUpload', 
						disabled : true,    
						handler: function() {
							if (APP.procState == 'add'){
								var coord = APP.markers.markers[0].lonlat;
								coord.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
								console.log(coord.toString());
								var lon = coord.lon;
								var lat = coord.lat;
							} else if (APP.procState == 'edit'){
								var coord = APP.hilites.features[0].geometry;
								coord.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
								var lon = coord.x;
								var lat = coord.y;
							}	
							
							// console.log(coord);
							Ext.Ajax.request({
								url: 'php/addshape.php?state='+APP.procState+'&dbf='+APP.targetDBF+'&lon='+lon+'&lat='+lat+'&data='+Ext.encode(DATA.dataEditor.getSource()),
								success: function(response, opts) {
									APP.map.getLayersByName(APP.targetLayer)[0].redraw();
									Ext.getCmp('saveNewData').setDisabled(true);
									Ext.getCmp('deleteNewData').setDisabled(true);
									Ext.getCmp('editNewData').setDisabled(true);
									CONTROL.drag.deactivate();
									APP.markers.clearMarkers();
									UTILS.showHelpTip('Warning', 'Data saved successfully', 7200);
								},
								failure : function(response, opts) {
									UTILS.showHelpTip('Error', 'server-side failure with status code ' + response.status, 7200);
								}
							});
						}
					})
			    ]
			});
		},
		getHeadHTML : function(){
			var html = '<div id="banner"><img src="image/logo.png" id="logo"/><div id="title">Oasis Web<h id="version">&nbsp;1.0 beta<h></div><br><div id="subTitle">- web based GIS application for humanitarian response -</div>';
			html = html + '<div id="search_panel">Search : <input type="text" name="search" id="search">&nbsp;<a class="info_menu" href="#" onclick="APP.searchPre();">Find</a></div>';			
			html = html + '<div id="info_panel"><a class="info_menu" href="#" onclick="SECURITY.showPassForm()">Change Password</a>&nbsp;&nbsp;&nbsp;<a class="info_menu" href="logout.php">Logout</a>&nbsp;&nbsp;&nbsp;<a class="info_menu" href="http://www.immap.org">iMMAP</a></div></div>';
			return html;
		},
		setGroundOverlayKMLLayers : function(response){
			// console.log(this);
			var parserXML = new OpenLayers.Format.XML();
			try {
				var objKMLxml = parserXML.read(response.responseText);
				var objLayerList = parserXML.getElementsByTagNameNS(objKMLxml, "*", "GroundOverlay");

				for(var j=0;j<objLayerList.length;j++)
				{
					var derName = parserXML.getElementsByTagNameNS(objLayerList[j], "*", "name");
					var dasIcon = parserXML.getElementsByTagNameNS(objLayerList[j], "*", "Icon");
					var dieHREF = parserXML.getElementsByTagNameNS(dasIcon[0], "*", "href");										
					var dieBox = parserXML.getElementsByTagNameNS(objLayerList[j], "*", "LatLonBox");
					var derNorden = parserXML.getElementsByTagNameNS(dieBox [0], "*", "north");
					var derWesten = parserXML.getElementsByTagNameNS(dieBox [0], "*", "west");
					var derSueden = parserXML.getElementsByTagNameNS(dieBox [0], "*", "south");
					var derOsten  = parserXML.getElementsByTagNameNS(dieBox [0], "*", "east");
										        
					var name = derName[0].firstChild.nodeValue;
					var url = dieHREF[0].firstChild.nodeValue;
					
									        
					var ptmin = [derWesten[0].firstChild.nodeValue,derSueden[0].firstChild.nodeValue];
    				var ptmax = [derOsten[0].firstChild.nodeValue,derNorden[0].firstChild.nodeValue];
    										    
    				var tempbounds = ptmin[0] + "," + ptmin[1] + "," + ptmax[0] + "," + ptmax[1];
    										    
					// var bounds = new OpenLayers.Bounds(ptmin[0],ptmin[1],ptmax[0],ptmax[1]);
					// console.log(bounds);
					// bounds.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
												
					/// Layer Image Working Example replaced to wms layers							
					// APP.map.addLayer(new OpenLayers.Layer.Image(
						// this.layer,
						// url,
						// bounds,   
						// new OpenLayers.Size(1,1),
						// {
							// isBaseLayer: false, 
							// visibility : false,
							// opacity: 1.0,
							// projection: new OpenLayers.Projection("EPSG:900913")
						// }
					// ));   										    
					// console.log(url);
					
						APP.map.addLayer(new OpenLayers.Layer.WMS(this.layer,
	                    	"php/getmap.php",
	                    	{
	                    		layers: this.layer,	
	                    		transparent: true,
	                    		imageUrl : url,
	                    		tempbounds : tempbounds,
	                    		wmstype : 'groundoverlay'
	                    		
	                    	}, {
	                    		isBaseLayer : false,
	                   			visibility : false
	                     })); 					
					
										        
    			}	
			} catch(err) {
				return;
			}
		},
		setLayerObject : function (){
			
			Ext.Ajax.request({
				loadMask: true,
				url : 'check-nodes.json',
				success: function(resp) {
					var root = Ext.decode(resp.responseText);
					for (var i=0;i<root.length-1;i++){
						var layerFolders = root[i].children;
						// console.log(root[i].group);
						for (var ix=0;ix<layerFolders.length;ix++){
							
							/// create layer object based on group property
							if (root[i].group=="Base Layers"){
								APP.map.addLayer(new OpenLayers.Layer.WMS(layerFolders[ix].layer,
			                    	// ["php/getmap.php","http://map1.oasispakistan.pk/getmap.php","http://map2.oasispakistan.pk/getmap.php","http://map3.oasispakistan.pk/getmap.php","http://map4.oasispakistan.pk/getmap.php"],
			                    	"php/getmap.php",
			                    	{
			                    		layers: layerFolders[ix].layer,	
			                    		transparent: true,
			                    		text : layerFolders[ix].text,
			                    		group : 'Base Layers'
			                    	}, {
			                    		isBaseLayer : false,
			                   			visibility : false,
				                   		singleTile : true,
				                   		transitionEffect:'resize'
			                     }));	
			                } else if ((root[i].group=="External Data") || (root[i].group=="KML")){
			                	// check and implement the others for groudoverlay kml sources
			                	if (layerFolders[ix].layertype!='groundoverlay'){
					                APP.map.addLayer(new OpenLayers.Layer.WMS(layerFolders[ix].layer,
				                    	// ["php/getmap.php","http://map1.oasispakistan.pk/getmap.php","http://map2.oasispakistan.pk/getmap.php","http://map3.oasispakistan.pk/getmap.php","http://map4.oasispakistan.pk/getmap.php"],
				                    	"php/getmap.php",
				                    	{
				                    		layers: layerFolders[ix].layer,	
				                    		transparent: true,
			                    			text : layerFolders[ix].text,
			                    			kmlurl : layerFolders[ix].url
				                    	}, {
				                    		isBaseLayer : false,
				                   			visibility : false,
				                   			singleTile : false,
				                   			transitionEffect:'resize'
				                     }));		
			                	} else {
					                APP.map.addLayer(new OpenLayers.Layer.WMS(layerFolders[ix].layer,
				                    	// ["php/getmap.php","http://map1.oasispakistan.pk/getmap.php","http://map2.oasispakistan.pk/getmap.php","http://map3.oasispakistan.pk/getmap.php","http://map4.oasispakistan.pk/getmap.php"],
				                    	"php/getmap.php",
				                    	{
				                    		layers: layerFolders[ix].layer,	
				                    		transparent: true,
			                    			text : layerFolders[ix].text
				                    	}, {
				                    		isBaseLayer : false,
				                   			visibility : false,
				                   			singleTile : false,
				                   			transitionEffect:'resize'
				                     }));				                		
			                	}
			                } else if (root[i].group=="Editable Layers"){
			                	APP.map.addLayer(new OpenLayers.Layer.WMS(layerFolders[ix].layer,
			                    	// ["php/getmap.php","http://map1.oasispakistan.pk/getmap.php","http://map2.oasispakistan.pk/getmap.php","http://map3.oasispakistan.pk/getmap.php","http://map4.oasispakistan.pk/getmap.php"],
			                    	"php/getmap.php",
			                    	{
			                    		layers: layerFolders[ix].layer,	
			                    		transparent: true,
			                    		text : layerFolders[ix].text,
			                    		group : 'Editable Layers'
			                    	}, {
			                    		isBaseLayer : false,
			                   			visibility : false,
				                   		singleTile : true,
				                   		transitionEffect:'resize'
			                     }));		
			                } else if (root[i].group=="WMS_PD"){
			                	// alert(UTILS.getDateCode(APP.currentDate));
			                	APP.map.addLayer(new OpenLayers.Layer.WMS(layerFolders[ix].layer,
			                		layerFolders[ix].url,
			                    	// 'http://hyperquad.ucsd.edu/cgi-bin/lance_modis?', 
			                    	// "php/getmap.php",{layers: 'Terra_721_20121217', transparent: 'true'})
			                    	{
			                    		layers: layerFolders[ix].layer+'_'+UTILS.getDateCode(APP.currentDate),///layerFolders[ix].layer,	
			                    		transparent: 'true',
			                    		text : layerFolders[ix].text,
			                    		group : 'WMS'
			                    	}, {
			                    		isBaseLayer : false,
			                   			visibility : false,
				                   		singleTile : false,
				                   		transitionEffect:'resize',
				                   		opacity: 0.5
			                     }));	
			                     APP.map.getLayersByName(layerFolders[ix].layer)[0].setZIndex(10);	
			                } else if (root[i].group=="WMS"){
			                	APP.map.addLayer(new OpenLayers.Layer.WMS(layerFolders[ix].layer,
			                		layerFolders[ix].url,
			                    	{
			                    		layers: layerFolders[ix].layer,	
			                    		transparent: 'true',
			                    		text : layerFolders[ix].text,
			                    		group : 'WMS'
			                    	}, {
			                    		isBaseLayer : false,
			                   			visibility : false,
				                   		singleTile : false,
				                   		transitionEffect:'resize',
				                   		opacity: 0.5
			                     }));	
			                     APP.map.getLayersByName(layerFolders[ix].layer)[0].setZIndex(10);	
			                }
			                
			                     
						}
					}
					/*
					this.tempLayer = root[0].children;
					var extLayers = root[2].children;
					var sindhLayers = root[3].children;
					// console.log(this.tempLayer);
					
					for (var i=0;i<this.tempLayer.length;i++){
						APP.map.addLayer(new OpenLayers.Layer.WMS(this.tempLayer[i].layer,
	                    	"php/getmap.php",
	                    	{
	                    		layers: this.tempLayer[i].layer,	
	                    		transparent: true,
	                    		text : this.tempLayer[i].text,
	                    		group : 'Base Layers'
	                    	}, {
	                    		isBaseLayer : false,
	                   			visibility : false,
		                   		singleTile : true
	                     })); 
                     }
                     for (var i=0;i<extLayers.length;i++){
                     	if (extLayers[i].layertype!='groundoverlay'){
							APP.map.addLayer(new OpenLayers.Layer.WMS(extLayers[i].layer,
		                    	"php/getmap.php",
		                    	{
		                    		layers: extLayers[i].layer,	
		                    		transparent: true,
	                    			text : extLayers[i].text,
	                    			kmlurl : extLayers[i].url
		                    	}, {
		                    		isBaseLayer : false,
		                   			visibility : false,
		                   			singleTile : true
		                     }));                      		
		                 } else {
							APP.map.addLayer(new OpenLayers.Layer.WMS(extLayers[i].layer,
		                    	"php/getmap.php",
		                    	{
		                    		layers: extLayers[i].layer,	
		                    		transparent: true,
	                    			text : extLayers[i].text
		                    	}, {
		                    		isBaseLayer : false,
		                   			visibility : false,
		                   			singleTile : true
		                     })); 
		                 }    

                     }                    
					 for (var i=0;i<sindhLayers.length;i++){
						APP.map.addLayer(new OpenLayers.Layer.WMS(sindhLayers[i].layer,
	                    	"php/getmap.php",
	                    	{
	                    		layers: sindhLayers[i].layer,	
	                    		transparent: true,
	                    		text : sindhLayers[i].text,
	                    		group : 'Base Layers'
	                    	}, {
	                    		isBaseLayer : false,
	                   			visibility : false,
		                   		singleTile : true
	                     })); 
                     }*/    
                                   
				}
			});	
			
		},
		layerStore : function(){
			this.layers = eval({});
			this.addLayer = function (layer){this.layers[layer.name] = layer;};
			this.addLayers = function (layerArray){
				for (var i = 0; i < layerArray.length; i++){
					this.layers[layerArray[i].name] = layerArray[i];
				}
			};	
			this.getLayer = function (name){
				for (var layer in this.layers){if (layer == name){return this.layers[name]; break;} }
			};
		},
		onFeatureSelect : function(event) {

	            var feature = event.feature;
	            // Since KML is user-generated, do naive protection against
	            // Javascript.
	            var content = "<h2>"+feature.attributes.name + "</h2>" + feature.attributes.description;
	            if (content.search("<script") != -1) {
	                content = "Content contained Javascript! Escaped content below.<br>" + content.replace(/</g, "&lt;");
	            }
	            popup = new OpenLayers.Popup.FramedCloud("chicken", 
	                                     feature.geometry.getBounds().getCenterLonLat(),
	                                     new OpenLayers.Size(100,100),
	                                     content,
	                                     null, true);
	            feature.popup = popup;
	            APP.map.addPopup(popup);
	        },      
		  	onFeatureUnselect : function(event) {
	            var feature = event.feature;
	            if(feature.popup) {
	                APP.map.removePopup(feature.popup);
	                feature.popup.destroy();
	                delete feature.popup;
	            }
	       }
	       ,
		highlightFeatures : function() {		   
		   OpenLayers.loadURL(this.wfsurl,'',null,this.highlight_them);
	  	},
	  	highlight_them : function(response) {
	  		var features = new OpenLayers.Format.GML().read(response.responseText);
	  		var text = '';
	  		for(var key in features[0].data){
	  			if (features[0].data[key]!=null)
	  				text += key+" : "+features[0].data[key]+"<BR>";
	  		}	
	  		//console.log(text);
			features[0].geometry.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
			if (APP.hilites.features.length > 0){
				APP.hilites.destroyFeatures();
			}	
            APP.hilites.addFeatures(features);
            APP.hilites.setVisibility(true);
            this.popup = new OpenLayers.Popup.FramedCloud("chicken", 
	            features[0].geometry.getBounds().getCenterLonLat(),
	            null,
	            text+
	            "<BR><img src='http://chart.apis.google.com/chart?cht=p3&chs=450x100&chd=t:73,13,10,3,1&chco=80C65A,224499,FF0000&chl=Provision of Safe Water|Promotion of Hygiene|Distribution of Poultry|Distribution of Small Ruminants|Households receiving Tents'>",
            null, true);
            features.popup = this.popup;
            APP.map.addPopup(this.popup);
	  	},
		changeBaselayer : function(ctrl, val){
				 if(ctrl.checked == true){
				 	 APP.activeBaseLayer = ctrl.id;
					 if (ctrl.id == 'OpenStreetMap'){
						 APP.map.setBaseLayer(APP.tileOSM); 
						 UTILS.showHelpTip('OpenStreetMap', 'http://www.openstreetmap.org', 3600);
					 }
					 if (ctrl.id == 'Google Hybrid'){
						 APP.map.setBaseLayer(APP.ghyb); 
						 UTILS.showHelpTip('Google Hybrid', 'http://map.google.com/', 3600);
					 }
					 if (ctrl.id == 'default'){
						 APP.map.setBaseLayer(APP.tileDefault);
						 UTILS.showHelpTip('Google Hybrid', 'http://map.google.com/', 3600);
					 }
					 if (ctrl.id == 'Google Physical'){
						 APP.map.setBaseLayer(APP.gphy);
						 UTILS.showHelpTip('Google Physical', 'http://map.google.com/', 3600);
					 }
					 if (ctrl.id == 'Google Streets'){
						 APP.map.setBaseLayer(APP.gstr);
						 UTILS.showHelpTip('Google Streets', 'http://map.google.com/', 3600);
					 }
					 if (ctrl.id == 'Google Satellite'){
						 APP.map.setBaseLayer(APP.gsat);
						 UTILS.showHelpTip('Google Satellite', 'http://map.google.com/', 3600);
					 }
					 if (ctrl.id == 'ArcGIS Street Map'){
						 APP.map.setBaseLayer(APP.arcstreet);
						 UTILS.showHelpTip('ArcGIS Street Map', 'http://services.arcgisonline.com/ArcGIS/rest/services/Street_Map/', 3600);
					 }
					 if (ctrl.id == 'ArcGIS Topo Map'){
						 APP.map.setBaseLayer(APP.arctopo);
						 UTILS.showHelpTip('ArcGIS Topo Map', 'http://services.arcgisonline.com/ArcGIS/rest/services/Topo_Map/', 3600);
					 }
					 if (ctrl.id == 'ArcGIS Imagery'){
						 APP.map.setBaseLayer(APP.arcimage);
						 UTILS.showHelpTip('ArcGIS Imagery', 'http://services.arcgisonline.com/ArcGIS/rest/services/imagery/', 3600);
					 }
					 	 
				 }
	
		},
		initTheme : function(){
			var data = [
		        ['./lib/ext-4.0.7-gpl/resources/css/ext-all.css','Default'],
		        // ['./lib/ext-4.0.7-gpl/resources/css/ext-all-access.css','Black'],
		        ['./lib/ext-4.0.7-gpl/resources/css/ext-all-gray.css', 'Grey']//,
		        //['./lib/ext-4.0.7-gpl/resources/css/ext-all-custom1.css', 'Custom1']
		        
		        
		    ]; 
		    var themeStore = new Ext.data.ArrayStore({
		        data   : data,
		        fields : ['code','name']
		    });
			this.themeCB = new Ext.form.ComboBox({
					store: themeStore,
					displayField: 'name',
					valueField: 'code',
					typeAhead: true,
					mode: 'local',
					triggerAction: 'all',
					emptyText: 'Select a theme...',
					selectOnFocus: true,
					listeners: {
						select: function(combo, record, index){
							//console.log(combo.value);
							var oldlink = document.getElementsByTagName("link").item(2);
							// console.log(document.getElementsByTagName("link"));
							var newlink = document.createElement("link")
					        newlink.setAttribute("rel", "stylesheet");
					        newlink.setAttribute("type", "text/css");
					        newlink.setAttribute("href", combo.value);	
					        // console.log(document.getElementsByTagName("head").item(0));			 
					        document.getElementsByTagName("head").item(0).replaceChild(newlink, oldlink);
						}
					}
				});
			this.themeCB.setValue(themeStore.getAt('0'));	
		},
		initLayout : function(){
			this.viewport = Ext.create('Ext.container.Viewport', {
					layout: 'border',
					id: 'viewPort',
					items: [Ext.create('Ext.Panel',{
						region: 'north',
						el: 'north',
						id: 'north-panel',
						height: 50,
						border: false,
						// collapseMode: 'mini',
						// collapsible: true,
						// collapsed : true,
						// split : true,
						header:false,
						//preventHeader: true,
						//hideCollapseTool: false,
						// margins: '5 5 5 5',
						items: [{
							height: 50,
							border: false,
							html: this.getHeadHTML()
						}]
					}), {
						region: 'east',
						collapseMode: 'mini',
						collapsible: true,
						split: true,
						header:false,
						id: 'eastTabs',
						cls: 'my-accordion',
						border: true,
						style: {
							borderTop: '#99bbe8 0px solid'
						},
						margins: '0 5 5 0',
						width: 300,
						minSize: 300,
						maxSize: 400,
						layout: 'accordion',
						layoutConfig: {
							animate: true
						},
						items: [DATA.datapanel,SEARCH.searchPanel,RSS.rssPanel,PRINT.printPanel,TOOLS.toolPanel,FINDER.finderPanel,COORD.coordPanel]
					}, {
						title: 'Layers',
						region: 'west',
						autoScroll: false,
						layout: {
							type: 'vbox',
							align: 'stretch'
						},
						collapsible: true,
						collapseMode: 'mini',
						minWidth: 200,
						margins: '0 0 5 5',
						split: true,
						border: true,
						items: [{
							id: 'lyManager',
							autoScroll: true,
							flex: 6,
							width: 400,
							layout: {
								type: 'vbox',
								align: 'stretch'
							},
							border: false,
							items: [TREE.treePanel, 
							{
								xtype: 'fieldset',
								title: 'Background Image',
								autoHeight: true,
								style: 'margin-right:5px;margin-left:5px;',
								defaultType: 'radio',
								align :  'bottom',
								items: [/*{
									fieldLabel: '',
									labelSeparator: '',
									boxLabel: 'Default',
									id: 'default',
									xtype: 'radio',
									name: 'baseGroup',
									hideLabel: true,
									checked: true,
									handler: this.changeBaselayer
								}, */{
									fieldLabel: '',
									labelSeparator: '',
									boxLabel: 'OpenStreetMap',
									id: 'OpenStreetMap',
									xtype: 'radio',
									name: 'baseGroup',
									hideLabel: true,
									checked: false,
									handler: this.changeBaselayer
								}, {
									fieldLabel: '',
									labelSeparator: '',
									boxLabel: 'Google Physical',
									id: 'Google Physical',
									xtype: 'radio',
									name: 'baseGroup',
									hideLabel: true,
									checked: false,
									handler: this.changeBaselayer
								}, {
									fieldLabel: '',
									labelSeparator: '',
									boxLabel: 'Google Streets',
									id: 'Google Streets',
									xtype: 'radio',
									name: 'baseGroup',
									hideLabel: true,
									checked: true,
									handler: this.changeBaselayer
								}, {
									fieldLabel: '',
									labelSeparator: '',
									boxLabel: 'Google Hybrid',
									id: 'Google Hybrid',
									xtype: 'radio',
									name: 'baseGroup',
									hideLabel: true,
									checked: false,
									handler: this.changeBaselayer
								}, {
									fieldLabel: '',
									labelSeparator: '',
									boxLabel: 'Google Satellite',
									id: 'Google Satellite',
									xtype: 'radio',
									name: 'baseGroup',
									hideLabel: true,
									checked: false,
									handler: this.changeBaselayer
								}, {
									fieldLabel: '',
									labelSeparator: '',
									boxLabel: 'ArcGIS Street Map',
									id: 'ArcGIS Street Map',
									xtype: 'radio',
									name: 'baseGroup',
									hideLabel: true,
									checked: false,
									handler: this.changeBaselayer
								}, {
									fieldLabel: '',
									labelSeparator: '',
									boxLabel: 'ArcGIS Topo Map',
									id: 'ArcGIS Topo Map',
									xtype: 'radio',
									name: 'baseGroup',
									hideLabel: true,
									checked: false,
									handler: this.changeBaselayer
								}, {
									fieldLabel: '',
									labelSeparator: '',
									boxLabel: 'ArcGIS Imagery',
									id: 'ArcGIS Imagery',
									xtype: 'radio',
									name: 'baseGroup',
									hideLabel: true,
									checked: false,
									handler: this.changeBaselayer
								}					
								]
							}]
						}
						]
					}, Ext.create('Ext.Panel',{
						region: 'center',
						layout : 'border',
						border : false,
						items : [
							Ext.create('Ext.Panel',{
							region: 'center',
							id: 'center',
							deferredRender: false,
							tag: 'center',
							contentEl: 'centerDiv',
							tbar: Ext.create('Ext.toolbar.Toolbar',{
								id: 'toolbar',
								cls: 'tb',
								items: [
								new GeoExt.Action({
					     			control: this.navHistory.previous,
					     			disabled: true,
					     			tooltip: "previous in history",
					     			iconCls: 'iconPrev'
					     		}),
					     		new GeoExt.Action({
					     			control: this.navHistory.next,
					     			disabled: true,
					     			tooltip: "next in history",
					     			iconCls: 'iconNext'
					     		}),{
									xtype: 'tbseparator'
								},
								Ext.create('Ext.Button', {
									    text: 'Clear Selected Feature',  
									    iconCls : 'refresh',    
									    handler: function() {
									        if (APP.hilites.features.length > 0){
									        	// DATAVIEW.dataStore.clearFilter();
												//if (APP.hilites.features.length > 0){\
													APP.hilites.removeAllFeatures();
												//}	
												DATA.dataEditor.setSource({});
												
											}
									    }
									})
								,{
									xtype: 'tbfill'
								}, {
									xtype: 'tbtext',
									text: 'Theme : '
								}, this.themeCB]
							})
						})/*,
						Ext.create('Ext.Panel',{
							region: 'south',
							id : 'tabPanel',
							deferredRender: false,
							height : 150,
							collapseMode: 'mini',
							collapsible: true,
							collapsed : true,
							split : true,
							header:false,
							border : false,
							items : [DATAVIEW.tabPanel]
						})*/
						] 
					})//end panel
					]//end viewport items
				});//end viewport			
		},
		getTileURL : function(bounds) {
		    var res = this.map.getResolution();
		    var x = Math.round((bounds.left - this.maxExtent.left) / (res * this.tileSize.w));
		    var y = Math.round((this.maxExtent.top - bounds.top) / (res * this.tileSize.h));
		    var z = this.map.getZoom();
		    var limit = Math.pow(2, z);
		
		    if (y < 0 || y >= limit) {
		        return OpenLayers.Util.getImagesLocation() + "404.png";
		    } else {
		        x = ((x % limit) + limit) % limit;
		        if (this.kind == 'esri'){
		        	return this.url + z + "/" + y + "/" + x + "." + this.type;
		        } else {
		        	return this.url + z + "/" + x + "/" + y + "." + this.type;
		        }	
		    }
		}, 
		initLayers : function(){
			
			this.markers = new OpenLayers.Layer.Markers( "Markers" ,{
			    sphericalMercator : true,
			    rendererOptions: { zIndexing: true }
			});
			
			this.vector = new OpenLayers.Layer.Vector("vector");
			
			this.gstr = new OpenLayers.Layer.Google(
				"Google Streets",
				{
					'sphericalMercator': true,
					transitionEffect:"resize"
				}
			);
			
			this.gphy = new OpenLayers.Layer.Google(
					"Google Physical",
					{
						'sphericalMercator': true,
						type: G_PHYSICAL_MAP
					}
			);
				
			this.tileOSM = new OpenLayers.Layer.TMS(
		        "OpenStreetMap",
		        "http://tile.openstreetmap.org/",
		        {
		            type: 'png', 
		            getURL: this.getTileURL,
		            displayOutsideMaxExtent: true,
		            attribution: '<a href="http://www.openstreetmap.org/">OpenStreetMap</a>',
		            transitionEffect:"resize"
		        }
		    );
			
   			this.arcstreet = new OpenLayers.Layer.TMS(
		      "ArcGIS StreetMap",
		      "http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/",
		        {
		            type: 'png', 
		            kind: 'esri',
		            getURL: this.getTileURL,
		            displayOutsideMaxExtent: true,
		            transitionEffect:"resize"
		        }
   			 );
   			 
   			this.arctopo = new OpenLayers.Layer.TMS(
		      "ArcGIS Topo Map",
		      "http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/",
		        {
		            type: 'png', 
		            kind: 'esri',
		            getURL: this.getTileURL,
		            displayOutsideMaxExtent: true,
		            transitionEffect:"resize"
		        }
   			 );
   			 
   			this.arcimage = new OpenLayers.Layer.TMS(
		      "ArcGIS Imagery",
		      "http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/",
		        {
		            type: 'png', 
		            kind: 'esri',
		            getURL: this.getTileURL,
		            displayOutsideMaxExtent: true,
		            transitionEffect:"resize"
		        }
   			 );   			 
   			 
   			 this.ghyb = new OpenLayers.Layer.Google(
					"Google Hybrid",
					{
						'sphericalMercator': true,
						type: G_HYBRID_MAP
					}
			);
				
			this.gsat = new OpenLayers.Layer.Google(
					"Google Satellite",
					{
						'sphericalMercator': true,
						type: G_SATELLITE_MAP
					}
			);	
                                   
		    this.dataLayer = new OpenLayers.Layer.WMS("dataLayer",
                                   "php/getmap.php",
                                   {
                                       layers: "dataLayer",
                                       transparent: true
                                   }, {
                                       //opacity: 0.5,
                                       isBaseLayer : false,
                                       visibility : false
                                   });  
           
           
           // this.provinceLayer = new OpenLayers.Layer.WMS("Admin",
                                   // "php/getmap.php",
                                   // {
                                       // layers: "Province,District,Admin",
                                       // transparent: true
                                   // }, {
                                       // //opacity: 0.5,
                                       // isBaseLayer : false,
                                       // visibility : false
                                   // });     
//                                    
           // this.healthLayer = new OpenLayers.Layer.WMS("health",
                                   // "php/getmap.php",
                                   // {
                                       // layers: "health",
                                       // transparent: true
                                   // }, {
                                       // //opacity: 0.5,
                                       // isBaseLayer : false,
                                       // visibility : false
                                   // });   
//                                    
           // this.riverLayer = new OpenLayers.Layer.WMS("rivers",
                                   // "php/getmap.php",
                                   // {
                                       // layers: "rivers",
                                       // transparent: true
                                   // }, {
                                       // //opacity: 0.5,
                                       // isBaseLayer : false,
                                       // visibility : false
                                   // });   
//                                    
           // this.roadLayer = new OpenLayers.Layer.WMS("roads",
           							// "php/getmap.php",
           							// {
       									// layers: "roads",
       									// transparent: true
           							// }, {
           								// isBaseLayer : false,
           								// visibility : false
           							// });
//                                    
			// this.settlements = new OpenLayers.Layer.WMS("Settlements",
           							// "php/getmap.php",
           							// {
       									// layers: "settlements",
       									// transparent: true
           							// }, {
           								// isBaseLayer : false,
           								// visibility : false
           							// });
//            							
			// this.flood2010 = new OpenLayers.Layer.WMS("Flood_extent_2010",
           							// "php/getmap.php",
           							// {
       									// layers: "Flood_extent_2010",
       									// transparent: true
           							// }, {
           								// isBaseLayer : false,
           								// visibility : false
           							// });
			// this.flood2011 = new OpenLayers.Layer.WMS("Flood_extent_2011",
           							// "php/getmap.php",
           							// {
       									// layers: "Flood_extent_2010",
       									// transparent: true
           							// }, {
           								// isBaseLayer : false,
           								// visibility : false
           							// });            																		        							           							
                                   
			var highlight_style = { fillColor:'#99CCFF', strokeColor:'#3399FF', fillOpacity:0.7, 'pointRadius': 10 };

			this.hilites = new OpenLayers.Layer.Vector("Highlighted",
                {isBaseLayer:false, features:[], visibility:true, style:highlight_style}
            );                                                                   
                                                        
		       
		},
		initMap : function(){
			var bounds4326 = new OpenLayers.Bounds(-180,-90,180,90);
			var options4326 = {
					numZoomLevels: 20, 
					units: 'degrees',
					projection: new OpenLayers.Projection("EPSG:4326"),//900913
					displayProjection: new OpenLayers.Projection("EPSG:4326"),
					controls: []
				};
			var bounds900913 = new OpenLayers.Bounds(-20037508.34, -20037508.34, 20037508.34, 20037508.34);
			
			var options900913 = {
			    projection: new OpenLayers.Projection("EPSG:900913")
			    ,displayProjection: new OpenLayers.Projection("EPSG:4326")
			    ,units: "m"
			    ,maxResolution: 156543.0339//156543.0339
			    ,maxExtent: bounds900913
			    ,restrictedExtent: bounds900913
			    ,controls: []
			};				
			this.map = new OpenLayers.Map('mapDiv',options900913);
			
			
			// this.fire24Layer = new OpenLayers.Layer.Vector("fire24", {
				// visibility : false,
                // projection: this.map.displayProjection,
                // strategies: [new OpenLayers.Strategy.BBOX()],
                // protocol: new OpenLayers.Protocol.HTTP({
                    // url: "php/feedProxy.php?url=http://firms.modaps.eosdis.nasa.gov/active_fire/kml/South_Asia_24h.kml",
                    // format: new OpenLayers.Format.KML({
                        // extractStyles: true,
                        // extractAttributes: true
                    // })
                // })
            // });
//                      
			// this.fire48Layer = new OpenLayers.Layer.Vector("fire48", {
				// visibility : false,
                // projection: this.map.displayProjection,
                // strategies: [new OpenLayers.Strategy.BBOX()],
                // protocol: new OpenLayers.Protocol.HTTP({
                    // url: "php/feedProxy.php?url=http://firms.modaps.eosdis.nasa.gov/active_fire/kml/South_Asia_48h.kml",
                    // format: new OpenLayers.Format.KML({
                        // extractStyles: true,
                        // extractAttributes: true
                    // })
                // })
            // });      
                   	

	             

			
			this.map.addLayers([ this.gstr, this.tileOSM, this.ghyb, this.gsat, this.gphy, this.arcstreet, this.arctopo, this.arcimage, this.vector, this.dataLayer, this.hilites, this.markers]);
			
			// var selectfire24 = new OpenLayers.Control.SelectFeature(this.fire24Layer); 
			// var selectfire48 = new OpenLayers.Control.SelectFeature(this.fire48Layer);			
// 			
			// this.fire24Layer.events.on({
                // "featureselected": APP.onFeatureSelect,
                // "featureunselected": APP.onFeatureUnselect
            // });
            			
			this.map.addControl(new OpenLayers.Control.Navigation());
			this.map.addControl(new OpenLayers.Control.PanZoomBar());
			this.navHistory = new OpenLayers.Control.NavigationHistory();
			this.map.addControl(this.navHistory);
			
			var initCenter = new OpenLayers.LonLat(78.88, 30.64);
			initCenter.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
			this.map.setCenter(initCenter, 9);	
			
			this.map.events.register('click', this.map, function(ev){
				FINDER.polygonLayer.destroyFeatures();
				if (FINDER.radiusTool) {
					FINDER.drawRadius(APP.map.getLonLatFromPixel(ev.xy), ev.clientX, ev.clientY);
				}
				if (FINDER.polygonTool){
					FINDER.drawPolygonControl.activate();
				}
				if (APP.insertGeomMode){
					//console.log(Ext.getCmp('ddN'));
					var lonlat = APP.map.getLonLatFromPixel(ev.xy);
					lonlat.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
					Ext.getCmp('ddN').setValue(lonlat.lat);
					Ext.getCmp('ddE').setValue(lonlat.lon);
				}
			});	
			
		},
		init: function () {
			var isChrome = /(chrome)[ \/]([\w.]+)/i.test(navigator.userAgent);
		    if (isChrome) { // Bug in SVG + Chrome-18
		        OpenLayers.Layer.Vector.prototype.renderers = ['Canvas'];
		    }
			Ext.Loader.setConfig({enabled:true});
			Ext.QuickTips.init();
			Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider'));
			this.activeBaseLayer = 'Google Streets';
			this.initLayers();
			this.initMap();
			CONTROL.init();
			DATAVIEW.init();
			DATA.init();
			PRINT.init();
			FILTER.init();
			TREE.init();
			TOOLS.init();
			COORD.init();
			FINDER.init();
			RSS.init();		
			SECURITY.init();	
			LYCUSTOM.init();
			SEARCH.init();	
			this.initTheme();
			this.initLayout();
			//this.viewport.layout.regions.center.add(DATAVIEW.floatWindow);
			this.setLayerObject();
			UTILS.showHelpTip('Welcome in Oasis Web', 'Click the layer checkbox to activate or unactivate layers, Click on the map to inspect an object on map and showing in Properties panel. Click Shift+Drag mouse cursor for rectangle zoom in', 14400);
			document.getElementById('immaplogo').innerHTML = '<img src="image/logo.png" />';
			this.setEditControl();
			// APP.setLiveImage();
		}
		
	}
}();
	

 
