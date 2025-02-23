function GetPluginSettings()
{
	return {
		"name":			"Open Street Maps",				// as appears in 'insert object' dialog, can be changed as long as "id" stays the same
		"id":			"OSMjosek5494",				// this is used to identify this plugin and is saved to the project; never change it
		"version":		"1.0",					// (float in x.y format) Plugin version - C2 shows compatibility warnings based on this
		"description":	"Use Open Street Maps features in your projects.",
		"author":		"Josek5494",
		"help url":		"http://hermitsdevelopment.blogspot.com.es",
		"category":		"Plugins by Josek5494",				// Prefer to re-use existing categories, but you can set anything here
		"type":			"world",				// either "world" (appears in layout and is drawn), else "object"
		"rotatable":	false,					// only used when "type" is "world".  Enables an angle property on the object.
		"flags":		pf_size_aces,						// uncomment lines to enable flags...
					//	| pf_singleglobal		// exists project-wide, e.g. mouse, keyboard.  "type" must be "object".
					//	| pf_texture			// object has a single texture (e.g. tiled background)
					//	| pf_position_aces		// compare/set/get x, y...
					//	| pf_size_aces			// compare/set/get width, height...
					//	| pf_angle_aces			// compare/set/get angle (recommended that "rotatable" be set to true)
					//	| pf_appearance_aces	// compare/set/get visible, opacity...
					//	| pf_tiling				// adjusts image editor features to better suit tiled images (e.g. tiled background)
					//	| pf_animations			// enables the animations system.  See 'Sprite' for usage
					//	| pf_zorder_aces		// move to top, bottom, layer...
					//  | pf_nosize				// prevent resizing in the editor
					//	| pf_effects			// allow WebGL shader effects to be added
					//  | pf_predraw			// set for any plugin which draws and is not a sprite (i.e. does not simply draw
		"dependency":	"_leaflet.js;leaflet.css;leaflet-routing-machine.css;leaflet-routing-machine.js;leaflet-image.js;leaflet.routing.icons.png;routing-icon.png"							// a single non-tiling image the size of the object) - required for effects to work properly
	};
};

//Conditions

AddStringParam("Marker id", "");
AddCondition(0, cf_trigger, "On marker clicked", "Open Street Maps Markers", "On marker clicked", "Triggered when a marker is clicked.", "onMarkerClicked");

AddStringParam("Shape id", "");
AddCondition(1, cf_trigger, "On shape clicked", "Open Street Maps Shapes", "On shape clicked", "Triggered when a shape is clicked.", "onShapeClicked");

AddCondition(2, cf_trigger, "On map clicked", "Open Street Maps", "On map clicked", "Triggered when the map is clicked.", "onMapClicked");

AddCondition(3, cf_trigger, "Map to image success", "Open Street Maps", "Map to image success", "Triggered when the map is successfully converted to image.", "onMapToImageSucc");
AddCondition(4, cf_trigger, "Map to image error", "Open Street Maps", "Map to image error", "Triggered when the map was not converted to image successfully.", "onMapToImageError");

//Actions

AddStringParam("Id", "");
AddStringParam("Latitude", "");
AddStringParam("Longitude", "");
AddStringParam("Radius", "");
AddStringParam("Color", "");
AddStringParam("Fill color", "");
AddStringParam("Fill opacity", "");
AddAction(0, af_none, "Draw circle", "Open Street Maps Shapes", "Draw a circle", "Draw circle in the map.", "drawCircle");

AddStringParam("Id", "");
AddStringParam("Latitude", "");
AddStringParam("Longitude", "");
AddStringParam("Description", "");
AddStringParam("Icon path", "", "\"default\"");
AddStringParam("Icon height", "");
AddStringParam("Icon width", "");
AddStringParam("Title", "");
AddStringParam("Anchor", "");
AddAction(1, af_none, "Set marker", "Open Street Maps Markers", "Set a marker", "Set a marker in the map", "setMarker");

AddAction(2, af_none, "Remove all markers", "Open Street Maps Markers", "Remove all markers", "Remove all markers in the map.", "removeAllMarkers");

AddStringParam("Marker/shape/path id", "");
AddAction(3, af_none, "Remove marker/shape/path", "Open Street Maps Markers", "Remove marker/shape/path", "Remove a marker/shape/path in the map.", "removeMarker");

AddStringParam("Latitude", "");
AddStringParam("Longitude", "");
AddStringParam("Zoom", "");
AddAction(4, af_none, "Set map focus", "Open Street Maps", "Set map focus", "Set the map focus to.", "setFocus");

AddStringParam("Id", "");
AddStringParam("List of points", "","\"lat,long/lat,long/lat,long\"");
AddStringParam("Color", "","\"red\"");
AddNumberParam("Weight", "", "5");
AddNumberParam("Opacity", "","0.5");
AddAction(5, af_none, "Set path", "Open Street Maps Path", "Set path", "Set a path between multiple points.", "setPath");

AddStringParam("Tile url", "");
AddAction(6, af_none, "Set the tile url", "Open Street Maps", "Set the tile url", "Set the tile url in the map.", "setTileUrl");

AddStringParam("Id", "");
AddNumberParam("First latitude", "", "");
AddNumberParam("First longitude", "","");
AddNumberParam("Last latitude", "", "");
AddNumberParam("Last longitude", "","");
AddStringParam("Icon url", "","\"default\"");
AddNumberParam("Icon height", "", "");
AddNumberParam("Icon width", "", "");
AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Add waypoints", "");
AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Draggable waypoints", "");
AddComboParamOption("True");
AddComboParamOption("False");
AddComboParam("Route while dragging", "");
AddAction(7, af_none, "Set route", "Open Street Maps Path", "Set route", "Set a route between two points with a Routing Machine", "setRoute");

AddStringParam("Route id", "");
AddAction(8, af_none, "Remove route", "Open Street Maps Path", "Remove route", "Remove a route in the map.", "removeRoute");

AddAction(9, af_none, "Map to image", "Open Street Maps", "Map to image", "Converts the current map in an image. Returns a data url by expression.", "mapToImage");

AddAction(10, af_none, "Enable map controls", "Open Street Maps", "Enable map controls", "Enable the map controls like dragging, touch...", "enableMapControls");
AddAction(11, af_none, "Disable map controls", "Open Street Maps", "Disable map controls", "Disble the map controls like dragging, touch...", "disableMapControls");

//Expressions

AddExpression(0, ef_return_string, "Marker clicked", "Open Street Maps Markers", "markerClicked", "Return the marker clicked id.");
AddExpression(1, ef_return_string, "Shape clicked", "Open Street Maps Shapes", "shapeClicked", "Return the shape clicked id.");
AddExpression(2, ef_return_number, "Get map zoom", "Open Street Maps", "getZoom", "Returns the current zoom of the map view.");
AddExpression(3, ef_return_string, "Map image data url", "Open Street Maps", "mapDataUrl", "Return the url for the map image.");

////////////////////////////////////////
ACESDone();



var property_list = [
	
	new cr.Property(ept_text, "Zoom", "13", "Set the view of the map to a given zoom."),
	new cr.Property(ept_text, "Latitude", "31.7963186", "Set the view of the map to a given latitude."),
	new cr.Property(ept_text, "Longitude", "35.175359", "Set the view of the map to a given longitude."),
	new cr.Property(ept_text, "Tile url", "http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", "Set the tile for the map.")
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
		
	// Plugin-specific variables
	// this.myValue = 0...
}
IDEInstance.prototype.OnCreate = function()
{
	this.instance.SetHotspot(new cr.vector2(0, 0));
}
// Called when inserted via Insert Object Dialog for the first time
IDEInstance.prototype.OnInserted = function()
{
	this.instance.SetSize(new cr.vector2(350, 300));
}

// Called when double clicked in layout
IDEInstance.prototype.OnDoubleClicked = function()
{
}

// Called after a property has been changed in the properties bar
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}

// For rendered objects to load fonts or textures
IDEInstance.prototype.OnRendererInit = function(renderer)
{
}

// Called to draw self in the editor if a layout object
IDEInstance.prototype.Draw = function(renderer)
{
	renderer.Fill(this.instance.GetBoundingQuad(), this.properties["Enabled"] === "Yes" ? cr.RGB(255, 255, 255) : cr.RGB(224, 224, 224));
	renderer.Outline(this.instance.GetBoundingQuad(),cr.RGB(0, 0, 0));
}

// For rendered objects to release fonts or textures
IDEInstance.prototype.OnRendererReleased = function(renderer)
{
}