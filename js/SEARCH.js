Ext.ns('SEARCH');
SEARCH = function() {
	return {
		searchPanel : null,
		searchGrid : null,
		searchStore : null,
		init: function () {
			
			Ext.define('searchItem',{
		        extend: 'Ext.data.Model',
		        fields: [
		           	 'formatted_address', 
		             {name: 'lat', mapping: 'geometry.location.lat'},
		             {name: 'lon', mapping: 'geometry.location.lng'}
		        ]
		    });
		    
		    this.searchStore = Ext.create('Ext.data.Store', {
                model: 'searchItem',
                data : [],
                proxy: {
		            type: 'memory',
		            reader: {
		                type: 'json',
		                root: 'results'
		            }
		        },
                listeners: {

                }
            });
			
            this.searchGrid = Ext.create('Ext.grid.Panel', {
		        autoScroll : true,
		        layout: 'fit',
    			autowidth: true,
    			autoHeight: true,
		        store: this.searchStore,
		        stateful: true,
		        border : false,
		        sm: Ext.create('Ext.selection.RowModel').setSelectionMode('SINGLE'),
		        viewConfig: {
		            stripeRows: true
		        },
		        columns: [
		            {text: "Description", flex: 1,  dataIndex: 'formatted_address', sortable: true},
		            {text: "Latitude", dataIndex: 'lat', hidden:true},
		            {text: "Longitude", dataIndex: 'lon', hidden:true}
		        ]
		    });
		    
		    this.searchGrid.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
		    	if (selectedRecord[0]){
					var size = new OpenLayers.Size(13,15);
		            var offset = new OpenLayers.Pixel(-(size.w/2), -size.h);
		            var icon = new OpenLayers.Icon('lib/OpenLayers-2.11/img/marker-blue.png',size,offset);
		            var loc = new OpenLayers.LonLat(selectedRecord[0].data.lon,selectedRecord[0].data.lat);
		            loc.transform(new OpenLayers.Projection("EPSG:4326"), new OpenLayers.Projection("EPSG:900913"));
		            APP.map.setCenter(loc, APP.map.zoom);
		            APP.markers.clearMarkers();
		            APP.markers.addMarker(new OpenLayers.Marker(loc,icon));
		        }    
			});			
			
			this.searchPanel = Ext.create('Ext.Panel',{
				title: 'Search Results',
				id: 'searchPanel',
				layout: 'fit',
				border: false,
				items: [this.searchGrid],
				listeners: {
					'expand': function(a, b){
						// UTILS.showHelpTip('Tools', 'Choose measure and calculation type then draw on the map to get the measure results.', 7200);
					},
					'collapse': function(a, b){

					}
				}
			});		
		}
		
	}
}();	

 