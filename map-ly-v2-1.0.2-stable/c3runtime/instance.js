"use strict";

{
  const DB_STORE_NAME = "MapLy";
  const DOM_COMPONENT_ID = "lysdenart_maply_lite_plugin";

  C3.Plugins.LysdenArt_MaplyLitePlugin.Instance = class MaplyLiteInstance extends C3.SDKDOMInstanceBase {
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
          enablingZoom: properties[12],
          markers: [] // Inicializa a lista de marcadores
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
        markers: [] // Inicializa o estado dos marcadores
      };

      if (this._runtime.IsPreview()) {
        this.GetPreviewUrls();
      } else {
        this.CreateElement();
      }
    }

    // Função para adicionar um marcador
    _AddMarker(latitude, longitude, iconUrl, title, description) {
      const marker = { latitude, longitude, iconUrl, title, description };
      this.data.markers.push(marker);
      this.PostToDOMElement("UpdateMarkers_lite", { markers: this.data.markers });
    }

    // Função para remover um marcador
    _DeleteMarker(marker) {
      const index = this.data.markers.indexOf(marker);
      if (index > -1) {
        this.data.markers.splice(index, 1);
        this.PostToDOMElement("UpdateMarkers_lite", { markers: this.data.markers });
      }
    }

    // Função para limpar todos os marcadores
    _ClearAllMarkers() {
      this.data.markers = [];
      this.PostToDOMElement("UpdateMarkers_lite", { markers: this.data.markers });
    }

    // Funções existentes de eventos do mapa (tamanho, zoom, etc.)
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

    // Interação com o clique do mapa
    _OnClick(e) {
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
        params: this.params,
      };
    }

    LoadFromJson(o) {
      this.params = o["params"];
      this.UpdateElementState();
    }
  };
}
