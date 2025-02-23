'use strict';

{
	C3.Plugins.LysdenArt_MaplyLitePlugin.Acts =
	{
		SetZoomControlVisible (v) {
			let _v = (v === 0) ? false : true;
			this.PostToDOMElement('SetZoomControlVisible_lite', {'params': {'showZoomControl': _v}});
		},

		SetControlScaleVisible (v) {
			let _v = (v === 0) ? false : true;
			this.PostToDOMElement('SetControlScaleVisible_lite', {'params': {'showScaleControl': _v}});
		},

		ChangeBaseTileLayer (nameLayer, attribution) {
			this.PostToDOMElement('ChangeBaseLayer_lite', {'nameLayer': nameLayer, 'attribution': attribution});
		},

		SetZoom (zoom) {
			this.PostToDOMElement('SetZoom_lite', {'zoom': zoom});
		},

		SetView (lat, lng) {
			this.PostToDOMElement('SetView_lite', {'coords': {"lat": lat, "lng": lng}});
		},

		SetFlip (state) {
			this.data.flipped = state
			this.PostToDOMElement('SetTransform_lite', {'flipped': state, 'mirrored': this.data.mirrored, rotation: this.data.rotation});
		},
		
		SetMirror (state) {
			this.data.mirrored = state
			this.PostToDOMElement('SetTransform_lite', {'flipped': this.data.flipped, 'mirrored': state, rotation: this.data.rotation});
		},
	};
}


