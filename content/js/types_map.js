
	var map,
			polygons_layer,
			points_layer,
			grid_layer,
			features,
			mainLayer,
			state = 'points';
			
			// Necessary things to run these kind of map
			// - class typesmap to body
			// - points/polygons/grid 'a' tags have to be -> <a href="#" title="grid">grid</a> -> respect the title, you can change the text
			// - zooms html (example in /content/dataset/detail.html)


	$(function(){
		// If body has typesmap class - search #map and start rendering map
		if ($('body').hasClass('typesmap')) {
	
			// Create zoom controls
			$('a.zoom_in').click(function(ev){
				ev.stopPropagation();
				ev.preventDefault();
				map.zoomIn();					
			});
			$('a.zoom_out').click(function(ev){
				ev.stopPropagation();
				ev.preventDefault();
				map.zoomOut();
			});
		
			// Change map type
			$('p.maptype a').click(function(ev){
				ev.stopPropagation();
				ev.preventDefault();
				var type_ = $(this).attr('title');
				$('p.maptype a').each(function(i,ele){
					$(ele).removeClass('selected');
				});
				$(this).addClass('selected');
				chooseLayer(type_);
			});


			// Initialize map
			map = new OpenLayers.Map('map', {controls: [],numZoomLevels: 20});
	

			// Activate double click
			var dblclick = new OpenLayers.Handler.Click(this, {dblclick: function() {map.zoomIn()}, click: null }, {single: true, 'double': true, stopSingle: false, stopDouble: true});
	    dblclick.setMap(map);
	    dblclick.activate();

			// Drag with mouse
			map.addControl(new OpenLayers.Control.Navigation({zoomWheelEnabled : false}));
			map.addControl(new OpenLayers.Control.MousePosition({element: $('#map')}));

			// Tiles
	    var ol_wms = new OpenLayers.Layer.WMS("OpenLayers WMS","http://vmap0.tiles.osgeo.org/wms/vmap0",{layers: 'basic'});
			map.addLayers([ol_wms]);
			map.setCenter(new OpenLayers.LonLat(0, 0), 3);
		
			// First of all, we need all the data: points, polygons paths and grid layer.
			// This function will generate random data.
			generateRandomData();
		}
	});


	function generateRandomData() {

		// Create grid layer
		//grid_layer = new OpenLayers.Layer.TMS("EOL","http://maps0.eol.org/php/map/getEolTile.php?tile=${x}_${y}_${z}_13140803",{layername: "basic", type: "png"});
		grid_layer = new OpenLayers.Layer.XYZ("EOL","http://maps0.eol.org/php/map/getEolTile.php?tile=${x}_${y}_${z}_13140803");
		//"http://sampleserver1.arcgisonline.com/ArcGIS/rest/services/Portland/ESRI_LandBase_WebMercator/MapServer/tile/${z}/${y}/${x}"


		// Generate randomly several points for the polygon
		var dx = 9;
		  var dy = 9;
		  var px, py;
		  features = [];
		  for(var x=-45; x<=45; x+=dx) {
		    for(var y=-22.5; y<=22.5; y+=dy) {
		      px = x + (2 * dx * (Math.random() - 0.5));
		      py = y + (2 * dy * (Math.random() - 0.5));
				features.push(new OpenLayers.Geometry.Point(px, py));
		    }
		  }
	
		// Generate polygons and create polygon layer
		var polygon = new OpenLayers.Geometry.LinearRing(features);
		var polygonFeature = new OpenLayers.Feature.Vector(polygon, null, polygon_style);
		polygons_layer = new OpenLayers.Layer.Vector("Polygons Layer");
		polygons_layer.addFeatures([polygonFeature]);
	
	


		// Generate randomly several points for the polygon
		var dx = 9;
		  var dy = 9;
		  var px, py;
		  features = [];
		  for(var x=-45; x<=45; x+=dx) {
		    for(var y=-22.5; y<=22.5; y+=dy) {
		      px = x + (2 * dx * (Math.random() - 0.5));
		      py = y + (2 * dy * (Math.random() - 0.5));
				features.push(new OpenLayers.Feature.Vector(
		      	new OpenLayers.Geometry.Point(px, py), {x: px, y: py, title: "Example - "+px.toFixed(2)+','+py.toFixed(2), url: "/", datasets:y, species:x, occurrences:dx}
		      ));
		    }
		  }
	
		// Create points layer
		var renderer = OpenLayers.Util.getParameters(window.location.href).renderer;
		  renderer = (renderer) ? [renderer] : OpenLayers.Layer.Vector.prototype.renderers;
	
		 	points_layer = new OpenLayers.Layer.Vector("Points", {
		  	styleMap: new OpenLayers.StyleMap({
		    	"default": points_style
		    }),
			renderers: renderer
		  });
	
		  map.addLayer(points_layer);
		  points_layer.addFeatures(features);

	}



	function chooseLayer(layer) {
		if (layer!=state) {
			if (state=="points") {map.removeLayer(points_layer);	}
			if (state=="polygons") {map.removeLayer(polygons_layer);}
			if (state=="grid") {map.removeLayer(grid_layer);}
					
			if (layer=="points") {map.addLayer(points_layer); state = 'points'; 	return false;}
			if (layer=="polygons") {map.addLayer(polygons_layer);  state = 'polygons'; return false;}
			if (layer=="grid") {map.addLayer(grid_layer);  state = 'grid'; 		return false;}
		}
	}

