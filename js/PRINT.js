Ext.ns('PRINT');
PRINT = function() {
	return {
		georssUrl : null,
		georsstext : null,
		kmlUrl : null,
		scaleStore : null,
		layoutStore : null,
		printPanel : null,
		printForm :  null,
		printLayer : null,
		feature : null,
		printLoad : null,
		ctrlDragFeature : null,
		getQuerystring : function (key, url, default_)
		{
		  if (default_==null) default_="";
		  key = key.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
		  var regex = new RegExp("[\\?&]"+key+"=([^&#]*)");
		  var qs = regex.exec(url);
		  if(qs == null)
		    return default_;
		  else
		    return qs[1];
		},
		getActiveLayersName : function(){
				
				var activeLayers = [];
				for (var i = 0; i<APP.map.layers.length; i++){
					// console.log(APP.map.layers[i]);
					if((APP.map.layers[i].getVisibility()) && (APP.map.layers[i].CLASS_NAME = "OpenLayers.Layer.WMS") && (APP.map.layers[i].name != "Print Layer") && (APP.map.layers[i].name != "vector") && (APP.map.layers[i].name != "Highlighted") && (APP.map.layers[i].name != "Markers") && (APP.map.layers[i].name != "Draw Area") && (APP.map.layers[i].name != "fire24") && (APP.map.layers[i].name != "fire48") && (APP.map.layers[i].name != "flood1") && (APP.map.layers[i].name != "wbprojects001") && (APP.map.layers[i].name != "Weather") && (APP.map.layers[i].name.substr(0,6) != "Terra_") && (APP.map.layers[i].id.substr(0,23) !=  "OpenLayers.Layer.GeoRSS") && (!APP.map.layers[i].isBaseLayer)){
						if (typeof APP.map.layers[i].params != "undefined") 
							activeLayers.push(APP.map.layers[i].params.LAYERS);						
					} else if ((APP.map.layers[i].getVisibility()) && ((APP.map.layers[i].name == "fire24") || (APP.map.layers[i].name == "fire48"))){
						// activeLayers.push('wildfire'); 
						activeLayers.push(APP.map.layers[i].name);
						console.log(APP.map.layers[i]);						
						//PRINT.kmlUrl = PRINT.getQuerystring('url', APP.map.layers[i].protocol.url);;
					} else if (APP.map.layers[i].id.substr(0,23) ==  "OpenLayers.Layer.GeoRSS"){
						APP.map.layers[i].CLASS_NAME = APP.map.layers[i].id.substr(0,23);	
					}
				}
				
				if (PRINT.georssUrl != null){							
					activeLayers.push('georss');
				}
				return activeLayers;
		},
		getActiveLayersGroup : function(){
				var activeLayers = [];
				for (var i = 0; i<APP.map.layers.length; i++){
					var legendParentUrl = '';
					var opacity = APP.map.layers[i].opacity;
					if (typeof APP.map.layers[i].url == 'string'){
						legendParentUrl = APP.map.layers[i].url;
					}
					if((APP.map.layers[i].getVisibility()) && (APP.map.layers[i].CLASS_NAME = "OpenLayers.Layer.WMS") && (APP.map.layers[i].name != "Print Layer") && (APP.map.layers[i].name != "vector") && (APP.map.layers[i].name != "Highlighted") && (APP.map.layers[i].name != "Markers") && (APP.map.layers[i].name != "Draw Area") && (APP.map.layers[i].name != "fire24") && (APP.map.layers[i].name != "fire48") && (APP.map.layers[i].name != "flood1") && (APP.map.layers[i].name != "wbprojects001") && (APP.map.layers[i].name != "Weather") && (APP.map.layers[i].name.substr(0,6) != "Terra_") && (APP.map.layers[i].id.substr(0,23) !=  "OpenLayers.Layer.GeoRSS") && (!APP.map.layers[i].isBaseLayer)){
						// console.log(typeof APP.map.layers[i].url);
						if (typeof APP.map.layers[i].params != "undefined")
							activeLayers.push({name : APP.map.layers[i].name, text:APP.map.layers[i].params.TEXT, url:legendParentUrl, opacity:opacity, sld:APP.map.layers[i].params.SLD});
					} else if ((APP.map.layers[i].getVisibility()) && ((APP.map.layers[i].name == "fire24") || (APP.map.layers[i].name == "fire48"))){
						// activeLayers.push('wildfire');	
						activeLayers.push({name : APP.map.layers[i].name, text:APP.map.layers[i].params.TEXT, url:legendParentUrl, opacity:opacity});
					} else if (APP.map.layers[i].id.substr(0,23) ==  "OpenLayers.Layer.GeoRSS"){
						APP.map.layers[i].CLASS_NAME = APP.map.layers[i].id.substr(0,23);	
					}
				}
				if (PRINT.georssUrl != null){							
					// activeLayers.push('georss');
					activeLayers.push({name : 'georss', text:PRINT.georsstext, url:legendParentUrl, opacity:opacity});
				}
				return activeLayers;
		},		
		doPrintMapCustom : function (zoom, orientation, center, bounds, scale, mode, filterShape){
			
			var sendActiveBaseLayer;
			if (APP.activeBaseLayer=='Google Physical'){
				sendActiveBaseLayer = 'Physical';
			} else if (APP.activeBaseLayer=='Google Streets'){
				sendActiveBaseLayer = 'Street';
			} else if (APP.activeBaseLayer=='Google Hybrid'){
				sendActiveBaseLayer = 'Hybrid';
			} else if (APP.activeBaseLayer=='Google Satellite'){
				sendActiveBaseLayer = 'Satellite';
			} else if (APP.activeBaseLayer=='default'){
				sendActiveBaseLayer = 'OpenStreetMap';
			} else if (APP.activeBaseLayer=='OpenStreetMap'){
				sendActiveBaseLayer = 'OpenStreetMap';
			} else if (APP.activeBaseLayer=='ArcGIS Street Map'){
				sendActiveBaseLayer = 'World Street Map';
			} else if (APP.activeBaseLayer=='ArcGIS Topo Map'){
				sendActiveBaseLayer = 'World Topo Map';	
			} else if (APP.activeBaseLayer=='ArcGIS Imagery'){
				sendActiveBaseLayer = 'World Imagery';												
			} else {
				sendActiveBaseLayer = 'naqsha';
			}
			PRINT.printLoad.msg = 'Prepare tiles';
			// console.log(TREE.layerFilter);
			// console.log(PRINT.getActiveLayersName());
			var layersArr = PRINT.getActiveLayersName();
			var json = [];
			for (var i=0;i<layersArr.length;i++){
				// console.log(TREE.layerFilter[layersArr[i]]);
				var det = [];
				if (TREE.layerFilter[layersArr[i]]!=undefined)
					for (var j=0;j<TREE.layerFilter[layersArr[i]].length;j++){
						det.push({column:TREE.layerFilter[layersArr[i]][j][0],op:TREE.layerFilter[layersArr[i]][j][1],val:TREE.layerFilter[layersArr[i]][j][2]});
					}
				json.push({layer:layersArr[i],criteria:det});			
			}
			// console.log( Ext.encode(json));
			var sentJSON = Ext.encode(json);
			var x = Ext.encode(PRINT.getActiveLayersGroup());
			Ext.Ajax.request(
					{   
				  		///waitMsg: 'Please wait...',
				  		url: 'php/print.create.mapimg.php?activelayer='+PRINT.getActiveLayersName()+"&sentJSON="+sentJSON,
				  		timeout : 200000,
				  		params: 
						{
				     		X			:center.lon,
							Y			:center.lat,
				     		Z			:zoom,
							area		:bounds.bottom+'_'+bounds.left+'_'+bounds.top+'_'+bounds.right+'_'+zoom+'_'+sendActiveBaseLayer,
							orientation	:orientation,
							scale		:scale,	
							classitem   :APP.dataLayer.params.CLASSITEM,
							mapquery    :APP.dataLayer.params.MAPQUERY,
							tableitem	:APP.dataLayer.params.TABLEITEM,
							kmlUrl 		:PRINT.kmlUrl,
							georssUrl 	:PRINT.georssUrl,
							filterShape :filterShape,
							layerdesc	: x
				  		}, 
				  		success: function(response)
						{
							if (mode == 'map') {
								PRINT.printLoad.msg = 'This process will take a while, Please wait for generating pdf...';
								var printBody = Ext.getBody();
								var printFrame = printBody.createChild({ 
									tag:'iframe',
									cls:'x-hidden',
									id:'iframePrint',
									name:'iframePrint'
								});
								var x = encodeURIComponent(Ext.encode(PRINT.getActiveLayersGroup()));
										
								var printForm = printBody.createChild({
									tag:'form',
									cls:'x-hidden',
									id:'formPrint',
									action:'php/print.create.pdf.php?activelayer='+x,
									method:'post',
									target:'iframePrint'
								});
								
								//no idea why the json string is not being sent - have to re-do queries in pdf
								printForm.appendChild(printBody.createChild({tag:'input', type:'hidden', name:'comments', value: escape(Ext.getCmp('comments').getValue())}));
								printForm.appendChild(printBody.createChild({tag:'input', type:'hidden', name:'orientation', value: orientation}));
								printForm.appendChild(printBody.createChild({tag:'input', type:'hidden', name:'scale', value: scale}));
								printForm.appendChild(printBody.createChild({tag:'input', type:'hidden', name:'random', value: response.responseText}));
								// printForm.appendChild(printBody.createChild({tag:'input', type:'hidden', name:'activelayer', value: x}));
								printForm.dom.submit();
								PRINT.printLoad.hide();		
								//console.log(Ext.getCmp('comments').getValue());	
							} else if (mode == 'stat') {
								PRINT.printLoad.msg = 'This process will take a while, Please wait for generating pdf...';
								var x = encodeURIComponent(Ext.encode(PRINT.getActiveLayersGroup()));
								Ext.Ajax.request(
								{   
							  		///waitMsg: 'Please wait...',
							  		url: 'php/print.create.pdf.php?activelayer='+x,
							  		params: 
									{
										comments	:Ext.getCmp('comments').getValue(),
							     		orientation	:orientation,
										scale		:scale,
										random		:response.responseText,
										mode 		:mode
							  		}, 
							  		success: function(response)
									{
										var printBody = Ext.getBody();
										var printFrame = printBody.createChild({
											tag:'iframe',
											cls:'x-hidden',
											id:'iframePrint',
											name:'iframePrint'
										});
												
										var printForm = printBody.createChild({
											tag:'form',
											cls:'x-hidden',
											id:'formPrint',
											action:'php/resourceExport.php?activelayer='+x,//+'&filterSent='+FINDER.filter,
											method:'post',
											target:'iframePrint'
										});
							
						
										//no idea why the json string is not being sent - have to re-do queries in pdf
										printForm.appendChild(printBody.createChild({tag:'input', type:'hidden', name:'kmlUrl', value: PRINT.kmlUrl}));
										printForm.appendChild(printBody.createChild({tag:'input', type:'hidden', name:'georssUrl', value: PRINT.georssUrl}));
										printForm.appendChild(printBody.createChild({tag:'input', type:'hidden', name:'sentUrl', value: FINDER.sentUrl}));
										printForm.appendChild(printBody.createChild({tag:'input', type:'hidden', name:'popData', value: FINDER.popData}));
										printForm.appendChild(printBody.createChild({tag:'input', type:'hidden', name:'filename', value: response.responseText}));
										printForm.dom.submit();
										PRINT.printLoad.hide();	
									}
								});		
							}	
							
				   		},
						failure: function() {
							UTILS.showHelpTip('Generate PDF Failed', 'Please try again...', 7200);
							PRINT.printLoad.hide();	
						}				
					});			
		},
		getGoogleScale : function (scale){
			switch(scale)
			{
				case 409600000 :
					return 0;
					break;
				case 204800000 :
					return 1;
					break;
				case 102400000 :
					return 2;
					break;
				case 51200000 :
					return 3;
					break;	
				case 25600000 :
					return 4;
					break;
				case 12800000 :
					return 5;
					break;	
				case 6400000 :
					return 6;
					break;	
				case 3200000 :
					return 7;
					break;
				case 1600000 :
					return 8;
					break;
				case 800000 :
					return 9;
					break;
				case 400000 :
					return 10;
					break;
				case 200000 :
					return 11;
					break;
				case 100000 :
					return 12;
					break;
				case 50000 :
					return 13;
					break;
				case 25000 :
					return 14;
					break;
				case 12500 :
					return 15;
					break;
				case  6250:
					return 16;
					break;
				case 3125 :
					return 17;
					break;															
			}
		},
		getClosestValues : function(a, x) {
		    var lo, hi;
		    for (var i = a.length; i--;) {
		        if (a[i] <= x && (lo === undefined || lo < a[i])) lo = a[i];
		        if (a[i] >= x && (hi === undefined || hi > a[i])) hi = a[i];
		    };
		    return lo;

		},
	    calculatePageBounds: function(scale, units, layout) {
	        var s = scale;
	        //s = 3200000;
	        var f = this.feature;
	        var geom = this.feature.geometry;
	        var center = geom.getBounds().getCenterLonLat();
	        var size = layout;
	        var units = units ||
	           (f.layer && f.layer.map && f.layer.map.getUnits()) ||
	           "dd";
	        var unitsRatio = OpenLayers.INCHES_PER_UNIT[units];
	        var w = size.width / 72 / unitsRatio * s / 2;
	        var h = size.height / 72 / unitsRatio * s / 2;
	        return new OpenLayers.Bounds(center.lon - w, center.lat - h,
	            center.lon + w, center.lat + h);
	    },		
	    setScale: function(scale, units, layout) {
	        var bounds = this.calculatePageBounds(scale, units, layout);
	        var geom = bounds.toGeometry();
	        this.updateFeature(geom, {scale: scale});
	    },		
	    updateFeature: function(geometry, mods) {
	        var f = this.feature;
	        var modified = f.geometry !== geometry;
	        geometry.id = f.geometry.id;
	        f.geometry = geometry;
	        
	        if(!this._updating) {
	            for(var property in mods) {
	                if(mods[property] === this[property]) {
	                    delete mods[property];
	                } else {
	                    this[property] = mods[property];
	                    modified = true;
	                }
	            }
	            Ext.apply(this, mods);
	            
	            f.layer && f.layer.drawFeature(f);
	            //modified && this.fireEvent("change", this, mods);
	        }
	    },  		
	    setCenter: function(center) {
	        var geom = this.feature.geometry;
	        var oldCenter = geom.getBounds().getCenterLonLat();
	        var dx = center.lon - oldCenter.lon;
	        var dy = center.lat - oldCenter.lat;
	        geom.move(dx, dy);
	        this.updateFeature(geom, {center: center});
	    },
		showPrintExtent : function (){
			
			var scaleData = this.scaleStore.getRange();
			var scaleRange = new Array();
			for(var key in scaleData){
				scaleRange.push(scaleData[key].data.value);
			}
			
			var result = this.getClosestValues(scaleRange, APP.map.getScale()/8);

			this.scaleCombo.setValue(this.scaleStore.getAt(this.scaleStore.findExact('value', result)));
			this.printLayer.setVisibility(true);
			var extent = APP.map.getExtent();
			var center = extent.getCenterLonLat();
			var scale = result;
			var layout = this.layoutCombo.getValue();
			var units = APP.map.getUnits();
        	this.setCenter(center);
        	this.setScale(scale, units, layout);
		},
		hidePrintExtent : function(){
			this.printLayer.setVisibility(false);
		},				
		init: function () {
			var styleMap = new OpenLayers.StyleMap({
	         	"default": OpenLayers.Util.applyDefaults({ pointRadius: 10, strokeWidth:2}, OpenLayers.Feature.Vector.style["default"])
	         });	
			this.printLayer = new OpenLayers.Layer.Vector(
				"Print Layer", 
				{
					"styleMap":styleMap, 
					rendererOptions: { zIndexing: true },
					visibility : false
				}
			);						
			this.feature = new OpenLayers.Feature.Vector(OpenLayers.Geometry.fromWKT("POLYGON((-1 -1,1 -1,1 1,-1 1,-1 -1))"));
			this.feature.geometry.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
			this.printLayer.addFeatures(this.feature);
			APP.map.addLayer(this.printLayer);
			this.ctrlDragFeature = new OpenLayers.Control.DragFeature(this.printLayer);
			APP.map.addControl(this.ctrlDragFeature);
			APP.map.getLayersByName('Print Layer')[0].setZIndex(2500);
		    this.ctrlDragFeature.activate();
		
			var scaleData = [{"name":"1:3,125","value":"3125"},{"name":"1:6,250","value":"6250"},{"name":"1:12,500","value":"12500"},{"name":"1:25,000","value":"25000"},{"name":"1:50,000","value":"50000"},{"name":"1:100,000","value":"100000"},{"name":"1:200,000","value":"200000"},{"name":"1:400,000","value":"400000"},{"name":"1:800,000","value":"800000"},{"name":"1:1,600,000","value":"1600000"},{"name":"1:3,200,000","value":"3200000"},{"name":"1:6,400,000","value":"6400000"},{"name":"1:12,800,000","value":"12800000"},{"name":"1:25,600,000","value":"25600000"},{"name":"1:51,200,000","value":"51200000"},{"name":"1:102,400,000","value":"102400000"},{"name":"1:204,800,000","value":"204800000"},{"name":"1:409,600,000","value":"409600000"}];
			var layoutData = [{"name":"A3 Landscape","map":{"width":2200,"height":1500},"rotation":false},{"name":"A3 Portrait","map":{"width":1460,"height":2080},"rotation":false},{"name":"A4 Landscape","map":{"width":1460,"height":1024},"rotation":false},{"name":"A4 Portrait","map":{"width":1024,"height":1460},"rotation":false}];	
			
			Ext.define('scales', {
			    extend: 'Ext.data.Model',
			    fields: [
			        {name: 'name', type: 'string'},
			        {name: 'value',  type: 'float'}
			    ]
			});
			
			Ext.define('layouts', {
			    extend: 'Ext.data.Model',
			    fields: [
	                {name : "name", type: 'string'},
	                {name: "size", mapping: "map"},
	                {name: "rotation", type: "boolean"}
            	]
			});
		    
		    this.scaleStore = Ext.create('Ext.data.Store', {
		        model: 'scales',
		        data: scaleData,
		        sorters: [
			        {
			            property : 'value',
			            direction: 'DESC'
			        }
			    ]
		    });
			
			this.layoutStore = Ext.create('Ext.data.Store', {
		        model: 'layouts',
		        data: layoutData
		    });
		    
		    this.layoutCombo = Ext.create('Ext.form.field.ComboBox', {
			    fieldLabel: 'Layout',
			    displayField: 'name',
			    valueField : 'map', 
			    anchor: '-5',
			    store: this.layoutStore,
			    queryMode: 'local',
			    typeAhead: true,
			    listeners: {
                            select: function(combo, record, index ) {  
                                var units = APP.map.getUnits();
                                var scale = PRINT.scaleCombo.getValue();
                                //console.log(scale);
								PRINT.setScale(scale, units, combo.value);
                            }
                } 
			});
			this.layoutCombo.setValue(this.layoutStore.getAt('0'));
			
		    this.scaleCombo = Ext.create('Ext.form.field.ComboBox', {
			    fieldLabel: 'Scales',
			    displayField: 'name',
			    valueField : 'value', 
			    anchor: '-5',
			    store: this.scaleStore,
			    queryMode: 'local',
			    typeAhead: true,
 				listeners: {
                            select: function(combo, record, index ) {  
                                var units = APP.map.getUnits();
                                var layout = PRINT.layoutCombo.getValue();
                                //console.log(scale);
								PRINT.setScale(combo.value, units, layout);
                            }
                } 			    
			});			
		    
		    this.printForm = Ext.create('Ext.form.Panel', {
		        border :  false,
		        bodyStyle: 'padding:5px 5px 0',
		        width: 600,
		        fieldDefaults: {
		            labelAlign: 'top',
		            msgTarget: 'side'
		        },
		        defaults: {
		            border: false,
		            xtype: 'panel',
		            flex: 1,
		            layout: 'anchor'
		        },
		
		        layout: 'hbox',
		        items: [{
		            items: [this.layoutCombo, this.scaleCombo,
		            {
				        xtype: 'htmleditor',
				        id : 'comments',
				        fieldLabel: 'Comments',
				        enableColors: true,
				        anchor: '-5',
				        height : 300,
				        enableAlignments: true
				    }]
		        }],
		        buttons: ['->', {
		            text: 'Download PDF',
		            iconCls : 'iconPrint',
		             handler: function() {
					    PRINT.printLoad.show();
						var center = new OpenLayers.LonLat((PRINT.feature.geometry.bounds.left + PRINT.feature.geometry.bounds.right) /2 , (PRINT.feature.geometry.bounds.bottom + PRINT.feature.geometry.bounds.top)/2);
						center = center.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
						var scale = PRINT.scaleCombo.getValue();
						//console.log(PRINT.layoutCombo);
						var orientation = PRINT.layoutCombo.getRawValue();						
						var bounds = PRINT.feature.geometry.bounds.clone();				
						bounds = bounds.transform(new OpenLayers.Projection("EPSG:900913"), new OpenLayers.Projection("EPSG:4326"));
						var comments = Ext.getCmp('comments').getValue();

						PRINT.printLoad.msg = 'Collecting Parameter...';
						PRINT.printLoad.msg = 'Scaling...';
						//var zoom = PRINT.getGoogleScale(scale); /// params scale -- results zoom number
						//console.log(PRINT.getActiveLayersName());
						PRINT.doPrintMapCustom(PRINT.getGoogleScale(scale), orientation, center, bounds, scale,'map');						
					 							
					 	// console.log(comments);
					 }
		        }]
		    });
			
			this.printPanel = new Ext.Panel({
					title: 'Generate PDF',
					id: 'printPanel',
					layout: 'fit',
					border: false,
					items : this.printForm,
					listeners: {
						'expand': function(a, b){
							PRINT.showPrintExtent();
							UTILS.showHelpTip('Generate PDF', 'Move the rectangle to area of interest, choose the scale and paper layout.', 7200);
							// console.log(Ext.decode(Ext.encode(PRINT.getActiveLayersGroup())));
							// APP.weatherSelectControl.deactivate(); 
							PRINT.ctrlDragFeature.activate();	
							APP.map.getLayersByName('Print Layer')[0].setZIndex(99999);					
						},
						'collapse': function(a, b){
							PRINT.hidePrintExtent();
							PRINT.ctrlDragFeature.deactivate(); 
							// APP.weatherSelectControl.activate();	
						}
					}
			});		

			this.printLoad = Ext.create('Ext.LoadMask', Ext.getBody(), {
				msg: 'This process will take a while, Please wait for generating pdf...'
			});	
			this.printLoad.hide();	
			
		}
		
	}
}();	

 