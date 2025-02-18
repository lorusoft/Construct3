'use strict';

{
	C3.Plugins.LysdenArt_MaplyLitePlugin.Exps = {
		// Retorna o nível atual de zoom da visualização do mapa
		GetZoom() {
			return this.data.zoom;
		},

		// Retorna a latitude central geográfica da visualização do mapa
		GetCenterLat() {
			return this.data.lat;
		},

		// Retorna a longitude central geográfica da visualização do mapa
		GetCenterLng() {
			return this.data.lng;
		},

		// Retorna o nível mínimo de zoom do mapa (se configurado na opção minZoom do mapa ou de qualquer camada), ou 0 por padrão.
		GetMinZoom() {
			return this.params.minZoom;
		},

		// Retorna o nível máximo de zoom do mapa (se configurado na opção maxZoom do mapa ou de qualquer camada).
		GetMaxZoom() {
			return this.params.maxZoom;
		},

		// Retorna a distância entre dois pontos do mapa com base no ID (provavelmente usado para medir distâncias no mapa)
		GetDistance(id) {
			let ret = this.data.mapDistance[id];
			delete this.data.mapDistance[id];
			return ret;
		},

		// Retorna a visibilidade do controle de zoom (visível ou invisível)
		GetZoomControlVisibility() {
			return this.data.zoomControlVisible ? "visible" : "invisible";
		},

		// Retorna a visibilidade do controle de escala (visível ou invisível)
		GetScaleControlVisibility() {
			return this.data.scaleControlVisible ? "visible" : "invisible";
		},

		// Retorna o número de marcadores no mapa
		GetMarkerCount() {
			return this.data.markerCount || 0;
		},

		// Retorna a latitude do marcador com o índice especificado
		GetMarkerLat(index) {
			const marker = this.data.markers[index];
			return marker ? marker.lat : 0;
		},

		// Retorna a longitude do marcador com o índice especificado
		GetMarkerLng(index) {
			const marker = this.data.markers[index];
			return marker ? marker.lng : 0;
		},

		// Retorna o título de um marcador específico pelo índice
		GetMarkerTitle(index) {
			const marker = this.data.markers[index];
			return marker ? marker.title : "";
		},

		// Retorna o conteúdo do balão do marcador específico pelo índice
		GetMarkerPopupContent(index) {
			const marker = this.data.markers[index];
			return marker && marker.popupContent ? marker.popupContent : "";
		}
	};
}
