'use strict';

{
  const DOM_COMPONENT_ID = 'lysdenart_maply_lite_plugin';

  C3.Plugins.LysdenArt_MaplyLitePlugin = class MaplyLitePlugin extends C3.SDKDOMPluginBase {
    constructor(opts) {
      super(opts, DOM_COMPONENT_ID);

      // Mensagens de eventos do DOM
      this.AddElementMessageHandler('OnClick_lite', (sdkInst, e) => sdkInst._OnClick(e));
      this.AddElementMessageHandler('OnResize_lite', (sdkInst, e) => sdkInst._OnResize(e));
      this.AddElementMessageHandler('OnLoad_lite', (sdkInst, e) => sdkInst._OnLoad(e));
      this.AddElementMessageHandler('OnZoomStart_lite', (sdkInst, e) => sdkInst._OnZoomStart(e));
      this.AddElementMessageHandler('OnZoom_lite', (sdkInst, e) => sdkInst._OnZoom(e));
      this.AddElementMessageHandler('OnZoomEnd_lite', (sdkInst, e) => sdkInst._OnZoomEnd(e));
      this.AddElementMessageHandler('UpdatedState_lite', (sdkInst, e) => sdkInst._UpdateStateFromDOM(e));

      // Novos manipuladores para interações com marcadores
      this.AddElementMessageHandler('AddMarker_lite', (sdkInst, e) => sdkInst._AddMarker(e.latitude, e.longitude, e.iconUrl, e.title, e.description));
      this.AddElementMessageHandler('DeleteMarker_lite', (sdkInst, e) => sdkInst._DeleteMarker(e.marker));
      this.AddElementMessageHandler('ClearAllMarkers_lite', (sdkInst, e) => sdkInst._ClearAllMarkers());
    }

    Release() {
      super.Release();
    }
  };
}

