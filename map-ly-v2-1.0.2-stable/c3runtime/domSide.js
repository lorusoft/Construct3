"use strict";

{
  const DOM_COMPONENT_ID = "lysdenart_maply_lite_plugin";

  const HANDLER_CLASS = class MaplyLiteHandler extends DOMElementHandler {
    constructor(iRuntime) {
      super(iRuntime, DOM_COMPONENT_ID);

      // Handlers já existentes para outras funções
      this.AddDOMElementMessageHandler("refresh_lite", (elem, e) =>
        this.refresh(elem, e)
      );
      this.AddDOMElementMessageHandler("SetZoomControlVisible_lite", (elem, e) =>
        this.setZoomControlVisible(elem, e)
      );
      this.AddDOMElementMessageHandler("AddMarker_lite", (elem, e) =>
        this.addMarker(elem, e)
      );
      this.AddDOMElementMessageHandler("RemoveMarker_lite", (elem, e) =>
        this.removeMarker(elem, e)
      );

      // Outros handlers existentes
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

    // Função para adicionar um marcador ao mapa
    addMarker(elem, e) {
      const { lat, lng, title, iconUrl } = e;

      // Definir as opções de ícone (caso fornecido)
      const markerOptions = {
        title: title || "Marcador",
        icon: iconUrl ? globalThis.L.icon({ iconUrl: iconUrl }) : null,
      };

      // Criar o marcador no mapa
      const marker = globalThis.L.marker([lat, lng], markerOptions).addTo(elem.map);

      // Armazenar os marcadores no elemento para manipulação posterior
      elem.data.markers = elem.data.markers || [];
      elem.data.markers.push(marker);

      this.refresh(elem, e);
    }

    // Função para remover um marcador específico do mapa
    removeMarker(elem, e) {
      const markerId = e.markerId;

      // Encontrar o marcador pela id (leaflet_id)
      const marker = elem.data.markers.find(m => m._leaflet_id === markerId);
      
      // Remover o marcador se encontrado
      if (marker) {
        elem.map.removeLayer(marker);
        elem.data.markers = elem.data.markers.filter(m => m._leaflet_id !== markerId);
      }

      this.refresh(elem, e);
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
      var that = this;
      elem.addEventListener("click", function (e) {
        that.PostToRuntimeElement("OnClick_lite", elementId, {});
      });

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
