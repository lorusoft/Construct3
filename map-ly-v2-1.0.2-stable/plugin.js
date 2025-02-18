"use strict";

{
  const PLUGIN_ID = "LysdenArt_MaplyLitePlugin";
  const PLUGIN_VERSION = "1.0.0";
  const PLUGIN_CATEGORY = "general";

  const PLUGIN_CLASS = (SDK.Plugins.LysdenArt_MaplyLitePlugin = class MaplyLitePlugin extends SDK.IPluginBase {
    constructor() {
      super(PLUGIN_ID);

      SDK.Lang.PushContext("plugins." + PLUGIN_ID.toLowerCase());

      this._info.SetName(lang(".name"));
      this._info.SetDescription(lang(".description"));
      this._info.SetVersion(PLUGIN_VERSION);
      this._info.SetCategory(PLUGIN_CATEGORY);
      this._info.SetAuthor("Lysden.art");
      this._info.SetHelpUrl(lang(".help-url"));
      this._info.SetPluginType("world"); // mark as world plugin since it's placed in the layout
      this._info.SetIsResizable(true); // allow to be resized
      this._info.SetIsRotatable(true); // allow to be rotated
      this._info.SetSupportsEffects(true); // allow effects
      this._info.SetSupportsColor(false);
      this._info.SetMustPreDraw(true);
      this._info.SetCanBeBundled(true);

      this._info.AddCommonPositionACEs();
      this._info.AddCommonSizeACEs();
      this._info.AddCommonAngleACEs();
      this._info.AddCommonSceneGraphACEs();

      // Load domSide.js in the document context (main thread).
      // This is important for supporting the runtime's web worker mode.
      this._info.SetDOMSideScripts(["c3runtime/domSide.js"]);

      SDK.Lang.PushContext(".properties");

      this._info.SetProperties([
        new SDK.PluginProperty("check", "initiallyVisible", true),
        new SDK.PluginProperty("group", "groupTileLayer"),
        new SDK.PluginProperty(
          "longtext",
          "tileLayer",
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ),
        new SDK.PluginProperty(
          "longtext",
          "attribution",
          "openstreetmap.org"
        ),
        new SDK.PluginProperty("link", "providers", {
          linkCallback: function () {
            window.open(
              "https://leaflet-extras.github.io/leaflet-providers/preview/",
              "_blank"
            );
          },
          callbackType: "once-for-type",
        }),

        new SDK.PluginProperty("group", "groupStateOptions"),
        new SDK.PluginProperty("float", "latitude", 47.2211),
        new SDK.PluginProperty("float", "longitude", 2.0685),
        new SDK.PluginProperty("integer", "zoom", 9),
        new SDK.PluginProperty("integer", "minZoom", 1),
        new SDK.PluginProperty("integer", "maxZoom", 18),

        new SDK.PluginProperty("group", "groupControl"),
        new SDK.PluginProperty("check", "showZoomControl", true),
        new SDK.PluginProperty("check", "showScaleControl", false),

        new SDK.PluginProperty("group", "groupInteractionOptions"),
        new SDK.PluginProperty("check", "doubleClickZoom", false),
        new SDK.PluginProperty("check", "dragging", true),
        new SDK.PluginProperty("check", "enablingZoom", true)
      ]);

      this._info.AddFileDependency({
        filename: "external/leaflet.js",
        type: "external-dom-script",
      });

      this._info.AddFileDependency({
        filename: "external/Leaflet.TileLayerCanvas.js",
        type: "external-dom-script",
      });

      this._info.AddFileDependency({
        filename: "external/leaflet.css",
        type: "external-css",
      });

      this._info.AddFileDependency({
        filename: "external/images/layers-2x.png",
        type: "copy-to-output",
        fileType: "image/png",
      });

      this._info.AddFileDependency({
        filename: "external/images/spritesheet.png",
        type: "copy-to-output",
        fileType: "image/png",
      });

      this._info.AddFileDependency({
        filename: "external/images/spritesheet-2x.png",
        type: "copy-to-output",
        fileType: "image/png",
      });

      this._info.AddFileDependency({
        filename: "external/images/spritesheet.svg",
        type: "copy-to-output",
        fileType: "image/svg+xml",
      });

      this._info.AddFileDependency({
        filename: "external/images/layers.png",
        type: "copy-to-output",
        fileType: "image/png",
      });

      this._info.AddFileDependency({
        filename: "external/images/marker-icon.png",
        type: "copy-to-output",
        fileType: "image/png",
      });

      this._info.AddFileDependency({
        filename: "external/images/loader.gif",
        type: "copy-to-output",
        fileType: "image/gif",
      });

      SDK.Lang.PopContext();
      SDK.Lang.PopContext();
    }

    // Inicialização do mapa
    OnLoad(e) {
      this.markers = []; // Inicializa o array de marcadores
      this.mapInstance = L.map(this.GetCanvasElement()).setView([47.2211, 2.0685], 9); // Configura a posição inicial e zoom
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(this.mapInstance);
    }

    // Acessa a instância do mapa
    GetMapInstance() {
      return this.mapInstance;
    }

    // Função para adicionar um marcador
    AddMarker(latitude, longitude, iconUrl = "default_marker.png", title = "", description = "") {
      const map = this.GetMapInstance();

      const marker = L.marker([latitude, longitude], {
        icon: L.icon({
          iconUrl: iconUrl, // ícone fornecido ou padrão
          iconSize: [32, 32], // tamanho do ícone
          iconAnchor: [16, 32], // posição do ícone
        })
      }).addTo(map);

      // Configura título no marcador
      marker.bindTooltip(title, { permanent: false, direction: 'top' });

      // Configura balão de descrição
      marker.bindPopup(description);

      // Armazena o marcador para futuras manipulações
      this.markers.push(marker);
    }

    // Função para remover um marcador
    DeleteMarker(marker) {
      const map = this.GetMapInstance();
      if (marker) {
        map.removeLayer(marker);
      }
    }

    // Função para excluir todos os marcadores
    ClearAllMarkers() {
      const map = this.GetMapInstance();
      this.markers.forEach(marker => map.removeLayer(marker)); // Remove todos os marcadores
      this.markers = []; // Limpa o array de marcadores
    }
  });

  // Registra o plugin
  PLUGIN_CLASS.Register(PLUGIN_ID, PLUGIN_CLASS);
}
