'use strict';

{
	C3.Plugins.LysdenArt_MaplyLitePlugin.Exps =
	{
		// Returns the current zoom level of the map view
		GetZoom () {
			return this.data.zoom;
		},

		// Returns the geographical center of the map view
		GetCenterLat () {
			return this.data.lat;
		},

		// Returns the geographical center of the map view
		GetCenterLng () {
			return this.data.lng;
		},

		// Returns the minimum zoom level of the map (if set in the minZoom option of the map or of any layers), or 0 by default.
		GetMinZoom () {
			return this.params.minZoom;
		},

		// Returns the maximum zoom level of the map (if set in the maxZoom option of the map or of any layers).
		GetMaxZoom () {
			return this.params.maxZoom;
		},

		GetDistance (id) {
			let ret = this.data.mapDistance[id];
			delete this.data.mapDistance[id];
			return ret;
		}
	};
}
