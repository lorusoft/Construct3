L.TileLayer.Canvas = L.TileLayer.extend({
  _delays: {},
  _delaysForZoom: null,

  // Função para criar o canvas e desenhar a imagem no tile
  createCanvas: function (tile, coords, done) {
    let err;
    const ctx = tile.getContext("2d");

    const { x: width, y: height } = this.getTileSize();
    tile.width = width;
    tile.height = height;

    const img = new Image();
    img.onload = () => {
      try {
        ctx.drawImage(img, 0, 0);
        tile.complete = true;
      } catch (e) {
        err = e;
      } finally {
        done(err, tile);
      }
    };

    const tileZoom = this._getZoomForUrl();
    img.src = isNaN(tileZoom) ? '' : this.getTileUrl(coords);
    img.crossOrigin = "anonymous";
  },

  // Função para criar o tile
  createTile: function (coords, done) {
    const { timeout } = this.options;
    const { z: zoom } = coords;
    const tile = document.createElement("canvas");

    // Controle de delay para renderização de tiles
    if (timeout) {
      if (zoom !== this._delaysForZoom) {
        this._clearDelaysForZoom();
        this._delaysForZoom = zoom;
      }

      if (!this._delays[zoom]) this._delays[zoom] = [];

      this._delays[zoom].push(setTimeout(() => {
        this.createCanvas(tile, coords, done);
      }, timeout));
    } else {
      this.createCanvas(tile, coords, done);
    }

    return tile;
  },

  // Função para limpar delays específicos de zoom
  _clearDelaysForZoom: function() {
    const prevZoom = this._delaysForZoom;
    const delays = this._delays[prevZoom];

    if (!delays) return;

    delays.forEach((delay, index) => {
      clearTimeout(delay);
      delete delays[index];
    });

    delete this._delays[prevZoom];
  },

  // Função para configurar a visibilidade do controle de zoom
  setZoomControlVisible: function(visible) {
    const zoomControl = this._map.zoomControl;
    if (zoomControl) {
      if (visible === "visible") {
        zoomControl.setPosition('topright'); // ou qualquer posição que preferir
        zoomControl.addTo(this._map);
      } else {
        this._map.removeControl(zoomControl);
      }
    }
  },

  // Função para definir o estilo e comportamentos do tile layer
  changeTileLayerStyle: function(url, attribution) {
    this.setUrl(url);
    this._url = url;
    if (attribution) {
      this.setAttribution(attribution);
    }
  }
});

// Função para inicializar a camada de tiles personalizada
L.tileLayer.canvas = function tileLayerCanvas(url, options) {
  return new L.TileLayer.Canvas(url, options);
};

// Método adicional para adicionar e gerenciar marcadores
L.TileLayer.Canvas.prototype.addMarker = function(lat, lng, iconUrl, title, popupContent) {
  const marker = L.marker([lat, lng], {
    icon: L.icon({ iconUrl: iconUrl, iconSize: [32, 32] }),
    title: title
  });

  if (popupContent) {
    marker.bindPopup(popupContent);
  }

  marker.addTo(this._map);
  return marker;
};

// Função para manipulação de eventos de clique nos marcadores
L.TileLayer.Canvas.prototype.addClickEventToMarker = function(marker, callback) {
  marker.on('click', callback);
};

// Função para remover marcadores
L.TileLayer.Canvas.prototype.removeMarker = function(marker) {
  this._map.removeLayer(marker);
};
