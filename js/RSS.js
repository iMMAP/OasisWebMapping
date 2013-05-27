Ext.ns('RSS');
RSS = function() {
	return {
		rssPanel : null,
		rssGrid : null,
		rssStore : null,
		rssCombo : null,
		createRSSGrid : function (){
			
		    Ext.define('FeedItem',{
		        extend: 'Ext.data.Model',
		        fields: [
		            'title', 'link', 'description', 
		             {name: 'lat', mapping: 'geo:lat'},
		             {name: 'lon', mapping: 'geo:long'}
		        ]
		    });
		    
		    this.rssStore = Ext.create('Ext.data.Store', {
                model: 'FeedItem',
                autoLoad : true,
                sortInfo: {
                    property: 'pubDate',
                    direction: 'DESC'
                },
                proxy: {
                    type: 'ajax',
                    url: 'php/feedProxy.php',
                    extraParams:{},
                    method:'POST',
                    reader: {
                        type: 'xml',
                        record: 'item'
                    }
                },
                listeners: {

                }
            });
            
            this.rssGrid = Ext.create('Ext.grid.Panel', {
		        autoScroll : true,
		        dockedItems: [{
	                dock: 'top',
	                xtype: 'toolbar',
	                items: [{
								xtype: 'tbfill'
						},{
		                text: 'RSS : ',
		                xtype: 'tbtext'
		            },
		            	new Ext.form.ComboBox({
							store: new Ext.data.ArrayStore({
						        data   : [
							        ['Disabled', 'disabled'],
							        ['USGS Landsat Imagery (Recent Terrain-Corrected Images)','http://landsat.usgs.gov/Landsat_L1T.rss'],
							        ['Newest available Landsat 7 scenes','http://landsat.usgs.gov/Landsat7.rss'],
							        ['List of ShakeMaps for events in the last 30 days','http://earthquake.usgs.gov/earthquakes/shakemap/rss.xml'],
							        ['Real-time, worldwide Earthquake CAP Alerts for the past 7 days','http://earthquake.usgs.gov/earthquakes/catalogs/caprss7days5.xml'],
							        ['Real-time, worldwide earthquake list for the past day M 0+','http://earthquake.usgs.gov/earthquakes/catalogs/eqs1day-M0.xml'],
							        ['Real-time, worldwide earthquake list for the past day M 1+','http://earthquake.usgs.gov/earthquakes/catalogs/eqs1day-M1.xml'],
							        ['Real-time, worldwide earthquake list for the past day M 2.5+','http://earthquake.usgs.gov/earthquakes/catalogs/eqs1day-M2.5.xml'],
							        ['Real-time, worldwide earthquake list for the past hour M 0+','http://earthquake.usgs.gov/earthquakes/catalogs/eqs1hour-M0.xml'],
							        ['Real-time, worldwide earthquake list for the past hour M 1+','http://earthquake.usgs.gov/earthquakes/catalogs/eqs1hour-M1.xml'],
							        ['Real-time, worldwide earthquake list for the past 7 days M 2.5+','http://earthquake.usgs.gov/earthquakes/catalogs/eqs7day-M2.5.xml'],
							        ['Real-time, worldwide earthquake list for the past 7 days M 5+','http://earthquake.usgs.gov/earthquakes/catalogs/eqs7day-M5.xml'],
							        ['Real-time, worldwide earthquake list for the past 7 days M 7+','http://earthquake.usgs.gov/earthquakes/catalogs/eqs7day-M7.xml'],
							        ['Real-time, worldwide earthquake list for the past day M 2.5+','http://earthquake.usgs.gov/earthquakes/catalogs/feed.php?feed=eqs1day-M2.5.xml'],
							        ['List of ShakeMaps for events in the last 30 days','http://earthquake.usgs.gov/earthquakes/catalogs/shakerss.xml'],
							        ['Latest weather and climate news from NOAA National Weather Service, Western region Headquarters','http://www.wrh.noaa.gov/georssnews.php'],
							        ['World News','http://pipes.yahoo.com/pipes/pipe.run?_id=e8ceb91cbefd7f8eaad7e01cba0c89cc&_render=rss']
							        
							    ],
						        fields : ['name', 'value']
						    }),
							displayField: 'name',
							width : 250,
							valueField: 'value',
							typeAhead: true,
							mode: 'local',
							triggerAction: 'all',
							emptyText: 'Disabled',
							selectOnFocus: true,
							listeners: {
								select: function(){
									UTILS.showHelpTip('GeoRSS Feed', 'Click row on the grid to move to selected object or click object on the map to display the information.', 7200);
									RSS.rssStore.proxy.extraParams = {url:this.value};
									RSS.rssStore.load();
									PRINT.georssUrl = this.value;
									PRINT.georsstext= this.rawValue;
									var tempUrl = null;
									// console.log(this.rawValue);
									if (this.rawValue=='World News'){
										tempUrl = this.value;
									} else {
										tempUrl = "php/feedProxy.php?url="+this.value;
									}
									if (this.value != null){
										if (APP.grss==null){
											APP.grss = new OpenLayers.Layer.GeoRSS("GeoRSS",tempUrl, {
												projection: new OpenLayers.Projection("EPSG:4326"),
												rendererOptions: { zIndexing: true }
											});	
											APP.map.addLayers([APP.grss]);	
											// APP.grss.setZIndex( 1000 );
											// APP.markers.setZIndex(1001);								
										} else {
											APP.map.removeLayer(APP.map.getLayersByClass("OpenLayers.Layer.GeoRSS")[0]);
											APP.grss = new OpenLayers.Layer.GeoRSS("GeoRSS",tempUrl, {
												projection: new OpenLayers.Projection("EPSG:4326"),
												rendererOptions: { zIndexing: true }
											});		
											APP.map.addLayers([APP.grss]);	
											// APP.grss.setZIndex( 1000 );
											// APP.markers.setZIndex(1001);								
										}
									} else {
										if (APP.map.getLayersByClass("OpenLayers.Layer.GeoRSS").length > 0) 
											APP.map.removeLayer(APP.map.getLayersByClass("OpenLayers.Layer.GeoRSS")[0]);
										APP.grss=null;
										APP.markers.clearMarkers();
									}
								}
							}
						})]
	            }],
		        layout: 'fit',
    			autowidth: true,
    			autoHeight: true,
		        store: this.rssStore,
		        stateful: true,
		        border : false,
		        sm: Ext.create('Ext.selection.RowModel').setSelectionMode('SINGLE'),
		        viewConfig: {
		            stripeRows: true//,
		            //forceFit: true
		        },
		        columns: [
		            {text: "Tittle", flex: 1, dataIndex: 'title', sortable: true, hidden:true},
		            {text: "Description", flex: 1,  dataIndex: 'description', sortable: true},
		            {text: "Link", width: 115, dataIndex: 'link', sortable: true, hidden:true},
		            {text: "Latitude", dataIndex: 'lat', hidden:true},
		            {text: "Longitude", dataIndex: 'lon', hidden:true}
		        ]
		    });
		    this.rssGrid.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
		    	if (selectedRecord[0]){
					var size = new OpenLayers.Size(26,30);
		            var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
		            var icon = new OpenLayers.Icon('lib/OpenLayers-2.11/img/marker-blue.png',size,offset);
		            var loc = new OpenLayers.LonLat(selectedRecord[0].data.lon,selectedRecord[0].data.lat);
		            loc.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
		            APP.map.setCenter(loc, APP.map.zoom);
		            APP.markers.clearMarkers();
		            APP.markers.addMarker(new OpenLayers.Marker(loc,icon));
		        }    
			});

		},
		init: function () {
			this.createRSSGrid();
			this.rssPanel = Ext.create('Ext.Panel',{
				title: 'GEORSS Live Feed',
				id: 'rssPanel',
				layout: 'fit',
				border: false,
				items: this.rssGrid,
				listeners: {
					'expand': function(a, b){
						UTILS.showHelpTip('GeoRSS Feed', 'Choose the GeoRSS feed service from RSS combobox.', 7200);
					},
					'collapse': function(a, b){

					}
				}
			});	
		}
		
	}
}();	

 