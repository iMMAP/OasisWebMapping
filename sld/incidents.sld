<StyledLayerDescriptor version="1.0.0">
	<NamedLayer>
		<Name>incidents</Name>
		<UserStyle>
		<Title>xxx</Title>
		<FeatureTypeStyle>
			<Rule>
				<PointSymbolizer>
					<Geometry>
						<PropertyName>the_geom</PropertyName>
					</Geometry>
					<Graphic>
						<Mark>
							<WellKnownName>star</WellKnownName>
							<Fill>
								<CssParameter name="fill">#ff0000</CssParameter>
							</Fill>
						</Mark>
						<Size>10.0</Size>
					</Graphic>
				</PointSymbolizer>
			</Rule>
		</FeatureTypeStyle>
		</UserStyle>
	</NamedLayer>
</StyledLayerDescriptor>
