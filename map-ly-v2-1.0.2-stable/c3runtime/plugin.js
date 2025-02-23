'use strict';

{
	const DOM_COMPONENT_ID = 'lysdenart_maply_lite_plugin';

	C3.Plugins.LysdenArt_MaplyLitePlugin = class MaplyLitePlugin extends C3.SDKDOMPluginBase {
		constructor (opts) {
			super(opts, DOM_COMPONENT_ID);

			this.AddElementMessageHandler('OnClick_lite', (sdkInst, e) => sdkInst._OnClick(e));
			this.AddElementMessageHandler('OnResize_lite', (sdkInst, e) => sdkInst._OnResize(e));
			this.AddElementMessageHandler('OnLoad_lite', (sdkInst, e) => sdkInst._OnLoad(e));
			this.AddElementMessageHandler('OnZoomStart_lite', (sdkInst, e) => sdkInst._OnZoomStart(e));
			this.AddElementMessageHandler('OnZoom_lite', (sdkInst, e) => sdkInst._OnZoom(e));
			this.AddElementMessageHandler('OnZoomEnd_lite', (sdkInst, e) => sdkInst._OnZoomEnd(e));
			this.AddElementMessageHandler('UpdatedState_lite', (sdkInst, e) => sdkInst._UpdateStateFromDOM(e));
		}

		Release () {
			super.Release();
		}
	};
}
