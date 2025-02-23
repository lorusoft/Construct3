// ECMAScript 5 strict mode
"use strict";

assert2(cr, "cr namespace not created");
assert2(cr.plugins_, "cr.plugins_ not created");

/////////////////////////////////////
// Plugin class
// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
//          vvvvvvvv
cr.plugins_.OSMjosek5494 = function(runtime) {
	this.runtime = runtime;
};

(function() {
	/////////////////////////////////////
	// *** CHANGE THE PLUGIN ID HERE *** - must match the "id" property in edittime.js
	//                            vvvvvvvv
	var pluginProto = cr.plugins_.OSMjosek5494.prototype;

	/////////////////////////////////////
	// Object type class
	pluginProto.Type = function(plugin) {
		this.plugin = plugin;
		this.runtime = plugin.runtime;
	};

	var typeProto = pluginProto.Type.prototype;
	var osmRuntime = null;
	var self;
	var markers = [];
	var routes = [];
	var selected_markerId="";
	var selected_shapeId="";
	var selected_point="";
	var urlDataImage="";

	// called on startup for each object type
	typeProto.onCreate = function() {};

	/////////////////////////////////////
	// Instance class
	pluginProto.Instance = function(type) {
		this.type = type;
		this.runtime = type.runtime;

		// any other properties you need, e.g...
		// this.myValue = 0;
	};

	var instanceProto = pluginProto.Instance.prototype;

	// called whenever an instance is created
	instanceProto.onCreate = function() {

		osmRuntime = this.runtime;
		self = this;


		this.elem = document.createElement("div");
		this.elem.id = "map" + this.uid;
		this.elem.style.width = "933px";
		this.elem.style.height = "593px";
        var left = this.layer.layerToCanvas(this.x, this.y, true);
        var top = this.layer.layerToCanvas(this.x, this.y, false);
        var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
        var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);
        var offx = Math.round(left) + jQuery(this.runtime.canvas).offset().left;
        var offy = Math.round(top) + jQuery(this.runtime.canvas).offset().top;
        var widthfactor = this.width > 0 ? 1 : -1;
        var heightfactor = this.height > 0 ? 1 : -1;
        jQuery(this.elem).css("position", "absolute");
        jQuery(this.elem).offset({left: offx, top: offy});
        jQuery(this.elem).width(Math.round(right - left));
        jQuery(this.elem).height(Math.round(bottom - top));
		jQuery(this.elem).appendTo(this.runtime.canvasdiv ? this.runtime.canvasdiv : "body");


		this.map = L.map('map' + this.uid).setView([this.properties[1], this.properties[2]], this.properties[0]);

		function onMapClick(e) {
			selected_point = e.latlng.lat+","+e.latlng.lng;
    		self.runtime.trigger(cr.plugins_.OSMjosek5494.prototype.cnds.onMapClicked, self);
		}

		this.map.on("click", onMapClick);
		
		L.tileLayer(
            this.properties[3], {
            attribution: 'Map data &copy;',
            maxZoom: 18,
            }).addTo(this.map);
		
		L.control.scale().addTo(this.map);

		this.markersLayer = new L.LayerGroup();
		this.map.addLayer(this.markersLayer);

		this.updatePosition();
		this.runtime.tickMe(this);

	};


	// called whenever an instance is destroyed
	// note the runtime may keep the object after this call for recycling; be sure
	// to release/recycle/reset any references to other objects in this function.
	instanceProto.onDestroy = function() {
		if (this.runtime.isDomFree)
			return;

		jQuery(this.elem).remove();
		this.elem = null;
	};
	instanceProto.updatePosition = function(first) // from built-in offical button runtime code.
	{
		
		var left = this.layer.layerToCanvas(this.x, this.y, true);
		var top = this.layer.layerToCanvas(this.x, this.y, false);
		var right = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, true);
		var bottom = this.layer.layerToCanvas(this.x + this.width, this.y + this.height, false);

		// Is entirely offscreen or invisible: hide
		if (!this.visible || !this.layer.visible || right <= 0 || bottom <= 0 || left >= this.runtime.width || top >= this.runtime.height)
		{
			jQuery(this.elem).hide();
			return;
		}

		// Truncate to canvas size
		if (left < 1)
			left = 1;
		if (top < 1)
			top = 1;
		if (right >= this.runtime.width)
			right = this.runtime.width - 1;
		if (bottom >= this.runtime.height)
			bottom = this.runtime.height - 1;

		jQuery(this.elem).show();

		var offx = left + jQuery(this.runtime.canvas).offset().left;
		var offy = top + jQuery(this.runtime.canvas).offset().top;
		jQuery(this.elem).offset({left: offx, top: offy});
		jQuery(this.elem).width(right - left);
		jQuery(this.elem).height(bottom - top);
		//rounding position & width to avoid jitter
		this.elem.width = Math.round(this.elem.width);
		this.elem.height = Math.round(this.elem.height);
		this.elem.x = Math.round(this.elem.x);
		this.elem.y = Math.round(this.elem.y);
		//
	};
	instanceProto.tick = function() {
		this.updatePosition();
	};
	// called when saving the full state of the game
	instanceProto.saveToJSON = function() {
		// return a Javascript object containing information about your object's state
		// note you MUST use double-quote syntax (e.g. "property": value) to prevent
		// Closure Compiler renaming and breaking the save format
		return {
			// e.g.
			//"myValue": this.myValue
		};
	};

	// called when loading the full state of the game
	instanceProto.loadFromJSON = function(o) {
		// load from the state previously saved by saveToJSON
		// 'o' provides the same object that you saved, e.g.
		// this.myValue = o["myValue"];
		// note you MUST use double-quote syntax (e.g. o["property"]) to prevent
		// Closure Compiler renaming and breaking the save format
	};

	// only called if a layout object - draw to a canvas 2D context
	instanceProto.draw = function(ctx) {};

	// only called if a layout object in WebGL mode - draw to the WebGL context
	// 'glw' is not a WebGL context, it's a wrapper - you can find its methods in GLWrap.js in the install
	// directory or just copy what other plugins do.
	instanceProto.drawGL = function(glw) {};

	// The comments around these functions ensure they are removed when exporting, since the
	// debugger code is no longer relevant after publishing.
	/**BEGIN-PREVIEWONLY**/
	instanceProto.getDebuggerValues = function(propsections) {
		// Append to propsections any debugger sections you want to appear.
		// Each section is an object with two members: "title" and "properties".
		// "properties" is an array of individual debugger properties to display
		// with their name and value, and some other optional settings.
		propsections.push({
			"title": "My debugger section",
			"properties": [
				// Each property entry can use the following values:
				// "name" (required): name of the property (must be unique within this section)
				// "value" (required): a boolean, number or string for the value
				// "html" (optional, default false): set to true to interpret the name and value
				//									 as HTML strings rather than simple plain text
				// "readonly" (optional, default false): set to true to disable editing the property

				// Example:
				// {"name": "My property", "value": this.myValue}
			]
		});
	};

	instanceProto.onDebugValueEdited = function(header, name, value) {
		// Called when a non-readonly property has been edited in the debugger. Usually you only
		// will need 'name' (the property name) and 'value', but you can also use 'header' (the
		// header title for the section) to distinguish properties with the same name.
		if (name === "My property")
			this.myProperty = value;
	};
	/**END-PREVIEWONLY**/

	function indexToBoolean(index){

		switch (index) {
		case 0:		return true;
		case 1:		return false;
		}

	}

	//////////////////////////////////////
	// Conditions
	function Cnds() {};

	// the example condition
	Cnds.prototype.onMarkerClicked = function(id) {


		if (selected_markerId = id) {return true;}
		else{return;}

	};

	Cnds.prototype.onShapeClicked = function(id) {


		if (selected_shapeId = id) {return true;}
		else{return;}

	};

	Cnds.prototype.onMapClicked = function() {


		return true;

	};

	Cnds.prototype.onMapToImageSucc = function() {


		return true;

	};

	Cnds.prototype.onMapToImageError = function() {


		return true;

	};

	// ... other conditions here ...

	pluginProto.cnds = new Cnds();

	//////////////////////////////////////
	// Actions
	function Acts() {};

	// the example action
	Acts.prototype.drawCircle = function(id, lat, lon, rad, col, fill, opacity) {
		var shape = L.circle([lat, lon], rad, {
			color: col,
			fillColor: fill,
			fillOpacity: opacity
		}).on('click', function(e) {
			selected_shapeId = id;
			osmRuntime.trigger(cr.plugins_.OSMjosek5494.prototype.cnds.onShapeClicked, self);
   
		}).addTo(this.map);

		markers.push({id1:id, object:shape});

	};
	Acts.prototype.setMarker = function(id, lat, lon,desc,icon,hight,width,titlevar,anchorvar ) {

		if(icon=="default")
		{
			 this.myIcon = L.icon({
			iconUrl: 'http://cdn.leafletjs.com/leaflet-0.7.3/images/marker-icon.png',
			iconAnchor: anchorvar,
			iconSize: [hight, width]
			

		});

		}
		else {
			 this.myIcon = L.icon({
			iconUrl: icon,
			iconAnchor: anchorvar,
			iconSize: [hight, width]

		});

		}
			

		this.marker = L.marker([lat, lon], {
			icon: this.myIcon,
			title:titlevar
		}).addTo(this.map).bindPopup("<p>"+desc+"</p>").on('click', function(e) {
			selected_markerId = id;
			osmRuntime.trigger(cr.plugins_.OSMjosek5494.prototype.cnds.onMarkerClicked, self);
   
		});//this.marker.bindTooltip(desc).openTooltip();
		//this.marker.bindPopup("<p>"+desc+"</p>").openPopup();
		markers.push({id1:id, object:this.marker});
		this.markersLayer.addLayer(this.marker);

	};
	Acts.prototype.removeAllMarkers = function() {
		for (var i = 0; i < markers.length; i++) {
			this.map.removeLayer(markers[i].object);
		}
	};
	Acts.prototype.removeMarker = function(id) {
		for (var i = 0; i < markers.length; i++) {
			if (markers[i].id1 == id) {this.map.removeLayer(markers[i].object);}
		}
	};

	Acts.prototype.setFocus = function(x,y,z) {
		this.map.setView({lat:parseFloat(x), lng:parseFloat(y)},z);
		//this.map.setView(new L.LatLng(x,y), z);
	};

	Acts.prototype.setPath = function(id, points, color1, weight1, opacity1) {

			//try {

				var puntos = [];
				var waypoints = [];
				var i;

				var auxiliar1 = points.split("/");
				var auxiliar2;
				var auxiliar3;

				for (i = 0; i < auxiliar1.length; i++) {
				    
					auxiliar2 = auxiliar1[i];
					auxiliar3 = auxiliar2.split(",");
				    waypoints = [auxiliar3[0],auxiliar3[1]];
				    puntos.push(waypoints);
				}

				var polyline = L.polyline(puntos,
	            {
	                color: color1,
	                weight: weight1,
	                opacity: opacity1
	            }
	            ).addTo(this.map);

				markers.push({id1:id, object:polyline});
				   
			//}catch (e) {
			//	return;
			//}

	};

	Acts.prototype.setTileUrl = function(url) {
		
		L.tileLayer(
            url, {
            attribution: 'Map data &copy;',
            maxZoom: this.map.getZoom(),
            }).addTo(this.map);

	};

	Acts.prototype.setRoute = function(id, firstLat, firstLong, lastLat, lastLong, icono, hight, width, addWaypoints1, draggableWaypoints1, routeDragging) {

		var miIcono;

		if(icono=="default")
		{
			 miIcono = L.icon({
			iconUrl: 'http://cdn.leafletjs.com/leaflet-0.7.3/images/marker-icon.png',
			iconSize: [hight, width]
			

		});
		}
		else {
			 miIcono = L.icon({
			iconUrl: icono,
			iconSize: [hight, width]

		});
		}

		var ruta = L.Routing.control({
  			waypoints: [
    			L.latLng(firstLat, firstLong),
    			L.latLng(lastLat, lastLong)
  			],
  			createMarker: function(i, wp) {
				return L.marker(wp.latLng, {
					draggable: true,
					icon: miIcono
				})}
			,
  			draggableWaypoints: indexToBoolean(draggableWaypoints1),
      		addWaypoints: indexToBoolean(addWaypoints1),
      		routeWhileDragging: indexToBoolean(routeDragging)
			}).addTo(this.map);

		routes.push({id1:id, object:ruta});

	};

	Acts.prototype.removeRoute = function(id) {
		for (var i = 0; i < routes.length; i++) {
			if (routes[i].id1 == id) {this.map.removeControl(routes[i].object);}
		}
	};

	Acts.prototype.mapToImage = function() {

		try{
		
		leafletImage(this.map, function(err, canvas) {

			if(err){

				osmRuntime.trigger(cr.plugins_.OSMjosek5494.prototype.cnds.onMapToImageError, self);

			}else{

				urlDataImage = canvas.toDataURL();
				osmRuntime.trigger(cr.plugins_.OSMjosek5494.prototype.cnds.onMapToImageSucc, self);

			}

		}); } catch(ex){
			osmRuntime.trigger(cr.plugins_.OSMjosek5494.prototype.cnds.onMapToImageError, self);
			console.log(ex);}
	};

	Acts.prototype.enableMapControls = function() {

		this.map.dragging.enable();
		this.map.touchZoom.enable();
		this.map.doubleClickZoom.enable();
		this.map.scrollWheelZoom.enable();
		this.map.boxZoom.enable();
		this.map.keyboard.enable();
		if (this.map.tap) this.map.tap.enable();
		
	};

	Acts.prototype.disableMapControls = function() {

		this.map.dragging.disable();
		this.map.touchZoom.disable();
		this.map.doubleClickZoom.disable();
		this.map.scrollWheelZoom.disable();
		this.map.boxZoom.disable();
		this.map.keyboard.disable();
		if (this.map.tap) this.map.tap.disable();
		
	};

	// ... other actions here ...

	pluginProto.acts = new Acts();

	//////////////////////////////////////
	// Expressions
	function Exps() {};

	// the example expression
	Exps.prototype.markerClicked = function(ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//ret.set_int(1337); // return our value
		// ret.set_float(0.5);			// for returning floats
		ret.set_string(selected_markerId); // for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

	Exps.prototype.shapeClicked = function(ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//ret.set_int(1337); // return our value
		// ret.set_float(0.5);			// for returning floats
		ret.set_string(selected_shapeId); // for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

	Exps.prototype.getZoom = function(ret) // 'ret' must always be the first parameter - always return the expression's result through it!
	{
		//ret.set_int(1337); // return our value
		// ret.set_float(0.5);			// for returning floats
		ret.set_int(this.map.getZoom()); // for ef_return_string
		// ret.set_any("woo");			// for ef_return_any, accepts either a number or string
	};

	Exps.prototype.mapDataUrl = function(ret)
	{

		ret.set_string(urlDataImage);

	};

	// ... other expressions here ...

	pluginProto.exps = new Exps();

}());