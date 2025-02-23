"use strict";

{
  const DOM_COMPONENT_ID = "lysdenart_maply_lite_plugin";

  const HANDLER_CLASS = class MaplyLiteHandler extends DOMElementHandler {
    constructor(iRuntime) {
      super(iRuntime, DOM_COMPONENT_ID);

      this.AddDOMElementMessageHandler("refresh_lite", (elem, e) =>
        this.refresh(elem, e)
      );
      this.AddDOMElementMessageHandler("SetZoomControlVisible_lite", (elem, e) =>
        this.setZoomControlVisible(elem, e)
      );
      this.AddDOMElementMessageHandler("SetControlScaleVisible_lite", (elem, e) =>
        this.setControlScaleVisible(elem, e)
      );
      this.AddDOMElementMessageHandler("ChangeBaseLayer_lite", (elem, e) =>
        this.changeBaseLayer(elem, e)
      );
      this.AddDOMElementMessageHandler("RequireUpdatedState_lite", (elem, e) =>
        this.sendUpdatedStateToRuntime(elem, e)
      );
      this.AddDOMElementMessageHandler("GetDistance_lite", (elem, e) =>
        this.getDistance(elem, e)
      );
      this.AddDOMElementMessageHandler("FlyTo_lite", (elem, e) =>
        this.flyTo(elem, e)
      );
      this.AddDOMElementMessageHandler("StopMvt_lite", (elem, e) =>
        this.stopMvt(elem, e)
      );
      this.AddDOMElementMessageHandler("SetSize_lite", (elem, e) =>
        this.setSize(elem, e)
      );
      this.AddDOMElementMessageHandler("SetPosition_lite", (elem, e) =>
        this.setPosition(elem, e)
      );
      this.AddDOMElementMessageHandler("SetOpacity_lite", (elem, e) =>
        this.setOpacity(elem, e)
      );
      this.AddDOMElementMessageHandler("SetTransform_lite", (elem, e) =>
        this.setTransform(elem, e)
      );
      this.AddDOMElementMessageHandler("SetZoom_lite", (elem, e) =>
        this.setZoom(elem, e)
      );
      this.AddDOMElementMessageHandler("SetView_lite", (elem, e) =>
        this.setView(elem, e)
      );
      this.AddDOMElementMessageHandler("ShowMap_lite", (elem, e) => {
        this.showMap(elem, e);
        this.refresh(elem, e);
      });
    }

    CreateElement(elementId, e) {
      const leafLet = document.createElement("div");
      leafLet.id = "map_lite_" + elementId;

      this.UpdateState(leafLet, e);
      this.placeMapFrame(leafLet, e);
      this.showMap(leafLet, e);

      // START --- Corrected links for preview mode ---
      var previewUrl = "";
      if (e.params.spritesheetPng) {
        previewUrl += ".leaflet-draw-toolbar a{background-image:url(";
        previewUrl += e.params.spritesheetPng;
        previewUrl +=
          "); background-image: linear-gradient(transparent,transparent),url(";
        previewUrl += e.params.spritesheetSvg;
        previewUrl += ");}";
      }
      if (e.params.layersPng) {
        previewUrl += ".leaflet-control-layers-toggle{background-image:url(";
        previewUrl += e.params.layersPng;
        previewUrl += ");}";
      }
      // END --- Corrected links for preview mode ---

      var newStyle = document.createElement("style");
      newStyle.appendChild(document.createTextNode(previewUrl));
      document.head.appendChild(newStyle);

      globalThis.L.Map.addInitHook(function () {
        this.getContainer().objMap = this;
      });

      document.body.style.background = "transparent";
      document.body.children[1].style.position = "absolute";

      this.createMap(leafLet, e);

      this.addListeners(leafLet, elementId);
      this.createLayers(leafLet, e);
      this.setZoomPermission(leafLet, e);
      this.setZoomControlVisible(leafLet, e);
      this.setControlScaleVisible(leafLet, e);

      this.setOpacity(leafLet, e.data);
      this.setTransform(leafLet, e.data);

      this.refresh(leafLet, e);

      return leafLet;
    }

    UpdateState(elem, e) {
      elem.params = e.params;
      elem.data = e.data;
    }

    sendUpdatedStateToRuntime(elem, e) {
      this.UpdateState(elem, e);
      const data = {
        lat: elem.map.getCenter().lat,
        lng: elem.map.getCenter().lng,
        zoom: elem.map._zoom,
        boundsJSON: JSON.stringify(elem.map.getBounds()),
        pixelBoundsJSON: JSON.stringify(elem.map.getPixelBounds()),
        licenseValidity: globalThis.maply?.lite,
      };
      this.PostToRuntimeElement("UpdatedState_lite", e.elementId, data);
    }

    // to make the div disappear when the map is cleared
    onDestroy() {
      if (globalThis.document.getElementById(this.mapId)) {
        const mapToBeDeleted = globalThis.document.getElementById(this.mapId);
        mapToBeDeleted.parentNode.removeChild(mapToBeDeleted);
      } else {
        return;
      }
    }

    createMap(elem, e) {
      elem.map = globalThis.L.map(elem, {
        doubleClickZoom: e.params.doubleClickZoom,
        dragging: e.params.dragging,
      });
      elem.map.setView([e.params.latitude, e.params.longitude]);
      elem.map.setZoom(e.params.zoom);
    }

    showMap(elem, e) {
      if (!e.params.visible) {
        elem.style.visibility = "hidden";
        elem.style.display = "none";
      } else {
        elem.style.visibility = "visible";
        elem.style.display = "block";
      }
    }

    placeMapFrame(elem, e) {
      elem.style.position = "absolute";
      elem.style.zIndex = 1;
    }

    addListeners(elem, elementId) {
      // INTERACTION EVENTS
      var that = this;
      elem.addEventListener("click", function (e) {
        that.PostToRuntimeElement("OnClick_lite", elementId, {});
      });

      // MAP STATE CHANGE EVENTS
      elem.map.on("resize", () =>
        this.PostToRuntimeElement("OnResize_lite", elementId)
      );
      elem.map.on("load", () => this.PostToRuntimeElement("OnLoad_lite", elementId));
      elem.map.on("zoomstart", () =>
        this.PostToRuntimeElement("OnZoomStart_lite", elementId)
      );
      elem.map.on("zoom", () => this.PostToRuntimeElement("OnZoom_lite", elementId));
      elem.map.on("zoomend", () =>
        this.PostToRuntimeElement("OnZoomEnd_lite", elementId)
      );
    }

    setZoomControlVisible(elem, e) {
      if (elem.params?.showZoomControl) {
        elem.map.addControl(elem.map.zoomControl);
      } else {
        elem.map.removeControl(elem.map.zoomControl);
      }
      this.refresh;
    }

    setZoomPermission(elem, e) {
      if (elem.params?.enablingZoom) {
        elem.map.scrollWheelZoom.enable();
      } else {
        elem.map.scrollWheelZoom.disable();
      }
      this.refresh;
    }

    createLayers(elem, e) {
      elem.baseLayer = globalThis.L.tileLayer.canvas(e.params.baseLayer, {
        attribution: e.params.attribution,
        minZoom: e.params.minZoom,
        maxZoom: e.params.maxZoom,
      });
      elem.baseLayer.addTo(elem.map);

      if (elem.params?.showDrawTools) {
        elem.layerControl = globalThis.L.control.layers().addTo(elem.map);
      }

      elem.overlays = {};
    }

    setControlScaleVisible(elem, e) {
      if (elem.controlScale) {
        elem.controlScale.remove();
      }
      elem.controlScale = globalThis.L.control.scale();
      if (e.params.showScaleControl) {
        elem.controlScale.addTo(elem.map);
      }
      this.refresh;
    }

    changeBaseLayer(elem, e) {
      elem.baseLayer.remove();
      elem.baseLayer = globalThis.L.tileLayer.canvas(e.nameLayer, {
        attribution: e.attribution,
      });
      elem.baseLayer.addTo(elem.map);
      this.refresh;
    }

    refresh(elem, e) {
      setTimeout(function () {
        elem.map.invalidateSize();
      }, 5);
    }

    setZoom(elem, e) {
      elem.objMap.setZoom(e.zoom);
    }

    setView(elem, e) {
      elem.objMap.setView([e.coords.lat, e.coords.lng]);
    }

    setOpacity(elem, e) {
      elem.style.opacity = e.opacity;
    }

    setTransform(elem, e) {
      setTimeout(function () {
        elem.style.transform = `scale(${e.flipped ? -1 : 1}, ${
          e.mirrored ? -1 : 1
        }) rotate(${
          (e.flipped ? -1 : 1) * (e.mirrored ? -1 : 1) * e.rotation
        }deg)`;
      }, 0);
    }

    setSize(elem, e) {
      var that = this;
      setTimeout(function () {
        elem.style.width = e.width + "px";
        elem.style.height = e.height + "px";
        that.refresh(elem, e);
      }, 0);
    }

    setPosition(elem, e) {
      const canvasBox = globalThis.document
        .querySelector("canvas")
        .getBoundingClientRect();
      elem.style.left = Math.ceil(e.x) + canvasBox.left + "px";
      elem.style.top = Math.ceil(e.y) + canvasBox.top + "px";
    }
  };

  RuntimeInterface.AddDOMHandlerClass(HANDLER_CLASS);
}
