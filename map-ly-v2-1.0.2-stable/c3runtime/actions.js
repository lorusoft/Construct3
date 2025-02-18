'use strict';

{
	C3.Plugins.LysdenArt_MaplyLitePlugin.Acts =
	{
		// Controles de Zoom e Escala
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

		// Controle de Flip e Mirror
		SetFlip (state) {
			this.data.flipped = state
			this.PostToDOMElement('SetTransform_lite', {'flipped': state, 'mirrored': this.data.mirrored, rotation: this.data.rotation});
		},
		
		SetMirror (state) {
			this.data.mirrored = state
			this.PostToDOMElement('SetTransform_lite', {'flipped': this.data.flipped, 'mirrored': state, rotation: this.data.rotation});
		},

		// Adicionar Marcador
		AddMarker (lat, lng, iconUrl = null, title = "", description = "") {
			const markerId = `marker_${Date.now()}`;
			const marker = L.marker([lat, lng]);

			// Se for especificado um ícone via URL, define o ícone
			if (iconUrl) {
				const icon = L.icon({
					iconUrl: iconUrl,
					iconSize: [32, 32], // Tamanho do ícone
					iconAnchor: [16, 32], // Âncora do ícone
					popupAnchor: [0, -32] // Posição do balão
				});
				marker.setIcon(icon);
			}

			// Adiciona título e descrição no balão do marcador
			marker.bindPopup(`<strong>${title}</strong><br>${description}`);

			// Adiciona o marcador ao mapa
			marker.addTo(this.data.map);

			// Armazena o marcador na lista de marcadores
			this.data.markers = this.data.markers || {};
			this.data.markers[markerId] = marker;

			// Envia a informação para o evento de criação de marcador
			this.PostToDOMElement("OnMarkerAdded", {
				"markerId": markerId,
				"lat": lat,
				"lng": lng,
				"iconUrl": iconUrl,
				"title": title,
				"description": description
			});
		},

		// Remover Marcador
		RemoveMarker (markerId) {
			const marker = this.data.markers[markerId];
			if (marker) {
				marker.remove(); // Remove o marcador do mapa
				delete this.data.markers[markerId]; // Exclui da lista interna
				this.PostToDOMElement("OnMarkerRemoved", { "markerId": markerId });
			}
		},

		// Remover Todos os Marcadores
		RemoveAllMarkers () {
			for (let markerId in this.data.markers) {
				const marker = this.data.markers[markerId];
				marker.remove(); // Remove o marcador do mapa
				delete this.data.markers[markerId]; // Exclui da lista interna
			}
			this.PostToDOMElement("OnAllMarkersRemoved", {});
		}
	};
}
