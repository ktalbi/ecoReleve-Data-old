﻿OpenLayers.Control.SelectFeature.prototype.selectBox = function(position) {
    if (position instanceof OpenLayers.Bounds) {
        var minXY = this.map.getLonLatFromPixel(
            new OpenLayers.Pixel(position.left, position.bottom)
        );
        var maxXY = this.map.getLonLatFromPixel(
            new OpenLayers.Pixel(position.right, position.top)
        );
        var bounds = new OpenLayers.Bounds(
            minXY.lon, minXY.lat, maxXY.lon, maxXY.lat
        );  
        
		var minPoint = new OpenLayers.LonLat(minXY.lon,minXY.lat);
		var maxPoint = new OpenLayers.LonLat(maxXY.lon,maxXY.lat);
		minPoint=minPoint.transform(
									new OpenLayers.Projection("EPSG:3857"), // transform from WGS 1984
									new OpenLayers.Projection("EPSG:4326") // to Spherical Mercator Projection
								);
								
		maxPoint=maxPoint.transform(
									new OpenLayers.Projection("EPSG:3857"), // transform from WGS 1984
									new OpenLayers.Projection("EPSG:4326") // to Spherical Mercator Projection
								);
								
		var minLatWGS = minPoint.lat;
		var minLonWGS = minPoint.lon;
		var maxLatWGS = maxPoint.lat;
		var maxLonWGS = maxPoint.lon;
								
		alert("minLong: " + minLonWGS + "miLat: " + minLatWGS + "maxLong: "+ maxLonWGS + "maxLat: " + maxLatWGS);          
		
		
		
		
		
		
		
		
		// if multiple is false, first deselect currently selected features
       






	   if (!this.multipleSelect()) {
            this.unselectAll();
        }
            
        // because we're using a box, we consider we want multiple selection
        var prevMultiple = this.multiple;
        this.multiple = true;
        var layers = this.layers || [this.layer];
        var layer;
        var selectedFeatures = []; // <-- Modification of original function (1/3)
        for(var l=0; l<layers.length; ++l) {
            layer = layers[l];
            for(var i=0, len = layer.features.length; i<len; ++i) {
                var feature = layer.features[i];
                // check if the feature is displayed
                if (!feature.getVisibility()) {
                    continue;
                }

                if (this.geometryTypes == null || OpenLayers.Util.indexOf(
                    this.geometryTypes, feature.geometry.CLASS_NAME) > -1) {
                        if (bounds.toGeometry().intersects(feature.geometry)) {
                            if (OpenLayers.Util.indexOf(layer.selectedFeatures, feature) == -1) {
                                this.select(feature);
                                selectedFeatures.push(feature); // <-- Modification of original function (2/3)
                            }
                        }
                    }
                }
        }
        onFeatureSelect(selectedFeatures); // <-- Modification of original function (3/3)
        this.multiple = prevMultiple;
    }
}
function onFeatureSelect(f) {
    alert(f.length);
}