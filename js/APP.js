Ext.BLANK_IMAGE_URL = './lib/ext-4.0.7-gpl/resources/themes/images/gray/tree/s.gif';
OpenLayers.ProxyHost = "../cgi-bin/proxy.cgi?url=";//windows_path
Ext.ns('APP');


APP = function() {
	return {
		defLng : 46,
		defLat : 33,
		defZoom: 6,
		layersObject : null,
		fpControl : null,
		activeBaseLayer : null,
		tileDefault : null,
		markers : null,
		vector : null,
		tileOSM : null,
		tilenaqsha : null,
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
		weatherSelectControl : null,
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
		get_wms_url : function(bounds) {

			// recalculate bounds from Google to WGS
			   var proj = new OpenLayers.Projection('EPSG:4326');
			   bounds.transform(APP.map.getProjectionObject(), proj);



            // bounds.left += this.deltaX;
            // bounds.right += this.deltaX;
            // bounds.top += this.deltaY;
            // bounds.bottom += this.deltaY;

            //construct WMS request

          var url = this.url;
            url += '&REQUEST=GetMap';
            url += '&SERVICE=WMS';
            url += '&VERSION=1.1.1';
            url += '&LAYERS='+ this.layers;
            url += '&FORMAT=' + this.format;
            url += '&TRANSPARENT=TRUE';
            url += '&SRS=' + 'EPSG:4326';
            url += '&BBOX=' + bounds.toBBOX();
            url += '&WIDTH=' + this.tileSize.w;
            url += '&HEIGHT=' + this.tileSize.h;
            return url;

       },
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
				// url : 'check-nodes.json',
				url : 'php/getJSON4tree.php',
				success: function(resp) {
					var root = Ext.decode(resp.responseText);
					for (var i=0;i<root.length;i++){
						var layerFolders = root[i].children;
						// console.log(root[i].group);
						for (var ix=0;ix<layerFolders.length;ix++){
							
							if (layerFolders[ix].layertype != 'WMS'){
								
								var parentUrl = window.location.href;
								parentUrl = parentUrl.substring( 0, parentUrl.lastIndexOf( "/" ) + 1);
								/// create layer object based on group property
								
								APP.map.addLayer(new OpenLayers.Layer.WMS(layerFolders[ix].layer,
				                   	// ["php/getmap.php","http://map1.oasispakistan.pk/getmap.php","http://map2.oasispakistan.pk/getmap.php","http://map3.oasispakistan.pk/getmap.php","http://map4.oasispakistan.pk/getmap.php"],
				                   	["php/getmap.php","php/getmap.php"],
				                   	{
				                   		layers: layerFolders[ix].layer,	
				                   		SLD: parentUrl + "sld/"+layerFolders[ix].category,
				                   		transparent: true,
				                   		text : layerFolders[ix].text,
				                   		group : 'Base Layers'
				                   	}, {
				                   		isBaseLayer : false,
				                		visibility : false,
					               		singleTile : true,
					               		transitionEffect:'resize'
				                }));	
			               
							} else {
								
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
						                   		singleTile : true,
						                   		transitionEffect:'resize',
						                   		opacity: layerFolders[ix].opacity / 100
					                     }));
							
							}	                     
			                
			                     
						}
					}
					  
                                   
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
						 // console.log(APP.viewport.items.items[1]);
						 // APP.viewport.items.items[1].collapse();
						 // APP.viewport.items.items[1].expand();
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
					 if (ctrl.id == 'NaqshaNet Map'){
						 APP.map.setBaseLayer(APP.tilenaqsha);
						 UTILS.showHelpTip('NaqshaNet Map', '...', 3600);
					 }

					if (APP.viewport.items.items[1].width!=300){
						 APP.viewport.items.items[1].width = 300;
					} else {
						 APP.viewport.items.items[1].width = 301;
					}	 
					APP.viewport.doLayout();
					 // APP.map.updateSizeDestroy();	 
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
								}, {
									fieldLabel: '',
									labelSeparator: '',
									boxLabel: 'NaqshaNet Map',
									id: 'NaqshaNet Map',
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
									    text: 'World Bank Statistics',  
									    iconCls : 'wb_button',    
									    enableToggle : true,
									    hidden : true,
									    handler: function() {
									       
									       /// here
											
									    }
									}),
								Ext.create('Ext.Button', {
									    text: 'Clear Selected Feature',  
									    iconCls : 'refresh',    
									    handler: function() {
									       
									        if (APP.hilites.features.length > 0){
												APP.hilites.removeAllFeatures();
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
		    
		    this.tilenaqsha = new OpenLayers.Layer.TMS(
		        "NaqshaMap",
		        "http://tiles.naqsha.net/Tiles/",
		        {
		            type: 'png', 
		            getURL: this.getTileURL,
		            displayOutsideMaxExtent: true,
		            attribution: '',
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
                {
                	isBaseLayer:false, 
                	features:[], 
                	visibility:true, 
                	style:highlight_style,
                	rendererOptions: { zIndexing: true }
                }
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
                   	

	             

			
			this.map.addLayers([ this.gstr, this.tileOSM, this.ghyb, this.gsat, this.gphy, this.arcstreet, this.arctopo, this.arcimage, this.tilenaqsha, this.vector, this.dataLayer, this.hilites, this.markers]);
			
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
			
			// this.map.addControl(selectfire24);
			// this.map.addControl(selectfire48);
// 			
			// selectfire24.activate();
			// selectfire48.activate();
			//this.map.zoomTo(3);
			
			var initCenter = new OpenLayers.LonLat(this.defLng, this.defLat);
			initCenter.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
			this.map.setCenter(initCenter, APP.defZoom);
			
			//var initCenter = new OpenLayers.LonLat(41, 34.5);
                        //initCenter.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
                        ///this.map.setCenter(initCenter, 7);

			
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
			// var ppData = {"rows":"25","os":"0","page":"1","total":"25","projects":{"P118177":{"id":"P118177","project_name":"Pakistan: Sindh Skills Development Project","boardapprovaldate":"2011-05-31T00:00:00Z","totalamt":"21,000,000","url":"http://www.worldbank.org/projects/P118177/sindh-skills-development-project?lang=en","project_abstract":{"cdata":"The objective of the Sindh Skills Development Project for Pakistan is to support the Government of Sindh in strengthening its training programs to improve the skills set and employability of trainees. There are three components to the project. The first component is support to the Benazir Bhutto Shaheed Youth Development Program (BBSYDP): the program aims to train unemployed youth through short-term training on a contract-basis with performance benchmarks; the second component is establish demand-driven institutional training programs: this pilot sector program will competitively select hundred training programs for re-design or creation to meet demonstrated local labor market needs; and the third component is capacity building of Sindh Technical Education and Vocational Training Authority (TEVTA): this component will strengthen Sindh TEVTA in implementation of second component , collecting and using performance information, and policymaking."},"sector":[{"Name":"Vocational training","code":"EX"},{"Name":"Other social services","code":"JX"},{"Name":"Public administration- Education","code":"BX"}],"countrycode":"PK","locations":[{"geoLocId":"0001164807","geoLocName":"Sindh","latitude":"26.134558","longitude":"68.769602","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P124913":{"id":"P124913","project_name":"Pakistan - Sindh Education Sector Additional Financing","boardapprovaldate":"2011-03-24T00:00:00Z","totalamt":"50,000,000","url":"http://www.worldbank.org/projects/P124913/sindh-education-sector-additional-financing?lang=en","project_abstract":{"cdata":"The objective of the additional financing for the Sindh Education Sector Project (SEP) for Pakistan is to support the government of Sindh's medium-term Sindh Education Sector Reform Program (SERP). The objectives of SERP are to increase school participation, reduce gender and rural-urban disparities, increase progression, and improve the measurement of student learning. The additional financing will leverage its resources to support the launch of two new education sector reform activities and the extension of one existing reform activity under SEP. The activities comprise of the (1) rationalization of teachers across schools and the formal allocation of teaching posts to schools; (2) preparation and management of school-specific nonsalary budgets; and (3) extension of the existing district Education Management Reform initiative to additional districts."},"sector":[{"Name":"General education sector","code":"EX"},{"Name":"Public administration- Education","code":"BX"}],"countrycode":"PK","locations":[{"geoLocId":"0001164807","geoLocName":"Sindh","latitude":"26.134558","longitude":"68.769602","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P121394":{"id":"P121394","project_name":"Pakistan: Khyber Pakhtunkhwa (KP) and Federally Administered Tribal Areas (FATA) Emergency Recovery Project","boardapprovaldate":"2011-01-20T00:00:00Z","totalamt":"250,000,000","url":"http://www.worldbank.org/projects/P121394/kp-fata-emergency-recovery-project?lang=en","project_abstract":{"cdata":"The objective of the Khyber Pakhtunkhwa and Federally Administered Tribal Areas (FATA) Emergency Recovery Project for Pakistan is to support the Government of Pakistan, and specifically the Khyber Pakhtunkhwa (KP) province and FATA, in their recovery efforts through (a) providing safety net support grants to poor and vulnerable households affected by the militancy crisis in the target areas; (b) providing conditional cash transfers (CCTs) for human development to poor and vulnerable households in the target areas; and (c) strengthening necessary capacities and systems for post-disaster safety nets. This project has 3 components. Component 1 comprises of creating safety net support grants to poor and vulnerable households affected by militancy crisis. This component will help mitigate the adverse poverty impact of conflict by providing targeted safety net support grants through monthly cash transfers provided for the duration of six months to each eligible household. Component 2 uses conditional cash transfers (CCTs) for human development. These cash grants will encourage behaviors that promote human development and also fund CCTs specific implementation support. Component 3 is capacity building and implementation support. This component will finance necessary capacity building and implementation support to the project implementation agency including financing of technical assistance, training, equipment, and software, as well as incremental operating costs."},"sector":[{"Name":"Public administration- Other social services","code":"BX"},{"Name":"Other social services","code":"JX"},{"Name":"General education sector","code":"EX"},{"Name":"Health","code":"JX"}],"countrycode":"PK","locations":[{"geoLocId":"0001164211","geoLocName":"Swat District","latitude":"35.241602","longitude":"72.499333","country":"PK"},{"geoLocId":"0001170122","geoLocName":"Mohmand Agency","latitude":"34.46386","longitude":"71.351161","country":"PK"},{"geoLocId":"0001179754","geoLocName":"Upper Dir District","latitude":"35.308785","longitude":"72.046918","country":"PK"},{"geoLocId":"0001182146","geoLocName":"Buner District","latitude":"34.443014","longitude":"72.499333","country":"PK"},{"geoLocId":"0001183781","geoLocName":"Bajaur Agency","latitude":"34.757318","longitude":"71.490673","country":"PK"},{"geoLocId":"0007419053","geoLocName":"Shangla District","latitude":"34.685156","longitude":"72.701385","country":"PK"},{"geoLocId":"0007419056","geoLocName":"Lower Dir District","latitude":"34.851941","longitude":"71.853352","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P112902":{"id":"P112902","project_name":"Karachi Port Improvement Project","boardapprovaldate":"2010-09-09T00:00:00Z","totalamt":"115,800,000","url":"http://www.worldbank.org/projects/P112902/karachi-port-improvement-project?lang=en","project_abstract":{"cdata":"The objective of the Karachi Port Improvement Project for Pakistan is to replace the lost port capacity and reduce shipping costs to the Pakistan economy through the reconstruction of the failed berths at Karachi port and increasing the effectiveness and efficiency of port operations and enhancing environmental sustainability. The Economic Coordination Committee of the Cabinet, through its decision dated June 29, 2010, agreed to the proposal of the Karachi Port Trust (KPT), setting out a rate of 8.2 percent for on-lending by the Government of Pakistan of the loan proceeds to Karachi Port Trust, the project implementing entity. However due to an oversight, the rate of 8 percent instead of 8.2 percent was reflected erroneously in Section I.B.1 (a) (iii) of schedule two of the loan agreement. This error requires correction though an amendment in the loan agreement."},"sector":[{"Name":"Ports, waterways and shipping","code":"TX"},{"Name":"Public administration- Transportation","code":"BX"}],"countrycode":"PK","locations":[{"geoLocId":"0007046272","geoLocName":"Karachi Shipyard","latitude":"24.8423","longitude":"66.9752","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P096745":{"id":"P096745","project_name":"Punjab Barrages Improvement Phase II Project (PBIP-II)","boardapprovaldate":"2010-07-01T00:00:00Z","totalamt":"145,600,000","url":"http://www.worldbank.org/projects/P096745/punjab-barrages-improvement-phase-ii-project-pbip-ii?lang=en","project_abstract":{"cdata":"The objectives of the Second Phase of the Punjab Barrages Improvement Project for Pakistan are to assist the Borrower in: (i) rehabilitating and modernizing Jinnah Barrage and carrying out affiliated works to enable reliable and uninterrupted supply of water for over 2.1 million acres of farmland benefitting about 600,000 farm families for irrigation and domestic water users; and (ii) build Irrigation and Power Department (IPD) capacity in improved water resources and irrigation system management. There are four components to the project, the first component being rehabilitation and modernization of Jinnah barrage. This component will support rehabilitation and modernization of Jinnah barrage, the implementation of social and environmental management plans, and construction supervision and support for the project's preparation and implementation. The Project Management Organization (PMO) of the Punjab's Irrigation and Power Department (IPD) will be responsible for implementation of this component. The second component is the improvement and modernization of the irrigation and water management system. This component consists of improvements in irrigation and water management systems, including development of management information system, monitoring and decision support system; modernization of water management equipment and facilities. The third component is the monitoring and evaluation of the project impact and social and environmental management plans. The monitoring and evaluation (M&E) activities will provide continuous feedback to the Government of Punjab (Gopunjab), Government of Pakistan (GOP), Project Steering Committee (PSC), the World Bank and implementing agencies on the project's performance and impact of its various components, so that corrective actions could be undertaken in a timely manner. Finally, the fourth component is the project management coordination technical assistance and training. This component will support the Government in implementing the project by coordinating all project related activities."},"sector":[{"Name":"Irrigation and drainage","code":"AX"},{"Name":"Public administration- Water, sanitation and flood protection","code":"BX"},{"Name":"Flood protection","code":"WX"},{"Name":"Water supply","code":"WX"}],"countrycode":"PK","locations":[{"geoLocId":"0001175718","geoLocName":"Jinnah Barrage","latitude":"32.91822","longitude":"71.522604","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P116355":{"id":"P116355","project_name":"Additional Financing for Sindh On-Farm Water Management Project","boardapprovaldate":"2009-06-30T00:00:00Z","totalamt":"50,000,000","url":"http://www.worldbank.org/projects/P116355/additional-financing-sindh-on-farm-water-management-project?lang=en","project_abstract":{"cdata":"The objective of the Additional Financing for Sindh On-Farm Water Management Project (SOFWMP) for Pakistan is to improve water resource management and enhance agricultural productivity in the project area through: (a) improving the efficiency, reliability, and equity of irrigation water distribution; (b) supporting agricultural productivity enhancement measures to complement and enhance the benefits of improved water management; and (c) enhancing long-term financial sustainability of the irrigation system by fostering self-sustaining farmer organizations at the watercourse level-Watercourse Association (WCA). In Sindh Province, there are about 42,000 watercourses, of which 17,000 watercourses have so far been improved under various on-farm water management programs, including SOFWMP. In the canal command areas of three Area Water Boards (AWBs) alone, where SOFWMP is being implemented, more than 6,000 watercourses remain unimproved. The GoSindh had a plan to improve all its watercourses by 2010 through the National Program for Improvement of Watercourses (NPIW). But, due to the current economic crisis and funding cuts for NPIW, it is unlikely that the plan will be implemented fully. The Bank's additional financing will meet a significant part of this unmet demand in watercourse improvement."},"sector":[{"Name":"Irrigation and drainage","code":"AX"},{"Name":"General agriculture, fishing and forestry sector","code":"AX"},{"Name":"Public administration- Agriculture, fishing and forestry","code":"BX"}],"countrycode":"PK","locations":[{"geoLocId":"0001164807","geoLocName":"Sindh","latitude":"26.134558","longitude":"68.769602","country":"PK"},{"geoLocId":"0001169351","geoLocName":"Nara Canal","latitude":"27.666667","longitude":"68.85","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P114508":{"id":"P114508","project_name":"Pakistan: Third Partnership for Polio Eradication Project","boardapprovaldate":"2009-06-18T00:00:00Z","totalamt":"74,680,000","url":"http://www.worldbank.org/projects/P114508/third-partnership-polio-eradication-project?lang=en","project_abstract":{"cdata":"The objective of the Third Partnership for Polio Eradication Project (TPPEP) is to assist Pakistan's efforts to eradicate polio through timely supply and effective use of the Oral Polio Vaccine (OPV) for the country's Supplemental Immunization Activities (SIA) during 2009-11. There are three components to the project, the first component of the project being procurement and timely supply and effective use of OPV. The TPPEP will provide financing for only the first component of Polio Eradication Initiative (PEI) as the previous projects, i.e., procurement and timely supply and effective use of OPV in Supplemental Immunization Activities (SIA) between August 2009 and June 2011 during SIA including several rounds of National Immunization Days (NID) and sub-national immunization days (SNID). The second component of the project is the supplemental immunization activities. This operation consists of: (a) maintaining cold chain; (b) social mobilization; (c) training; and (d) NID, SNID, and mop up operations. All implementation arrangements are in place for these operations. The system functions reasonably well, and during last two years PEI has maintained high coverage of the targeted population. Finally, the third component of the project is the surveillance, including laboratory and epidemiological surveillance. The surveillance system is fully functional and data is regularly reviewed by Technical Advisory Group (TAG) in collaboration with the national program, provincial and district managers and technical partners. All districts in the country regularly report information and many exceed the global standard on key indicators for quality reporting such as the like timely collection of stool samples, their transportation to the laboratory and the 60 day follow-up. Surveillance, assessment of OPV coverage and quality of campaign form the monitoring and evaluation system for PEI."},"sector":[{"Name":"Health","code":"JX"}],"countrycode":"PK","locations":[{"geoLocId":"0001162015","geoLocName":"Islamabad Capital Territory","latitude":"33.710395","longitude":"73.133821","country":"PK"},{"geoLocId":"0001168873","geoLocName":"Khyber Pakhtunkhwa Province","latitude":"34.459933","longitude":"72.502373","country":"PK"},{"geoLocId":"0001179245","geoLocName":"Federally Administered Tribal Areas","latitude":"33.014548","longitude":"69.999248","country":"PK"},{"geoLocId":"0001184196","geoLocName":"Azad Kashmir","latitude":"33.947179","longitude":"73.910401","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P102608":{"id":"P102608","project_name":"Pakistan: Punjab Education Sector Project","boardapprovaldate":"2009-06-04T00:00:00Z","totalamt":"350,000,000","url":"http://www.worldbank.org/projects/P102608/punjab-education-sector-project?lang=en","project_abstract":{"cdata":"The objectives of the Punjab Education Sector Project for Pakistan are to improve access and equity, and the quality and relevance of education in Punjab. The project will support, which aims to: (i) enhance fiscal sustainability and the effectiveness of public expenditures including in education; (ii) enhance the quality of school education; (iii) improve and expand access through improvements in school participation and completion rates and reduction in gender and regional disparities; and (iv) strengthen school management and governance in the education sector. There are two components to the project. The first component of the project is program financing, this component accounts for the large part of the total financing provided by the Bank and development partners. The second component of the project is technical assistance, this component will provide support to strengthen existing capacities for implementation and monitoring of the sector program."},"sector":[{"Name":"Primary education","code":"EX"},{"Name":"Secondary education","code":"EX"},{"Name":"Public administration- Education","code":"BX"}],"countrycode":"PK","locations":[{"geoLocId":"0001167710","geoLocName":"Punjab","latitude":"30.860168","longitude":"72.319759","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P107300":{"id":"P107300","project_name":"Pakistan: Sindh Education Ssector Project (SEP)","boardapprovaldate":"2009-06-04T00:00:00Z","totalamt":"300,000,000","url":"http://www.worldbank.org/projects/P107300/sindh-education-sector-project-sep?lang=en","project_abstract":{"cdata":"The development objective of the Sindh Education Sector Project (SEP) of Pakistan is to support the Government of Sindh's Medium Term Education Sector Reform Program (SERP). The objectives of SERP are to increase school participation, reduce gender and rural-urban disparities, increase progression, and improve the measurement of student learning. There are two components to the project, the first component of the project being financing of SERP.  This component finances key Eligible Expenditure Programs (EEP) up to capped absolute amounts, with disbursements based on the achievements of agreed indicators. These disbursement linked indicators (DLI) reflect intermediate outcome or implementation performance indicators that are critical to the achievement of the project's education development outcomes. The SERP activities and sub-programs fall within four broad thrust areas which aim to improve: 1) fiscal sustainability and the effectiveness of public expenditures including in education; 2) education sector management; 3) access to quality schooling with a particular focus on rural children and girls; and 4) the quality of teaching and student learning. The second component of the project is the technical assistance.  This component finances capacity building and strengthens fiduciary, safeguard, and monitoring and evaluation systems."},"sector":[{"Name":"Public administration- Education","code":"BX"},{"Name":"General education sector","code":"EX"},{"Name":"Secondary education","code":"EX"}],"countrycode":"PK","locations":[{"geoLocId":"0001164807","geoLocName":"Sindh","latitude":"26.134558","longitude":"68.769602","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P101684":{"id":"P101684","project_name":"Trade and Transport Facilitation II","boardapprovaldate":"2009-05-12T00:00:00Z","totalamt":"25,000,000","url":"http://www.worldbank.org/projects/P101684/trade-transport-facilitation-ii?lang=en","project_abstract":{"cdata":"The development objective of the Second Trade and Transport Facilitation Project for Pakistan is to improve performance of trade and transport logistics by facilitating: (a) the implementation of the National Trade Corridor Improvement Program (NTCIP); and (b) the simplification and modernization of Pakistan's international trade procedures and practices. There are two components to the project. The first component of the project is National Trade Corridor (NTC). This component includes studies and technical assistance for analytical work to underpin key reforms, help assess and design prospective investments and build capacity to implement the Government's NTCIP in the following sub-sectors: ports, railways, road freight industry, highways, air transport, energy logistics, and other transport logistics. The second component of the project is Trade and Transport Facilitation (TTF). This component builds on the results achieved by the first trade and transport facilitation project closed in 2006, extending efforts to streamline and integrate trade data exchange and official controls, sustain public/private sector collaborative institutional framework and strengthen the domestic logistic industry."},"sector":[{"Name":"Public administration- Transportation","code":"BX"},{"Name":"Public administration- Industry and trade","code":"BX"}],"countrycode":"PK","locations":[{"geoLocId":"0001167710","geoLocName":"Punjab","latitude":"30.860168","longitude":"72.319759","country":"PK"},{"geoLocId":"0001169946","geoLocName":"Port Muhammad Bin Qasim","latitude":"24.78206","longitude":"67.33624","country":"PK"},{"geoLocId":"0001174872","geoLocName":"Karachi","latitude":"24.9056","longitude":"67.0822","country":"PK"},{"geoLocId":"0001177446","geoLocName":"Gwadar","latitude":"25.12163","longitude":"62.325411","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P106652":{"id":"P106652","project_name":"Pakistan: Lahore Composting project","boardapprovaldate":"2008-08-27T00:00:00Z","totalamt":"0","url":"http://www.worldbank.org/projects/P106652/pakistan-lahore-composting-project?lang=en","sector":[{"Name":"Solid waste management","code":"WX"}],"countrycode":"PK","locations":[{"geoLocId":"0001172451","geoLocName":"Lahore","latitude":"31.549722","longitude":"74.343611","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P101640":{"id":"P101640","project_name":"Pakistan Community-Based Renewable Energy Development in Northern Areas and Chithral","boardapprovaldate":"2008-06-30T00:00:00Z","totalamt":"0","url":"http://www.worldbank.org/projects/P101640/pakistan-community-based-renewable-energy-development-northern-areas-chithral?lang=en","sector":[{"Name":"Renewable energy","code":"LX"}],"countrycode":"PK","locations":[{"geoLocId":"0001168878","geoLocName":"Northern Areas","latitude":"36","longitude":"75","country":"PK"},{"geoLocId":"0001181064","geoLocName":"Chitral District","latitude":"36.258291","longitude":"72.243024","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P110099":{"id":"P110099","project_name":"Water Sector Capacity Buildling and Advisory Services Project (WCAP)","boardapprovaldate":"2008-06-26T00:00:00Z","totalamt":"38,000,000","url":"http://www.worldbank.org/projects/P110099/water-sector-capacity-buildling-advisory-services-project-wcap?lang=en","project_abstract":{"cdata":"The objective of the Water Sector Capacity Building and Advisory Services Project for Pakistan is to improve management and investment planning of water resources in the Indus River Basin. There are three components to the project. The first component of the project is capacity building of and support to federal institutions in water resources planning and management. This component will provide for capacity building of and support to federal institutions involved in water resources planning, management and development. The component includes, among other things, support for building human resources and institutional capacity in the federal institutions and support for developing studies, strategies and plans for improving water resources planning and management. The second component of the project is improvement in water resources management and development. This component will include inter-alia: (i) upgrading of existing tools, databases, models and management systems; (ii) sediment management studies for the Indus system and possibility of flushing sediments through the Tarbela reservoir and its impact basin wide; (iii) preparation of a power investment plan with focus on hydropower development in the upper Indus and conjunctive operation of dams and infrastructure; and (iv) feasibility studies and preparation of designs for quickly/easily implement able hydropower plants suitable for financing by international financial institutions. The third and the final component of the project is project management coordination, additional studies, training. This component will support the Government, in particular the ministry of water and power (MoWP) with project management, including coordination of all project related activities and monitoring and evaluation of project impacts and technical and financial audits. This will also support institutional strengthening and training of staff involved in water resources management."},"sector":[{"Name":"General water, sanitation and flood protection sector","code":"WX"},{"Name":"Central government administration","code":"BX"},{"Name":"Hydropower","code":"LX"}],"countrycode":"PK","locations":[{"geoLocId":"0001164807","geoLocName":"Sindh","latitude":"26.134558","longitude":"68.769602","country":"PK"},{"geoLocId":"0001167710","geoLocName":"Punjab","latitude":"30.860168","longitude":"72.319759","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P095982":{"id":"P095982","project_name":"Electricity Distribution and Transmission Improvement Project","boardapprovaldate":"2008-06-17T00:00:00Z","totalamt":"256,700,000","url":"http://www.worldbank.org/projects/P095982/electricity-distribution-transmission-improvement-project?lang=en","project_abstract":{"cdata":"The objectives of the Electricity Distribution and Transmission Improvement Project for Pakistan are to: (i) strengthen the capacity of the distribution and transmission networks to meet increasing electricity demand in the selected areas more efficiently and with better reliability and quality; and (ii) strengthen institutional capacity of the selected distribution companies and support other priority areas of the power sector reform. The project includes the following components: (i) physical strengthening of distribution networks operated by four distribution companies (Hyderabad Electric Supply Company (HESCO), Islamabad Electric Supply Company (IESCO), Lahore Electric Supply Company (LESCO), and Multan Electric Power Supply Company (MEPCO); (ii) removing some bottlenecks in the transmission grid, operated by National Transmission and Dispatch Company (NTDC); (iii) technical assistance for capacity building, specialized studies, energy efficiency, and sector reform; and (iv) a pilot energy efficiency program, involving installation of energy saving equipment at the customer level."},"sector":[{"Name":"Transmission and Distribution of Electricity","code":"LX"},{"Name":"Energy efficiency in Heat and Power","code":"LX"},{"Name":"Central government administration","code":"BX"}],"countrycode":"PK","locations":[{"geoLocId":"0001169825","geoLocName":"Multan","latitude":"30.195556","longitude":"71.475278","country":"PK"},{"geoLocId":"0001172451","geoLocName":"Lahore","latitude":"31.549722","longitude":"74.343611","country":"PK"},{"geoLocId":"0001174628","geoLocName":"Kassowal","latitude":"30.483333","longitude":"72.533333","country":"PK"},{"geoLocId":"0001176734","geoLocName":"Hyderabad","latitude":"25.3823","longitude":"68.3699","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P089378":{"id":"P089378","project_name":"Balochistan Small Scale Irrigation Project","boardapprovaldate":"2008-02-26T00:00:00Z","totalamt":"25,000,000","url":"http://www.worldbank.org/projects/P089378/balochistan-small-scale-irrigation-project?lang=en","project_abstract":{"cdata":"The objectives of the Balochistan Small Scale Irrigation Project for Pakistan are: (a) to restore and increase water storage in the Band Khushdil Khan (BKK); (b) to increase water productivity through a combination of engineering, management and agricultural measures in the Pishin Lora Basin (PLB); and (c) to build the local capacity in implementing such schemes and in formulating a plan for sustainable water resources development and watershed management. Under this restructuring the closing date is to be extended from June 30, 2013 to December 31, 2014. Additional funds are not required to complete project activities by the closing date. The project is rated satisfactory and the project development objective is expected to be achieved without any further delay."},"sector":[{"Name":"Irrigation and drainage","code":"AX"}],"countrycode":"PK","locations":[{"geoLocId":"0001167527","geoLocName":"Quetta District","latitude":"30.174576","longitude":"66.762027","country":"PK"},{"geoLocId":"0001167820","geoLocName":"Pishin District","latitude":"30.818095","longitude":"67.213891","country":"PK"},{"geoLocId":"0001175293","geoLocName":"Kalat District","latitude":"28.882421","longitude":"66.531649","country":"PK"},{"geoLocId":"0001183606","geoLocName":"Balochistan","latitude":"28.478488","longitude":"65.643553","country":"PK"},{"geoLocId":"0006280365","geoLocName":"Khushdil Khan Bund","latitude":"30.675","longitude":"67.061389","country":"PK"},{"geoLocId":"0006641952","geoLocName":"Mastung District","latitude":"29.794547","longitude":"66.720678","country":"PK"},{"geoLocId":"0006641961","geoLocName":"Qila Abdullah District","latitude":"30.69854","longitude":"66.556112","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P084302":{"id":"P084302","project_name":"Sindh Water Sector Improvement Project Phase I","boardapprovaldate":"2007-09-18T00:00:00Z","totalamt":"150,200,000","url":"http://www.worldbank.org/projects/P084302/sindh-water-sector-improvement-project-phase?lang=en","project_abstract":{"cdata":"The overarching objective of Phase 1 of the Sindh Water Sector Improvement Project of Pakistan is to improve the efficiency and effectiveness of irrigation water distribution in three area water boards (AWBs) (Ghotlu, Nara and Left Bank), particularly with respect to measures of reliability, equity and user satisfaction. This would be achieved by: (a) deepening and broadening the institutional reforms that are already underway in Sindh; (b) improving the irrigation system in a systematic way covering key hydraulic infrastructure, main and branch canals, and distributaries and minors; and (c) enhancing long-term sustainability of irrigation system through participatory irrigation management and developing institutions for improving operation and maintenance of the system and cost recovery. There are 5 components to the project: 1) Community Development and Capacity Building through which Sindh Irrigation and Drainage Authority (SIDA)'s AWBs', and Farmers Organizations (FO)s' capacity will be strengthened enabling them to perform their responsibilities according to the Sind Water Management Ordinance of 2002, and under the Project. The Project will strengthen the capacity of FOs to carry out operation and maintenance o f the irrigation and drainage systems; 2) Rehabilitation and Improvement of Irrigation and Drainage System by which the main and branch canals, distributaries/minors (secondary level canals) and drainage system in FOs areas will be rehabilitated and improved and a modern water measurement and accounting system would be installed throughout the canal systems in three AWBs, Ghotki, Nara and Left Bank; 3) Management Plans for Major Irrigation & Drainage (I&D) infrastructure whereby a feasibility study for rehabilitation of the Gudu barrage will be prepared and assistance will be provided for preparing studies for rehabilitation of Sukkur and Kotri barrages; 4) Monitoring and Evaluation of the Project Impact and Environmental Management Plan which will be for monitoring and evaluation and supervision of the environment management plan and social action plan; and 5) Project Coordination, Monitoring, Technical Assistance and Training to support the project coordination, monitoring of implementation activities, management and supervision of procurement by an independent project management consultant/procurement agent, and technical assistance and training."},"sector":[{"Name":"Irrigation and drainage","code":"AX"},{"Name":"Sub-national government administration","code":"BX"}],"countrycode":"PK","locations":[{"geoLocId":"0001164807","geoLocName":"Sindh","latitude":"26.134558","longitude":"68.769602","country":"PK"},{"geoLocId":"0001169351","geoLocName":"Nara Canal","latitude":"27.666667","longitude":"68.85","country":"PK"},{"geoLocId":"0001178454","geoLocName":"Ghotki Canal","latitude":"28.45","longitude":"69.766667","country":"PK"},{"geoLocId":"0001414173","geoLocName":"Akram Wah","latitude":"25.4399","longitude":"68.3299","country":"PK"},{"geoLocId":"0007322798","geoLocName":"Fuleli Canal","latitude":"25.151027","longitude":"68.511855","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P090501":{"id":"P090501","project_name":"Land Records Management and Information Systems Program (LRMIS-P) Province of Punjab","boardapprovaldate":"2007-01-25T00:00:00Z","totalamt":"45,650,000","url":"http://www.worldbank.org/projects/P090501/land-records-management-information-systems-program-lrmis-p-province-punjab?lang=en","project_abstract":{"cdata":"The objectives of the Punjab Land Records Management and Information Systems Project are to improve the land records service delivery of the Province of Punjab, contributing to long-lasting tenure security and more efficient operation of land markets. The Project will upgrade the land records management system for Punjab Province by revising current business processes and associated legislation and regulations, establishing Service Centers where land records will be maintained and available to the public in digital form, and establishing linkages between the land records system and the system for registration o f deeds. The project will have four components: (a) the first component will address improvements in business processes and increased institutional capacity at the provincial, district, and lower administrative levels; (b) the second component will be putting in place the automated land record system, including the applied software; (c) the third component will focus on improved service delivery to the population, and include a set of public outreach activities and; (d) the fourth component will deal with project management, monitoring and evaluation."},"sector":[{"Name":"Sub-national government administration","code":"BX"}],"countrycode":"PK","locations":[{"geoLocId":"0001167458","geoLocName":"Rahimyar Khan District","latitude":"28.460202","longitude":"70.528368","country":"PK"},{"geoLocId":"0001167710","geoLocName":"Punjab","latitude":"30.860168","longitude":"72.319759","country":"PK"},{"geoLocId":"0001172451","geoLocName":"Lahore","latitude":"31.549722","longitude":"74.343611","country":"PK"},{"geoLocId":"0001174623","geoLocName":"Kasur District","latitude":"31.006952","longitude":"74.135338","country":"PK"},{"geoLocId":"0001177651","geoLocName":"Gujrat District","latitude":"32.700495","longitude":"74.054468","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P094086":{"id":"P094086","project_name":"Pakistan: Balochistan Education Support Project - BESP","boardapprovaldate":"2006-06-22T00:00:00Z","totalamt":"22,000,000","url":"http://www.worldbank.org/projects/P094086/balochistan-education-support-project-besp?lang=en","project_abstract":{"cdata":"The development objective of the Balochistan Education Support Project for Pakistan is to promote public-private and community partnerships to improve access to quality primary education, in particular for girls. The extension is necessary to complete activities planned under the construction phase of the Project. At appraisal, the team projected that about 450 of the 650 community schools would meet the criteria established to be eligible for a building. In light of the findings of the Third Party Validation (TPV) and discussions with Balochistan Education Foundation (BEF) and the implementation partners, all 649 community schools established by the project are eligible for a building as per the criteria established at appraisal. This has meant that an additional 199 school buildings will need to be constructed. The bank team recognizes that the deteriorating security situation makes it difficult for external agents to operate freely in the province and that the strategy would require additional time to implement. The Government has requested an extension of 18 months to complete the construction phase in view of the two factors. This will be the first extension of the project."},"sector":[{"Name":"Primary education","code":"EX"},{"Name":"Other social services","code":"JX"}],"countrycode":"PK","locations":[{"geoLocId":"0001183606","geoLocName":"Balochistan","latitude":"28.478488","longitude":"65.643553","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P083929":{"id":"P083929","project_name":"Punjab Municipal Services Improvement Project (PMSIP)","boardapprovaldate":"2006-06-01T00:00:00Z","totalamt":"50,000,000","url":"http://www.worldbank.org/projects/P083929/punjab-municipal-services-improvement-project-pmsip?lang=en","project_abstract":{"cdata":"The objective of the Punjab Municipal Services Improvement Project for Pakistan is to improve the viability and effectiveness of urban services provided by the participating Tehsil Municipal Administrations (TMAs), and to make such improvements sustainable and replicable in other TMAs through the creation of a performance-based management framework at both TMA and provincial levels. The closing of the project will be extended be from the current closing date of November 30, 2012 to November 30, 2013. This is the second extension of the project (previously extended by 23 months) and constitutes a level two restructuring for approval, since this extension exceeds a two year extension from the original project closing date of December 31, 2010. The extension is necessary to: ensure that implementation of the pilot project in the Walled City of Lahore is completed; enable Punjab Municipal Development Fund Company (PMDFC) to more gainfully and sustainably institutionalize the reform initiatives under the project's Institutional Development (ID) sub-component; complete establishment of a system of vertical linkages between TMA-level reforms and the provincial Local Government and Community Development Department (LG&CDD); and ensure that the entire set of infrastructure investments under the project is fully operational and providing the envisaged service benefits to the citizens."},"sector":[{"Name":"Water supply","code":"WX"},{"Name":"Urban Transport","code":"TX"},{"Name":"Solid waste management","code":"WX"},{"Name":"Wastewater Collection and Transportation","code":"WX"},{"Name":"Sub-national government administration","code":"BX"}],"countrycode":"PK","locations":[{"geoLocId":"0001163272","geoLocName":"Toba Tek Singh","latitude":"30.974589","longitude":"72.482659","country":"PK"},{"geoLocId":"0001164069","geoLocName":"Talagang","latitude":"32.929731","longitude":"72.415829","country":"PK"},{"geoLocId":"0001164988","geoLocName":"Shorkot","latitude":"30.8347","longitude":"72.077712","country":"PK"},{"geoLocId":"0001167710","geoLocName":"Punjab","latitude":"30.860168","longitude":"72.319759","country":"PK"},{"geoLocId":"0001168036","geoLocName":"Pind Dadan Khan","latitude":"32.587887","longitude":"73.045638","country":"PK"},{"geoLocId":"0001171502","geoLocName":"Mailsi","latitude":"29.800278","longitude":"72.175833","country":"PK"},{"geoLocId":"0001171965","geoLocName":"Lodhran","latitude":"29.540507","longitude":"71.63357","country":"PK"},{"geoLocId":"0001174625","geoLocName":"Kasur","latitude":"31.115556","longitude":"74.446667","country":"PK"},{"geoLocId":"0001175864","geoLocName":"Jhelum","latitude":"32.933132","longitude":"73.726367","country":"PK"},{"geoLocId":"0001177662","geoLocName":"Gujranwala","latitude":"32.161667","longitude":"74.188309","country":"PK"},{"geoLocId":"0001179450","geoLocName":"Dunyapur","latitude":"29.799502","longitude":"71.719581","country":"PK"},{"geoLocId":"0001180436","geoLocName":"Daska","latitude":"32.324262","longitude":"74.349741","country":"PK"},{"geoLocId":"0001181096","geoLocName":"Chiniot","latitude":"31.72","longitude":"72.978889","country":"PK"},{"geoLocId":"0001181636","geoLocName":"Chakwal","latitude":"32.933333","longitude":"72.866667","country":"PK"},{"geoLocId":"0001182786","geoLocName":"Bhalwal","latitude":"32.9772","longitude":"73.897272","country":"PK"},{"geoLocId":"0001184249","geoLocName":"Attock City","latitude":"33.772222","longitude":"72.368333","country":"PK"},{"geoLocId":"0001341474","geoLocName":"Fateh Jang","latitude":"33.217413","longitude":"72.710845","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P100155":{"id":"P100155","project_name":"Highways Rehabilitation Project","boardapprovaldate":"2006-03-29T00:00:00Z","totalamt":"65,000,000","url":"http://www.worldbank.org/projects/P100155/highways-rehabilitation-project?lang=en","project_abstract":{"cdata":"This Project Paper seeks the approval of the Executive Directors to provide an additional loan in the amount of US$ 65 million to Pakistan Highways Rehabilitation Project. The proposed additional loan will help finance the costs associated with cost overrun. There will be no change to the ongoing project activities. The expected outcome is the sustainable delivery of a productive and efficient national highway network, contributing to lower transportation costs."},"sector":[{"Name":"Rural and Inter-Urban Roads and Highways","code":"TX"},{"Name":"Central government administration","code":"BX"}],"countrycode":"PK","locations":[{"geoLocId":"0001167710","geoLocName":"Punjab","latitude":"30.860168","longitude":"72.319759","country":"PK"},{"geoLocId":"0001172451","geoLocName":"Lahore","latitude":"31.549722","longitude":"74.343611","country":"PK"},{"geoLocId":"0001177662","geoLocName":"Gujranwala","latitude":"32.161667","longitude":"74.188309","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P099040":{"id":"P099040","project_name":"HIGHWAYS REHABILITATION PROJECT","boardapprovaldate":"2005-12-01T00:00:00Z","totalamt":"100,000,000","url":"http://www.worldbank.org/projects/P099040/highways-rehabilitation-project?lang=en","project_abstract":{"cdata":"The proposed additional loan for the Highways Rehabilitation Project for Pakistan will help finance the costs associated with restructuring of HRP to urgently address reconstruction/rehabilitation of four main highways that were damaged by the earthquake of October 8, 2005. There will be no change to the ongoing project activities. Most of the remaining funds have been committed, with a large number of contracts ongoing, and it will be important to complete ongoing activities as planned in order to achieve the original project development objective. The new component, to be implemented in parallel to the original components, will also be implemented by the National Highway Authority (NHA) through its fully staffed Project Management Unit (PMU) that has sufficient technical and fiduciary capacity."},"sector":[{"Name":"Rural and Inter-Urban Roads and Highways","code":"TX"},{"Name":"Central government administration","code":"BX"}],"countrycode":"PK","locations":[{"geoLocId":"0001163655","geoLocName":"Thakot","latitude":"34.75","longitude":"72.916667","country":"PK"},{"geoLocId":"0001164807","geoLocName":"Sindh","latitude":"26.134558","longitude":"68.769602","country":"PK"},{"geoLocId":"0001166993","geoLocName":"Rawalpindi","latitude":"33.6007","longitude":"73.0679","country":"PK"},{"geoLocId":"0001167710","geoLocName":"Punjab","latitude":"30.860168","longitude":"72.319759","country":"PK"},{"geoLocId":"0001168197","geoLocName":"Peshawar","latitude":"34.008366","longitude":"71.580182","country":"PK"},{"geoLocId":"0001168873","geoLocName":"Khyber Pakhtunkhwa Province","latitude":"34.459933","longitude":"72.502373","country":"PK"},{"geoLocId":"0001169336","geoLocName":"Naran","latitude":"34.9","longitude":"73.65","country":"PK"},{"geoLocId":"0001169607","geoLocName":"Muzaffarabad","latitude":"34.37","longitude":"73.471111","country":"PK"},{"geoLocId":"0001171613","geoLocName":"Mahandri","latitude":"34.69153","longitude":"73.577225","country":"PK"},{"geoLocId":"0001172451","geoLocName":"Lahore","latitude":"31.549722","longitude":"74.343611","country":"PK"},{"geoLocId":"0001173511","geoLocName":"Kohala","latitude":"33.852995","longitude":"72.965311","country":"PK"},{"geoLocId":"0001174872","geoLocName":"Karachi","latitude":"24.9056","longitude":"67.0822","country":"PK"},{"geoLocId":"0001176734","geoLocName":"Hyderabad","latitude":"25.3823","longitude":"68.3699","country":"PK"},{"geoLocId":"0001178336","geoLocName":"Gilgit District","latitude":"36.25","longitude":"74.25","country":"PK"},{"geoLocId":"0001181707","geoLocName":"Chakothi","latitude":"34.116667","longitude":"73.883333","country":"PK"},{"geoLocId":"0001183105","geoLocName":"Batgram","latitude":"34.681841","longitude":"73.031712","country":"PK"},{"geoLocId":"0001183692","geoLocName":"Balakot","latitude":"34.553056","longitude":"73.348889","country":"PK"},{"geoLocId":"0001184196","geoLocName":"Azad Kashmir","latitude":"33.947179","longitude":"73.910401","country":"PK"},{"geoLocId":"0001407748","geoLocName":"Basian","latitude":"34.068056","longitude":"73.491389","country":"PK"},{"geoLocId":"0001478569","geoLocName":"Balakot","latitude":"35.324167","longitude":"72.604444","country":"PK"},{"geoLocId":"0007077265","geoLocName":"Battal","latitude":"33.871718","longitude":"73.248123","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P076872":{"id":"P076872","project_name":"Second Improvement to Financial Reporting and Auditing Project","boardapprovaldate":"2005-09-06T00:00:00Z","totalamt":"84,000,000","url":"http://www.worldbank.org/projects/P076872/second-improvement-financial-reporting-auditing-project?lang=en","project_abstract":{"cdata":"The development objectives of the Second Improvement to Financial Reporting and Auditing Project for Pakistan are to: (a) build capacity to improve accuracy, comprehensiveness, reliability, and timeliness of financial and fiscal reporting at all levels of government; (b) improve public financial management, accountability, and transparency; (c) enhance the capacity of public sector managers to use credible financial information for better and informed decision-making; and (d) facilitate oversight of the use of public monies, and increase the national and international credibility of governments financial statements and assurance processes. The project has established an accounting, reporting and audit system that covers core government entities at the federal, provincial, and district level. These achievements place Pakistan at the forefront of Public Financial Management (PFM) reform in the South Asia region and Pakistan is the only country in the region where SAP has been implemented successfully on such a large scale in the public sector. Specifically, the project has enabled timely and reliable reporting of accounts and audit certification of financial statements that are submitted to the legislature within 8 months after the financial yearend (previously up to 28 months). Transparency has improved due to the strengthening of internal controls and by enabling stakeholders to generate timely reports through the system. Accounting and payment processes that were adopted under the new system have made it possible to ensure accuracy, completeness, reliability, and timeliness of accounts. Further, system-generated monthly and quarterly fiscal reports have made possible timely macro-economic review and analysis by policy makers."},"sector":[{"Name":"Sub-national government administration","code":"BX"},{"Name":"Central government administration","code":"BX"},{"Name":"Banking","code":"FX"}],"countrycode":"PK","locations":[{"geoLocId":"0001162004","geoLocName":"Khairpur","latitude":"27.533333","longitude":"68.766667","country":"PK"},{"geoLocId":"0001162813","geoLocName":"Vihiri","latitude":"30.033333","longitude":"72.35","country":"PK"},{"geoLocId":"0001162862","geoLocName":"Uthal","latitude":"25.807222","longitude":"66.621944","country":"PK"},{"geoLocId":"0001162959","geoLocName":"Umarkot","latitude":"25.366667","longitude":"69.733333","country":"PK"},{"geoLocId":"0001163054","geoLocName":"Turbat","latitude":"26.003","longitude":"63.0434","country":"PK"},{"geoLocId":"0001163272","geoLocName":"Toba Tek Singh","latitude":"30.974589","longitude":"72.482659","country":"PK"},{"geoLocId":"0001163582","geoLocName":"Thatta","latitude":"24.747449","longitude":"67.923528","country":"PK"},{"geoLocId":"0001163952","geoLocName":"Tando Muhammad Khan","latitude":"25.133333","longitude":"68.533333","country":"PK"},{"geoLocId":"0001163965","geoLocName":"Tando Allahyar","latitude":"25.462626","longitude":"68.719233","country":"PK"},{"geoLocId":"0001164211","geoLocName":"Swat District","latitude":"35.241602","longitude":"72.499333","country":"PK"},{"geoLocId":"0001164216","geoLocName":"Swabi","latitude":"34.12","longitude":"72.472222","country":"PK"},{"geoLocId":"0001164536","geoLocName":"South Waziristan Agency","latitude":"32.303972","longitude":"69.682074","country":"PK"},{"geoLocId":"0001164896","geoLocName":"Sibi","latitude":"29.5448","longitude":"67.8764","country":"PK"},{"geoLocId":"0001165108","geoLocName":"Shikarpur","latitude":"27.957057","longitude":"68.637886","country":"PK"},{"geoLocId":"0001165221","geoLocName":"Sheikhupura","latitude":"31.713056","longitude":"73.978333","country":"PK"},{"geoLocId":"0001166000","geoLocName":"Sargodha","latitude":"32.083611","longitude":"72.671111","country":"PK"},{"geoLocId":"0001166164","geoLocName":"Sanghar","latitude":"26.033333","longitude":"68.95","country":"PK"},{"geoLocId":"0001166548","geoLocName":"Sahiwal","latitude":"30.666667","longitude":"73.1","country":"PK"},{"geoLocId":"0001166993","geoLocName":"Rawalpindi","latitude":"33.6007","longitude":"73.0679","country":"PK"},{"geoLocId":"0001167380","geoLocName":"Rajanpur","latitude":"29.103513","longitude":"70.325038","country":"PK"},{"geoLocId":"0001167528","geoLocName":"Quetta","latitude":"30.187222","longitude":"67.0125","country":"PK"},{"geoLocId":"0001167623","geoLocName":"Qambar","latitude":"27.166667","longitude":"67.65","country":"PK"},{"geoLocId":"0001167821","geoLocName":"Pishin","latitude":"30.580278","longitude":"66.996111","country":"PK"},{"geoLocId":"0001168197","geoLocName":"Peshawar","latitude":"34.008366","longitude":"71.580182","country":"PK"},{"geoLocId":"0001168555","geoLocName":"Pakpattan","latitude":"30.35","longitude":"73.4","country":"PK"},{"geoLocId":"0001168718","geoLocName":"Okara","latitude":"30.808056","longitude":"73.445833","country":"PK"},{"geoLocId":"0001168749","geoLocName":"Nushki","latitude":"29.55","longitude":"66.016667","country":"PK"},{"geoLocId":"0001168873","geoLocName":"Khyber Pakhtunkhwa Province","latitude":"34.459933","longitude":"72.502373","country":"PK"},{"geoLocId":"0001169143","geoLocName":"Naushahro Firoz","latitude":"26.842382","longitude":"68.122984","country":"PK"},{"geoLocId":"0001169278","geoLocName":"Narowal","latitude":"32.1","longitude":"74.883333","country":"PK"},{"geoLocId":"0001169372","geoLocName":"Nankana Sahib","latitude":"31.4475","longitude":"73.697222","country":"PK"},{"geoLocId":"0001169605","geoLocName":"Muzaffargarh","latitude":"30.07537","longitude":"71.192129","country":"PK"},{"geoLocId":"0001169825","geoLocName":"Multan","latitude":"30.195556","longitude":"71.475278","country":"PK"},{"geoLocId":"0001170295","geoLocName":"Mirpur Khas","latitude":"25.5251","longitude":"69.0159","country":"PK"},{"geoLocId":"0001170425","geoLocName":"Mianwali","latitude":"32.574095","longitude":"71.526386","country":"PK"},{"geoLocId":"0001170677","geoLocName":"Matiari","latitude":"25.596092","longitude":"68.446665","country":"PK"},{"geoLocId":"0001170951","geoLocName":"Mansehra","latitude":"34.333333","longitude":"73.2","country":"PK"},{"geoLocId":"0001171123","geoLocName":"Mandi Bahauddin","latitude":"32.583387","longitude":"73.484315","country":"PK"},{"geoLocId":"0001171389","geoLocName":"Malakand","latitude":"34.565556","longitude":"71.931111","country":"PK"},{"geoLocId":"0001171965","geoLocName":"Lodhran","latitude":"29.540507","longitude":"71.63357","country":"PK"},{"geoLocId":"0001172035","geoLocName":"Leiah","latitude":"30.961279","longitude":"70.939043","country":"PK"},{"geoLocId":"0001172339","geoLocName":"Lakki Marwat","latitude":"32.607953","longitude":"70.911416","country":"PK"},{"geoLocId":"0001172451","geoLocName":"Lahore","latitude":"31.549722","longitude":"74.343611","country":"PK"},{"geoLocId":"0001173491","geoLocName":"Kohat","latitude":"33.586944","longitude":"71.442222","country":"PK"},{"geoLocId":"0001173687","geoLocName":"Khushab","latitude":"32.296667","longitude":"72.3525","country":"PK"},{"geoLocId":"0001174074","geoLocName":"Karak","latitude":"33.12","longitude":"71.094722","country":"PK"},{"geoLocId":"0001174220","geoLocName":"Khanewal","latitude":"30.3","longitude":"71.933333","country":"PK"},{"geoLocId":"0001174625","geoLocName":"Kasur","latitude":"31.115556","longitude":"74.446667","country":"PK"},{"geoLocId":"0001174653","geoLocName":"Kashmor","latitude":"28.433333","longitude":"69.583333","country":"PK"},{"geoLocId":"0001175296","geoLocName":"Kalat","latitude":"29.033333","longitude":"66.583333","country":"PK"},{"geoLocId":"0001175864","geoLocName":"Jhelum","latitude":"32.933132","longitude":"73.726367","country":"PK"},{"geoLocId":"0001175916","geoLocName":"Jhang","latitude":"30.716667","longitude":"70.716667","country":"PK"},{"geoLocId":"0001176229","geoLocName":"Jamshoro","latitude":"25.4268","longitude":"68.2799","country":"PK"},{"geoLocId":"0001176515","geoLocName":"Jacobabad","latitude":"28.286731","longitude":"68.433159","country":"PK"},{"geoLocId":"0001176615","geoLocName":"Islamabad","latitude":"33.721484","longitude":"73.043289","country":"PK"},{"geoLocId":"0001177107","geoLocName":"Haripur","latitude":"33.999967","longitude":"72.934093","country":"PK"},{"geoLocId":"0001177203","geoLocName":"Hangu","latitude":"33.52861","longitude":"71.058333","country":"PK"},{"geoLocId":"0001177384","geoLocName":"Hafizabad","latitude":"32.067857","longitude":"73.685449","country":"PK"},{"geoLocId":"0001177654","geoLocName":"Gujrat","latitude":"32.572761","longitude":"74.089588","country":"PK"},{"geoLocId":"0001177662","geoLocName":"Gujranwala","latitude":"32.161667","longitude":"74.188309","country":"PK"},{"geoLocId":"0001178456","geoLocName":"Ghotki","latitude":"28.00604","longitude":"69.316077","country":"PK"},{"geoLocId":"0001179400","geoLocName":"Faisalabad","latitude":"31.416667","longitude":"73.083333","country":"PK"},{"geoLocId":"0001180289","geoLocName":"Dera Ghazi Khan","latitude":"30.056142","longitude":"70.634766","country":"PK"},{"geoLocId":"0001180809","geoLocName":"Dadu","latitude":"26.733333","longitude":"67.783333","country":"PK"},{"geoLocId":"0001180825","geoLocName":"Dadhar","latitude":"29.466667","longitude":"67.65","country":"PK"},{"geoLocId":"0001181065","geoLocName":"Chitral","latitude":"35.842222","longitude":"71.781944","country":"PK"},{"geoLocId":"0001181439","geoLocName":"Charsadda","latitude":"34.145278","longitude":"71.731389","country":"PK"},{"geoLocId":"0001181611","geoLocName":"Qila Abdullah","latitude":"30.69854","longitude":"66.556112","country":"PK"},{"geoLocId":"0001181636","geoLocName":"Chakwal","latitude":"32.933333","longitude":"72.866667","country":"PK"},{"geoLocId":"0001183460","geoLocName":"Bannu","latitude":"32.989911","longitude":"70.606717","country":"PK"},{"geoLocId":"0001183880","geoLocName":"Bahawalpur","latitude":"29.4","longitude":"71.683333","country":"PK"},{"geoLocId":"0001184055","geoLocName":"Badin","latitude":"24.65","longitude":"68.833333","country":"PK"},{"geoLocId":"0001184196","geoLocName":"Azad Kashmir","latitude":"33.947179","longitude":"73.910401","country":"PK"},{"geoLocId":"0001184249","geoLocName":"Attock City","latitude":"33.772222","longitude":"72.368333","country":"PK"},{"geoLocId":"0001185056","geoLocName":"Abbottobad","latitude":"34.146852","longitude":"73.214488","country":"PK"},{"geoLocId":"0001332083","geoLocName":"Bahawalnagar","latitude":"30.550833","longitude":"73.390833","country":"PK"},{"geoLocId":"0001397479","geoLocName":"Dera Murad Jamali","latitude":"28.546568","longitude":"68.223081","country":"PK"},{"geoLocId":"0006641952","geoLocName":"Mastung District","latitude":"29.794547","longitude":"66.720678","country":"PK"},{"geoLocId":"0007082481","geoLocName":"Khuzdar","latitude":"27.738385","longitude":"66.643365","country":"PK"},{"geoLocId":"0007418966","geoLocName":"Bhakkar","latitude":"31.646991","longitude":"71.43428","country":"PK"},{"geoLocId":"0007419040","geoLocName":"Tank District","latitude":"32.240003","longitude":"70.392559","country":"PK"},{"geoLocId":"0007419052","geoLocName":"Nowshera District","latitude":"33.925378","longitude":"71.980917","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P078997":{"id":"P078997","project_name":"Sindh On-Farm Water Management Project","boardapprovaldate":"2004-05-20T00:00:00Z","totalamt":"61,140,000","url":"http://www.worldbank.org/projects/P078997/sindh-on-farm-water-management-project?lang=en","project_abstract":{"cdata":"The Sindh On-Farm Water Management Project seeks to improve the efficiency, reliability, and equity of irrigation water distribution, support agricultural productivity enhancement to complement the benefits of improved water management, and, enhance long-term financial sustainability of the irrigation system, by fostering self- sustaining farmer organizations, at the watercourse, and distributary canal levels - a key element of the decentralized, and financially sustainable institutional apparatus - the  Government of Sindh aims at establishing. Through its components the project will : 1) develop sustainable farmer organizations (FOs) who can effectively operate, and maintain the irrigation and drainage system, through social mobilization, and capacity building. Training and capacity building for watercourse associations (WCAs) and FOs will focus on operation and maintenance (O&M) and abiana (irrigation water charges) collection as well, to improve productivity. Irrigation and Drainage Management Transfer Agreements (IDMTAs) shall be concluded to define the terms of transfer, and roles and responsibilitiesof all parties. The WCAs and FOs will plan, design, and implement irrigation improvements, as well as provide agricultural support services; 2) improve irrigation facilities, which includes earthen improvements, lining, installation of concrete turnout culverts, community structures, cattle crossings and buffalo baths; and, construction of water storage tanks in the rain-fed areas, in addition to rehabilitation, and improvements to distributary canals; and, 3) disseminate a full range of improved water management, and irrigation agronomy practices, and techniques; training in improved water management, and new technology (land leveling, zero tillage, sprinkler and drip systems, etc.); integrated pest management, and Integrated Plant and Soil Nutrient Management (IPSNM), information systems, product marketing, etc. Monitoring and evaluation will be in place to support implementing agencies, while project management support shall include administrative, technical and financial management."},"sector":[{"Name":"Irrigation and drainage","code":"AX"},{"Name":"Other social services","code":"JX"},{"Name":"Central government administration","code":"BX"},{"Name":"Agricultural extension and research","code":"AX"},{"Name":"General agriculture, fishing and forestry sector","code":"AX"}],"countrycode":"PK","locations":[{"geoLocId":"0001164807","geoLocName":"Sindh","latitude":"26.134558","longitude":"68.769602","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P010556":{"id":"P010556","project_name":"Highways Rehabilitation","boardapprovaldate":"2003-12-23T00:00:00Z","totalamt":"200,000,000","url":"http://www.worldbank.org/projects/P010556/highways-rehabilitation?lang=en","project_abstract":{"cdata":"The proposed additional loan for the Highways Rehabilitation Project for Pakistan will help finance the costs associated with restructuring of HRP to urgently address reconstruction/rehabilitation of four main highways that were damaged by the earthquake of October 8, 2005. There will be no change to the ongoing project activities. Most of the remaining funds have been committed, with a large number of contracts ongoing, and it will be important to complete ongoing activities as planned in order to achieve the original project development objective. The new component, to be implemented in parallel to the original components, will also be implemented by the National Highway Authority (NHA) through its fully staffed Project Management Unit (PMU) that has sufficient technical and fiduciary capacity."},"sector":[{"Name":"Rural and Inter-Urban Roads and Highways","code":"TX"},{"Name":"Central government administration","code":"BX"},{"Name":"Forestry","code":"AX"}],"countrycode":"PK","locations":[{"geoLocId":"0001164807","geoLocName":"Sindh","latitude":"26.134558","longitude":"68.769602","country":"PK"},{"geoLocId":"0001166993","geoLocName":"Rawalpindi","latitude":"33.6007","longitude":"73.0679","country":"PK"},{"geoLocId":"0001167710","geoLocName":"Punjab","latitude":"30.860168","longitude":"72.319759","country":"PK"},{"geoLocId":"0001168197","geoLocName":"Peshawar","latitude":"34.008366","longitude":"71.580182","country":"PK"},{"geoLocId":"0001168873","geoLocName":"Khyber Pakhtunkhwa Province","latitude":"34.459933","longitude":"72.502373","country":"PK"},{"geoLocId":"0001169607","geoLocName":"Muzaffarabad","latitude":"34.37","longitude":"73.471111","country":"PK"},{"geoLocId":"0001172451","geoLocName":"Lahore","latitude":"31.549722","longitude":"74.343611","country":"PK"},{"geoLocId":"0001174872","geoLocName":"Karachi","latitude":"24.9056","longitude":"67.0822","country":"PK"},{"geoLocId":"0001176734","geoLocName":"Hyderabad","latitude":"25.3823","longitude":"68.3699","country":"PK"},{"geoLocId":"0001177662","geoLocName":"Gujranwala","latitude":"32.161667","longitude":"74.188309","country":"PK"},{"geoLocId":"0001179245","geoLocName":"Federally Administered Tribal Areas","latitude":"33.014548","longitude":"69.999248","country":"PK"},{"geoLocId":"0001184196","geoLocName":"Azad Kashmir","latitude":"33.947179","longitude":"73.910401","country":"PK"}],"countryname":"Islamic Republic of Pakistan"},"P040547":{"id":"P040547","project_name":"Uch Power Project","boardapprovaldate":"1996-05-14T00:00:00Z","totalamt":"0","url":"http://www.worldbank.org/projects/P040547/uch-power-project?lang=en","sector":[{"Name":"Power","code":"LX"}],"countrycode":"PK","locations":[{"geoLocId":"0001397479","geoLocName":"Dera Murad Jamali","latitude":"28.546568","longitude":"68.223081","country":"PK"}],"countryname":"Islamic Republic of Pakistan"}},"facets":{}};
			// console.log(ppData);
			APP.hilites.setZIndex( 9999 );  
		}
		
	}
}();
	

 
