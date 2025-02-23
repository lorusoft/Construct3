'use strict';

{
	C3.Plugins.LysdenArt_MaplyLitePlugin.Cnds =
	{
		// APPERANCE STATE
		IsFlipped() { 
			if(this.data.flipped) {
				return true;
			}
		},
		IsMirrored() { 
			if(this.data.mirrored) {
				return true;
			}
		},

		// MAP STATE CHANGE EVENTS
		OnResize () { return true;	},
		OnLoad () { return true;	},
		OnZoomStart () { return true;	},
		OnZoom () { return true;	},
		OnZoomEnd () { return true;	},

		// INTERACTION EVENTS
		OnClick () { return true; },

	};
}
