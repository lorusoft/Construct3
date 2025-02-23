"use strict";

{
  const DB_STORE_NAME = "MapLy";
  const DOM_COMPONENT_ID = "lysdenart_maply_lite_plugin";

  C3.Plugins.LysdenArt_MaplyLitePlugin.Instance = class MaplyLiteInstance extends (
    C3.SDKDOMInstanceBase
  ) {
    constructor(inst, properties) {
      super(inst, DOM_COMPONENT_ID);

      this.params = {};

      if (properties) {
        this.params = {
          visible: properties[0],
          baseLayer: properties[1],
          attribution: properties[2],
          latitude: properties[3],
          longitude: properties[4],
          zoom: properties[5],
          minZoom: properties[6],
          maxZoom: properties[7],
          showZoomControl: properties[8],
          showScaleControl: properties[9],
          doubleClickZoom: properties[10],
          dragging: properties[11],
          enablingZoom: properties[12]
        };
      }

      this.GetWorldInfo().SetVisible(this.params.visible);

      this.data = {
        mapDistance: {},
        coords: {},
        clientX: 0,
        clientY: 0,
        rotation: C3.toDegrees(this.GetWorldInfo().GetAngle()),
        flipped: false,
        mirrored: false,
      };

      if (this._runtime.IsPreview()) {
        this.GetPreviewUrls();
      } else {
        this.CreateElement();
      }
    }

    Release() {
      super.Release();
    }

    GetElementState() {
      return {
        params: this.params,
        data: this.data,
      };
    }

    _UpdateStateFromDOM(e) {
      this.data = {
        ...this.data,
        lat: e.lat,
        lng: e.lng,
        zoom: e.zoom
      };
    }

    // MAP STATE CHANGE EVENTS
    _OnResize(e) {
      this.Trigger(C3.Plugins.LysdenArt_MaplyLitePlugin.Cnds.OnResize);
    }
    _OnLoad(e) {
      this.Trigger(C3.Plugins.LysdenArt_MaplyLitePlugin.Cnds.OnLoad);
    }
    _OnZoomStart(e) {
      this.Trigger(C3.Plugins.LysdenArt_MaplyLitePlugin.Cnds.OnZoomStart);
    }
    _OnZoom(e) {
      this.Trigger(C3.Plugins.LysdenArt_MaplyLitePlugin.Cnds.OnZoom);
    }
    _OnZoomEnd(e) {
      this.Trigger(C3.Plugins.LysdenArt_MaplyLitePlugin.Cnds.OnZoomEnd);
    }

    // INTERACTION EVENTS
    _OnClick(e) {
      /*       this.data.clientX = e.clientX;
      this.data.clientY = e.clientY; */
      this.data.coords = e.coords;
      this.Trigger(C3.Plugins.LysdenArt_MaplyLitePlugin.Cnds.OnClick);
    }

    async GetPreviewUrls() {
      this.params.spritesheetPng = await this._runtime
        .GetAssetManager()
        .GetProjectFileUrl("spritesheet.png");
      this.params.spritesheetSvg = await this._runtime
        .GetAssetManager()
        .GetProjectFileUrl("spritesheet.svg");
      this.params.layersPng = await this._runtime
        .GetAssetManager()
        .GetProjectFileUrl("layers.png");
      this.params.loaderGif = await this._runtime
        .GetAssetManager()
        .GetProjectFileUrl("loader.gif");

      this.CreateElement();
    }

    Draw(renderer) {
      // Only draw on canvas if dom element is placed behind it (use "Source out" blend mode)
        const wi = this.GetWorldInfo();
        const quad = wi.GetBoundingQuad();
        const tempQuad = new C3.Quad();

        renderer.SetBlendMode(wi.GetBlendMode());
        renderer.SetColorFillMode();
        renderer.SetColorRgba(
          wi._color._r,
          wi._color._g,
          wi._color._b,
          wi.GetOpacity()
        );

        if (this._runtime.IsPixelRoundingEnabled()) {
          const ox = Math.round(wi.GetX()) - wi.GetX();
          const oy = Math.round(wi.GetY()) - wi.GetY();
          tempQuad.copy(quad);
          tempQuad.offset(ox, oy);
          renderer.Quad(tempQuad);
        } else {
          renderer.Quad(quad);
        }
        wi.SetBboxChanged();
    }

    Tick() {
      this.PostToDOMElement("RequireUpdatedState_lite", {
        data: this.data,
        params: this.params,
      });

      this.data.rotation = C3.toDegrees(this.GetWorldInfo().GetAngle());
      const wi = this._inst.GetWorldInfo();
      const layer = wi.GetLayer();
      const newSize = layer.LayerToCanvasCss(
        (this.data.mirrored ? -1 : 1) * this.GetWorldInfo().GetWidth(),
        (this.data.flipped ? -1 : 1) * this.GetWorldInfo().GetHeight()
      );
      const newPosition = layer.LayerToCanvasCss(
        this.GetWorldInfo().GetX() -
          (this.data.mirrored ? this.GetWorldInfo().GetWidth() : 0),
        this.GetWorldInfo().GetY() -
          (this.data.flipped ? this.GetWorldInfo().GetHeight() : 0)
      );
      this.SetMapVisible(this.GetWorldInfo().IsVisible());
      this.PostToDOMElement("SetTransform_lite", {
        flipped: this.data.flipped,
        mirrored: this.data.mirrored,
        rotation: this.data.rotation,
      });

      this.SetMapOpacity(this.GetWorldInfo().GetOpacity());
      this.SetMapSize(newSize[0], newSize[1]);
      this.SetMapPosition(
        newPosition[0] - newSize[0] / 2,
        newPosition[1] - newSize[1] / 2
      );
    }

    SetMapVisible(v) {
      this.PostToDOMElement("ShowMap_lite", { params: { visible: v } });
    }

    SetMapOpacity(opacity) {
      this.PostToDOMElement("SetOpacity_lite", { opacity: opacity });
    }

    SetMapSize(width, height) {
      if (this._runtime.IsPixelRoundingEnabled()) {
        const ow = Math.round(width) - width;
        const oh = Math.round(height) - height;
        this.PostToDOMElement("SetSize_lite", {
          width: width - ow,
          height: height - oh,
        });
      } else {
        this.PostToDOMElement("SetSize_lite", {
          width: width,
          height: height,
        });
      }
    }

    SetMapPosition(x, y) {
      if (this._runtime.IsPixelRoundingEnabled()) {
        const ox = Math.round(x) - x;
        const oy = Math.round(y) - y;
        this.PostToDOMElement("SetPosition_lite", {
          x: x - ox,
          y: y - oy,
        });
      } else {
        this.PostToDOMElement("SetPosition_lite", {
          x: x,
          y: y,
        });
      }
    }

    SaveToJson() {
      return {
        // data to be saved for savegames
        params: this.params,
      };
    }

    LoadFromJson(o) {
      // load state for savegames
      this.params = o["params"];

      // ensures any state changes are updated in the DOM
      this.UpdateElementState();
    }
  };
}
