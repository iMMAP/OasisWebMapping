describe('attribution', function() {
    var map, attribution, MM = com.modestmaps;

    beforeEach(function() {
        callbackResult = null;
        var div = document.createElement('div');

        map = new com.modestmaps.Map(div, new com.modestmaps.TemplatedMapProvider(
            'http://{S}tile.openstreetmap.org/{Z}/{X}/{Y}.png', ['a.']), new MM.Point(600, 600));
        map.setCenterZoom(new com.modestmaps.Location(37.811530, -122.2666097), 10);
        attribution = wax.mm.attribution(map, {
            attribution: '42'
        }).appendTo(map.parent);
    });

    it('can have its content set', function() {
        expect($('.wax-attribution', map.parent).text()).toEqual('42');
    });
});
