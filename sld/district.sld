<?xml version="1.0" encoding="UTF-8"?>
<sld:StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:sld="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:gml="http://www.opengis.net/gml" version="1.0.0">
  <sld:NamedLayer>
    <sld:Name>test</sld:Name>
    <sld:UserStyle>
      <sld:Name>AtlasStyler 1.9</sld:Name>
      <sld:Title/>
      <sld:FeatureTypeStyle>
        <sld:Name>UNIQUE_VALUE_POLYGON</sld:Name>
        <sld:Title>UniqueValuesPolygonRuleList</sld:Title>
        <sld:FeatureTypeName>Feature</sld:FeatureTypeName>
        <sld:Rule>
          <sld:Title>Azad Kashmir</sld:Title>
          <ogc:Filter>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>PROVINCE</ogc:PropertyName>
                  <ogc:Literal>Azad Kashmir</ogc:Literal>
                </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <sld:MaxScaleDenominator>1.7976931348623157E308</sld:MaxScaleDenominator>
          <sld:PolygonSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>the_geom</ogc:PropertyName>
            </sld:Geometry>
            <sld:Fill>
              <sld:CssParameter name="fill">#8DD3C7</sld:CssParameter>
              <sld:CssParameter name="fill-opacity">0.8</sld:CssParameter>
            </sld:Fill>
            <sld:Stroke>
	           <sld:CssParameter name="stroke">#000000</sld:CssParameter>
	           <sld:CssParameter name="stroke-width">1.5</sld:CssParameter>
         	</sld:Stroke>
          </sld:PolygonSymbolizer>
          <sld:TextSymbolizer>
		      <sld:Geometry>
		        <ogc:PropertyName>the_geom</ogc:PropertyName>
		      </sld:Geometry>
		      <sld:Label>
		        <ogc:PropertyName>PROVINCE</ogc:PropertyName>
		      </sld:Label>
		      <sld:Font>
		        <sld:CssParameter name="font-family">comic_sans-bold</sld:CssParameter>
		        <sld:CssParameter name="font-size">11.0</sld:CssParameter>
		        <sld:CssParameter name="font-style">oblique</sld:CssParameter>
		        <sld:CssParameter name="font-weight">bold</sld:CssParameter>
		      </sld:Font>
		      <sld:LabelPlacement>
		        <sld:PointPlacement>
		          <sld:AnchorPoint>
		            <sld:AnchorPointX>
		              <ogc:Literal>0.5</ogc:Literal>
		            </sld:AnchorPointX>
		            <sld:AnchorPointY>
		              <ogc:Literal>0.5</ogc:Literal>
		            </sld:AnchorPointY>
		          </sld:AnchorPoint>
		          <sld:Displacement>
		            <sld:DisplacementX>
		              <ogc:Literal>0.0</ogc:Literal>
		            </sld:DisplacementX>
		            <sld:DisplacementY>
		              <ogc:Literal>0.0</ogc:Literal>
		            </sld:DisplacementY>
		          </sld:Displacement>
		          <sld:Rotation>
		            <ogc:Literal>0</ogc:Literal>
		          </sld:Rotation>
		        </sld:PointPlacement>
		      </sld:LabelPlacement>
		      <sld:Halo>
		        <sld:Radius>
		          <ogc:Literal>1.0</ogc:Literal>
		        </sld:Radius>
		        <sld:Fill>
		          <sld:CssParameter name="fill">#FFFFFF</sld:CssParameter>
		          <sld:CssParameter name="fill-opacity">0.5</sld:CssParameter>
		        </sld:Fill>
		      </sld:Halo>
		      <sld:Fill>
		        <sld:CssParameter name="fill">#000000</sld:CssParameter>
		      </sld:Fill>
		    </sld:TextSymbolizer>
        </sld:Rule>
        <sld:Rule>
          <sld:Title>Balochistan</sld:Title>
          <ogc:Filter>         
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>PROVINCE</ogc:PropertyName>
                  <ogc:Literal>Balochistan</ogc:Literal>
                </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <sld:MaxScaleDenominator>1.7976931348623157E308</sld:MaxScaleDenominator>
          <sld:PolygonSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>the_geom</ogc:PropertyName>
            </sld:Geometry>
            <sld:Fill>
              <sld:CssParameter name="fill">#FFFFB3</sld:CssParameter>
              <sld:CssParameter name="fill-opacity">0.8</sld:CssParameter>
            </sld:Fill>
            <sld:Stroke>
	           <sld:CssParameter name="stroke">#000000</sld:CssParameter>
	           <sld:CssParameter name="stroke-width">1.5</sld:CssParameter>
         	</sld:Stroke>
          </sld:PolygonSymbolizer>
          <sld:TextSymbolizer>
		      <sld:Geometry>
		        <ogc:PropertyName>the_geom</ogc:PropertyName>
		      </sld:Geometry>
		      <sld:Label>
		        <ogc:PropertyName>PROVINCE</ogc:PropertyName>
		      </sld:Label>
		      <sld:Font>
		        <sld:CssParameter name="font-family">Times New Roman</sld:CssParameter>
		        <sld:CssParameter name="font-size">11.0</sld:CssParameter>
		        <sld:CssParameter name="font-style">oblique</sld:CssParameter>
		        <sld:CssParameter name="font-weight">bold</sld:CssParameter>
		      </sld:Font>
		      <sld:LabelPlacement>
		        <sld:PointPlacement>
		          <sld:AnchorPoint>
		            <sld:AnchorPointX>
		              <ogc:Literal>0.5</ogc:Literal>
		            </sld:AnchorPointX>
		            <sld:AnchorPointY>
		              <ogc:Literal>0.5</ogc:Literal>
		            </sld:AnchorPointY>
		          </sld:AnchorPoint>
		          <sld:Displacement>
		            <sld:DisplacementX>
		              <ogc:Literal>0.0</ogc:Literal>
		            </sld:DisplacementX>
		            <sld:DisplacementY>
		              <ogc:Literal>0.0</ogc:Literal>
		            </sld:DisplacementY>
		          </sld:Displacement>
		          <sld:Rotation>
		            <ogc:Literal>0</ogc:Literal>
		          </sld:Rotation>
		        </sld:PointPlacement>
		      </sld:LabelPlacement>
		      <sld:Halo>
		        <sld:Radius>
		          <ogc:Literal>1.0</ogc:Literal>
		        </sld:Radius>
		        <sld:Fill>
		          <sld:CssParameter name="fill">#FFFFFF</sld:CssParameter>
		          <sld:CssParameter name="fill-opacity">0.5</sld:CssParameter>
		        </sld:Fill>
		      </sld:Halo>
		      <sld:Fill>
		        <sld:CssParameter name="fill">#000000</sld:CssParameter>
		      </sld:Fill>
		    </sld:TextSymbolizer>
        </sld:Rule>
        <sld:Rule>
          <sld:Title>Disputed Territory</sld:Title>
          <ogc:Filter>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>PROVINCE</ogc:PropertyName>
                  <ogc:Literal>Disputed Territory</ogc:Literal>
                </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <sld:MaxScaleDenominator>1.7976931348623157E308</sld:MaxScaleDenominator>
          <sld:PolygonSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>the_geom</ogc:PropertyName>
            </sld:Geometry>
            <sld:Fill>
              <sld:CssParameter name="fill">#BEBADA</sld:CssParameter>
              <sld:CssParameter name="fill-opacity">0.8</sld:CssParameter>
            </sld:Fill>
            <sld:Stroke>
	           <sld:CssParameter name="stroke">#000000</sld:CssParameter>
	           <sld:CssParameter name="stroke-width">1.5</sld:CssParameter>
         	</sld:Stroke>
          </sld:PolygonSymbolizer>
          <sld:TextSymbolizer>
		      <sld:Geometry>
		        <ogc:PropertyName>the_geom</ogc:PropertyName>
		      </sld:Geometry>
		      <sld:Label>
		        <ogc:PropertyName>PROVINCE</ogc:PropertyName>
		      </sld:Label>
		      <sld:Font>
		        <sld:CssParameter name="font-family">Times New Roman</sld:CssParameter>
		        <sld:CssParameter name="font-size">11.0</sld:CssParameter>
		        <sld:CssParameter name="font-style">oblique</sld:CssParameter>
		        <sld:CssParameter name="font-weight">bold</sld:CssParameter>
		      </sld:Font>
		      <sld:LabelPlacement>
		        <sld:PointPlacement>
		          <sld:AnchorPoint>
		            <sld:AnchorPointX>
		              <ogc:Literal>0.5</ogc:Literal>
		            </sld:AnchorPointX>
		            <sld:AnchorPointY>
		              <ogc:Literal>0.5</ogc:Literal>
		            </sld:AnchorPointY>
		          </sld:AnchorPoint>
		          <sld:Displacement>
		            <sld:DisplacementX>
		              <ogc:Literal>0.0</ogc:Literal>
		            </sld:DisplacementX>
		            <sld:DisplacementY>
		              <ogc:Literal>0.0</ogc:Literal>
		            </sld:DisplacementY>
		          </sld:Displacement>
		          <sld:Rotation>
		            <ogc:Literal>0</ogc:Literal>
		          </sld:Rotation>
		        </sld:PointPlacement>
		      </sld:LabelPlacement>
		      <sld:Halo>
		        <sld:Radius>
		          <ogc:Literal>1.0</ogc:Literal>
		        </sld:Radius>
		        <sld:Fill>
		          <sld:CssParameter name="fill">#FFFFFF</sld:CssParameter>
		          <sld:CssParameter name="fill-opacity">0.5</sld:CssParameter>
		        </sld:Fill>
		      </sld:Halo>
		      <sld:Fill>
		        <sld:CssParameter name="fill">#000000</sld:CssParameter>
		      </sld:Fill>
		    </sld:TextSymbolizer>
        </sld:Rule>
        <sld:Rule>
          <sld:Title>FATA</sld:Title>
          <ogc:Filter>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>PROVINCE</ogc:PropertyName>
                  <ogc:Literal>FATA</ogc:Literal>
                </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <sld:MaxScaleDenominator>1.7976931348623157E308</sld:MaxScaleDenominator>
          <sld:PolygonSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>the_geom</ogc:PropertyName>
            </sld:Geometry>
            <sld:Fill>
              <sld:CssParameter name="fill">#FB8072</sld:CssParameter>
              <sld:CssParameter name="fill-opacity">0.8</sld:CssParameter>
            </sld:Fill>
            <sld:Stroke>
	           <sld:CssParameter name="stroke">#000000</sld:CssParameter>
	           <sld:CssParameter name="stroke-width">1.5</sld:CssParameter>
         	</sld:Stroke>
          </sld:PolygonSymbolizer>
          <sld:TextSymbolizer>
		      <sld:Geometry>
		        <ogc:PropertyName>the_geom</ogc:PropertyName>
		      </sld:Geometry>
		      <sld:Label>
		        <ogc:PropertyName>PROVINCE</ogc:PropertyName>
		      </sld:Label>
		      <sld:Font>
		        <sld:CssParameter name="font-family">Times New Roman</sld:CssParameter>
		        <sld:CssParameter name="font-size">11.0</sld:CssParameter>
		        <sld:CssParameter name="font-style">oblique</sld:CssParameter>
		        <sld:CssParameter name="font-weight">bold</sld:CssParameter>
		      </sld:Font>
		      <sld:LabelPlacement>
		        <sld:PointPlacement>
		          <sld:AnchorPoint>
		            <sld:AnchorPointX>
		              <ogc:Literal>0.5</ogc:Literal>
		            </sld:AnchorPointX>
		            <sld:AnchorPointY>
		              <ogc:Literal>0.5</ogc:Literal>
		            </sld:AnchorPointY>
		          </sld:AnchorPoint>
		          <sld:Displacement>
		            <sld:DisplacementX>
		              <ogc:Literal>0.0</ogc:Literal>
		            </sld:DisplacementX>
		            <sld:DisplacementY>
		              <ogc:Literal>0.0</ogc:Literal>
		            </sld:DisplacementY>
		          </sld:Displacement>
		          <sld:Rotation>
		            <ogc:Literal>0</ogc:Literal>
		          </sld:Rotation>
		        </sld:PointPlacement>
		      </sld:LabelPlacement>
		      <sld:Halo>
		        <sld:Radius>
		          <ogc:Literal>1.0</ogc:Literal>
		        </sld:Radius>
		        <sld:Fill>
		          <sld:CssParameter name="fill">#FFFFFF</sld:CssParameter>
		          <sld:CssParameter name="fill-opacity">0.5</sld:CssParameter>
		        </sld:Fill>
		      </sld:Halo>
		      <sld:Fill>
		        <sld:CssParameter name="fill">#000000</sld:CssParameter>
		      </sld:Fill>
		    </sld:TextSymbolizer>
        </sld:Rule>
        <sld:Rule>
          <sld:Title>Federal Capital Territory</sld:Title>
          <ogc:Filter>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>PROVINCE</ogc:PropertyName>
                  <ogc:Literal>Federal Capital Territory</ogc:Literal>
                </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <sld:MaxScaleDenominator>1.7976931348623157E308</sld:MaxScaleDenominator>
          <sld:PolygonSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>the_geom</ogc:PropertyName>
            </sld:Geometry>
            <sld:Fill>
              <sld:CssParameter name="fill">#80B1D3</sld:CssParameter>
              <sld:CssParameter name="fill-opacity">0.8</sld:CssParameter>
            </sld:Fill>
            <sld:Stroke>
	           <sld:CssParameter name="stroke">#000000</sld:CssParameter>
	           <sld:CssParameter name="stroke-width">1.5</sld:CssParameter>
         	</sld:Stroke>
          </sld:PolygonSymbolizer>
          <sld:TextSymbolizer>
		      <sld:Geometry>
		        <ogc:PropertyName>the_geom</ogc:PropertyName>
		      </sld:Geometry>
		      <sld:Label>
		        <ogc:PropertyName>PROVINCE</ogc:PropertyName>
		      </sld:Label>
		      <sld:Font>
		        <sld:CssParameter name="font-family">Times New Roman</sld:CssParameter>
		        <sld:CssParameter name="font-size">11.0</sld:CssParameter>
		        <sld:CssParameter name="font-style">oblique</sld:CssParameter>
		        <sld:CssParameter name="font-weight">bold</sld:CssParameter>
		      </sld:Font>
		      <sld:LabelPlacement>
		        <sld:PointPlacement>
		          <sld:AnchorPoint>
		            <sld:AnchorPointX>
		              <ogc:Literal>0.5</ogc:Literal>
		            </sld:AnchorPointX>
		            <sld:AnchorPointY>
		              <ogc:Literal>0.5</ogc:Literal>
		            </sld:AnchorPointY>
		          </sld:AnchorPoint>
		          <sld:Displacement>
		            <sld:DisplacementX>
		              <ogc:Literal>0.0</ogc:Literal>
		            </sld:DisplacementX>
		            <sld:DisplacementY>
		              <ogc:Literal>0.0</ogc:Literal>
		            </sld:DisplacementY>
		          </sld:Displacement>
		          <sld:Rotation>
		            <ogc:Literal>0</ogc:Literal>
		          </sld:Rotation>
		        </sld:PointPlacement>
		      </sld:LabelPlacement>
		      <sld:Halo>
		        <sld:Radius>
		          <ogc:Literal>1.0</ogc:Literal>
		        </sld:Radius>
		        <sld:Fill>
		          <sld:CssParameter name="fill">#FFFFFF</sld:CssParameter>
		          <sld:CssParameter name="fill-opacity">0.5</sld:CssParameter>
		        </sld:Fill>
		      </sld:Halo>
		      <sld:Fill>
		        <sld:CssParameter name="fill">#000000</sld:CssParameter>
		      </sld:Fill>
		    </sld:TextSymbolizer>
        </sld:Rule>
        <sld:Rule>
          <sld:Title>Gilgit Baltistan</sld:Title>
          <ogc:Filter>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>PROVINCE</ogc:PropertyName>
                  <ogc:Literal>Gilgit Baltistan</ogc:Literal>
                </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <sld:MaxScaleDenominator>1.7976931348623157E308</sld:MaxScaleDenominator>
          <sld:PolygonSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>the_geom</ogc:PropertyName>
            </sld:Geometry>
            <sld:Fill>
              <sld:CssParameter name="fill">#FDB462</sld:CssParameter>
              <sld:CssParameter name="fill-opacity">0.8</sld:CssParameter>
            </sld:Fill>
            <sld:Stroke>
	           <sld:CssParameter name="stroke">#000000</sld:CssParameter>
	           <sld:CssParameter name="stroke-width">1.5</sld:CssParameter>
         	</sld:Stroke>
          </sld:PolygonSymbolizer>
          <sld:TextSymbolizer>
		      <sld:Geometry>
		        <ogc:PropertyName>the_geom</ogc:PropertyName>
		      </sld:Geometry>
		      <sld:Label>
		        <ogc:PropertyName>PROVINCE</ogc:PropertyName>
		      </sld:Label>
		      <sld:Font>
		        <sld:CssParameter name="font-family">Times New Roman</sld:CssParameter>
		        <sld:CssParameter name="font-size">11.0</sld:CssParameter>
		        <sld:CssParameter name="font-style">oblique</sld:CssParameter>
		        <sld:CssParameter name="font-weight">bold</sld:CssParameter>
		      </sld:Font>
		      <sld:LabelPlacement>
		        <sld:PointPlacement>
		          <sld:AnchorPoint>
		            <sld:AnchorPointX>
		              <ogc:Literal>0.5</ogc:Literal>
		            </sld:AnchorPointX>
		            <sld:AnchorPointY>
		              <ogc:Literal>0.5</ogc:Literal>
		            </sld:AnchorPointY>
		          </sld:AnchorPoint>
		          <sld:Displacement>
		            <sld:DisplacementX>
		              <ogc:Literal>0.0</ogc:Literal>
		            </sld:DisplacementX>
		            <sld:DisplacementY>
		              <ogc:Literal>0.0</ogc:Literal>
		            </sld:DisplacementY>
		          </sld:Displacement>
		          <sld:Rotation>
		            <ogc:Literal>0</ogc:Literal>
		          </sld:Rotation>
		        </sld:PointPlacement>
		      </sld:LabelPlacement>
		      <sld:Halo>
		        <sld:Radius>
		          <ogc:Literal>1.0</ogc:Literal>
		        </sld:Radius>
		        <sld:Fill>
		          <sld:CssParameter name="fill">#FFFFFF</sld:CssParameter>
		          <sld:CssParameter name="fill-opacity">0.5</sld:CssParameter>
		        </sld:Fill>
		      </sld:Halo>
		      <sld:Fill>
		        <sld:CssParameter name="fill">#000000</sld:CssParameter>
		      </sld:Fill>
		    </sld:TextSymbolizer>
        </sld:Rule>
        <sld:Rule>
          <sld:Title>Khyber Pakhtunkhwa</sld:Title>
          <ogc:Filter>
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>PROVINCE</ogc:PropertyName>
                  <ogc:Literal>Khyber Pakhtunkhwa</ogc:Literal>
                </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <sld:MaxScaleDenominator>1.7976931348623157E308</sld:MaxScaleDenominator>
          <sld:PolygonSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>the_geom</ogc:PropertyName>
            </sld:Geometry>
            <sld:Fill>
              <sld:CssParameter name="fill">#B3DE69</sld:CssParameter>
              <sld:CssParameter name="fill-opacity">0.8</sld:CssParameter>
            </sld:Fill>
            <sld:Stroke>
	           <sld:CssParameter name="stroke">#000000</sld:CssParameter>
	           <sld:CssParameter name="stroke-width">1.5</sld:CssParameter>
         	</sld:Stroke>
          </sld:PolygonSymbolizer>
          <sld:TextSymbolizer>
		      <sld:Geometry>
		        <ogc:PropertyName>the_geom</ogc:PropertyName>
		      </sld:Geometry>
		      <sld:Label>
		        <ogc:PropertyName>PROVINCE</ogc:PropertyName>
		      </sld:Label>
		      <sld:Font>
		        <sld:CssParameter name="font-family">Times New Roman</sld:CssParameter>
		        <sld:CssParameter name="font-size">11.0</sld:CssParameter>
		        <sld:CssParameter name="font-style">oblique</sld:CssParameter>
		        <sld:CssParameter name="font-weight">bold</sld:CssParameter>
		      </sld:Font>
		      <sld:LabelPlacement>
		        <sld:PointPlacement>
		          <sld:AnchorPoint>
		            <sld:AnchorPointX>
		              <ogc:Literal>0.5</ogc:Literal>
		            </sld:AnchorPointX>
		            <sld:AnchorPointY>
		              <ogc:Literal>0.5</ogc:Literal>
		            </sld:AnchorPointY>
		          </sld:AnchorPoint>
		          <sld:Displacement>
		            <sld:DisplacementX>
		              <ogc:Literal>0.0</ogc:Literal>
		            </sld:DisplacementX>
		            <sld:DisplacementY>
		              <ogc:Literal>0.0</ogc:Literal>
		            </sld:DisplacementY>
		          </sld:Displacement>
		          <sld:Rotation>
		            <ogc:Literal>0</ogc:Literal>
		          </sld:Rotation>
		        </sld:PointPlacement>
		      </sld:LabelPlacement>
		      <sld:Halo>
		        <sld:Radius>
		          <ogc:Literal>1.0</ogc:Literal>
		        </sld:Radius>
		        <sld:Fill>
		          <sld:CssParameter name="fill">#FFFFFF</sld:CssParameter>
		          <sld:CssParameter name="fill-opacity">0.5</sld:CssParameter>
		        </sld:Fill>
		      </sld:Halo>
		      <sld:Fill>
		        <sld:CssParameter name="fill">#000000</sld:CssParameter>
		      </sld:Fill>
		    </sld:TextSymbolizer>
        </sld:Rule>
        <sld:Rule>
          <sld:Title>Punjab</sld:Title>
          <ogc:Filter>     
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>PROVINCE</ogc:PropertyName>
                  <ogc:Literal>Punjab</ogc:Literal>
                </ogc:PropertyIsEqualTo>
          </ogc:Filter>
          <sld:MaxScaleDenominator>1.7976931348623157E308</sld:MaxScaleDenominator>
          <sld:PolygonSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>the_geom</ogc:PropertyName>
            </sld:Geometry>
            <sld:Fill>
              <sld:CssParameter name="fill">#FCCDE5</sld:CssParameter>
              <sld:CssParameter name="fill-opacity">0.8</sld:CssParameter>
            </sld:Fill>
            <sld:Stroke>
	           <sld:CssParameter name="stroke">#000000</sld:CssParameter>
	           <sld:CssParameter name="stroke-width">1.5</sld:CssParameter>
         	</sld:Stroke>
          </sld:PolygonSymbolizer>
          <sld:TextSymbolizer>
		      <sld:Geometry>
		        <ogc:PropertyName>the_geom</ogc:PropertyName>
		      </sld:Geometry>
		      <sld:Label>
		        <ogc:PropertyName>PROVINCE</ogc:PropertyName>
		      </sld:Label>
		      <sld:Font>
		        <sld:CssParameter name="font-family">Times New Roman</sld:CssParameter>
		        <sld:CssParameter name="font-size">11.0</sld:CssParameter>
		        <sld:CssParameter name="font-style">oblique</sld:CssParameter>
		        <sld:CssParameter name="font-weight">bold</sld:CssParameter>
		      </sld:Font>
		      <sld:LabelPlacement>
		        <sld:PointPlacement>
		          <sld:AnchorPoint>
		            <sld:AnchorPointX>
		              <ogc:Literal>0.5</ogc:Literal>
		            </sld:AnchorPointX>
		            <sld:AnchorPointY>
		              <ogc:Literal>0.5</ogc:Literal>
		            </sld:AnchorPointY>
		          </sld:AnchorPoint>
		          <sld:Displacement>
		            <sld:DisplacementX>
		              <ogc:Literal>0.0</ogc:Literal>
		            </sld:DisplacementX>
		            <sld:DisplacementY>
		              <ogc:Literal>0.0</ogc:Literal>
		            </sld:DisplacementY>
		          </sld:Displacement>
		          <sld:Rotation>
		            <ogc:Literal>0</ogc:Literal>
		          </sld:Rotation>
		        </sld:PointPlacement>
		      </sld:LabelPlacement>
		      <sld:Halo>
		        <sld:Radius>
		          <ogc:Literal>1.0</ogc:Literal>
		        </sld:Radius>
		        <sld:Fill>
		          <sld:CssParameter name="fill">#FFFFFF</sld:CssParameter>
		          <sld:CssParameter name="fill-opacity">0.5</sld:CssParameter>
		        </sld:Fill>
		      </sld:Halo>
		      <sld:Fill>
		        <sld:CssParameter name="fill">#000000</sld:CssParameter>
		      </sld:Fill>
		    </sld:TextSymbolizer>
        </sld:Rule>
        <sld:Rule>
          <sld:Title>Sindh</sld:Title>
          <ogc:Filter>
            
                <ogc:PropertyIsEqualTo>
                  <ogc:PropertyName>PROVINCE</ogc:PropertyName>
                  <ogc:Literal>Sindh</ogc:Literal>
                </ogc:PropertyIsEqualTo>
              
          </ogc:Filter>
          <sld:MaxScaleDenominator>1.7976931348623157E308</sld:MaxScaleDenominator>
          <sld:PolygonSymbolizer>
            <sld:Geometry>
              <ogc:PropertyName>the_geom</ogc:PropertyName>
            </sld:Geometry>
            <sld:Fill>
              <sld:CssParameter name="fill">#D9D9D9</sld:CssParameter>
              <sld:CssParameter name="fill-opacity">0.8</sld:CssParameter>
            </sld:Fill>
            <sld:Stroke>
	           <sld:CssParameter name="stroke">#000000</sld:CssParameter>
	           <sld:CssParameter name="stroke-width">1.5</sld:CssParameter>
         	</sld:Stroke>
          </sld:PolygonSymbolizer>
          <sld:TextSymbolizer>
		      <sld:Geometry>
		        <ogc:PropertyName>the_geom</ogc:PropertyName>
		      </sld:Geometry>
		      <sld:Label>
		        <ogc:PropertyName>PROVINCE</ogc:PropertyName>
		      </sld:Label>
		      <sld:Font>
		        <sld:CssParameter name="font-family">Times New Roman</sld:CssParameter>
		        <sld:CssParameter name="font-size">11.0</sld:CssParameter>
		        <sld:CssParameter name="font-style">oblique</sld:CssParameter>
		        <sld:CssParameter name="font-weight">bold</sld:CssParameter>
		      </sld:Font>
		      <sld:LabelPlacement>
		        <sld:PointPlacement>
		          <sld:AnchorPoint>
		            <sld:AnchorPointX>
		              <ogc:Literal>0.5</ogc:Literal>
		            </sld:AnchorPointX>
		            <sld:AnchorPointY>
		              <ogc:Literal>0.5</ogc:Literal>
		            </sld:AnchorPointY>
		          </sld:AnchorPoint>
		          <sld:Displacement>
		            <sld:DisplacementX>
		              <ogc:Literal>0.0</ogc:Literal>
		            </sld:DisplacementX>
		            <sld:DisplacementY>
		              <ogc:Literal>0.0</ogc:Literal>
		            </sld:DisplacementY>
		          </sld:Displacement>
		          <sld:Rotation>
		            <ogc:Literal>0</ogc:Literal>
		          </sld:Rotation>
		        </sld:PointPlacement>
		      </sld:LabelPlacement>
		      <sld:Halo>
		        <sld:Radius>
		          <ogc:Literal>1.0</ogc:Literal>
		        </sld:Radius>
		        <sld:Fill>
		          <sld:CssParameter name="fill">#FFFFFF</sld:CssParameter>
		          <sld:CssParameter name="fill-opacity">0.5</sld:CssParameter>
		        </sld:Fill>
		      </sld:Halo>
		      <sld:Fill>
		        <sld:CssParameter name="fill">#000000</sld:CssParameter>
		      </sld:Fill>
		    </sld:TextSymbolizer>
        </sld:Rule>
      </sld:FeatureTypeStyle>
    </sld:UserStyle>
  </sld:NamedLayer>
</sld:StyledLayerDescriptor>

