'use strict';

{
  C3.Plugins.LysdenArt_MaplyLitePlugin.Cnds =
  {
    // APPEARANCE STATE
    IsFlipped() { 
      if(this.data.flipped) {
        return true;
      }
    },
    IsMirrored() { 
      if(this.data.mirrored) {
        return true;
      }
    },

    // MAP STATE CHANGE EVENTS
    OnResize () { return true; },
    OnLoad () { return true; },
    OnZoomStart () { return true; },
    OnZoom () { return true; },
    OnZoomEnd () { return true; },

    // INTERACTION EVENTS
    OnClick () { return true; },

    // ADDITIONAL EVENTS
    // Check if a marker is added
    OnMarkerAdded() {
      return true;
    },

    // Check if a marker is removed
    OnMarkerRemoved() {
      return true;
    },

    // Check if all markers were removed
    OnAllMarkersRemoved() {
      return true;
    },

    // Check if a marker exists on the map
    IsMarkerExist(markerId) {
      return this.data.markers && this.data.markers[markerId] ? true : false;
    },

    // Check if a specific marker is visible
    IsMarkerVisible(markerId) {
      if (this.data.markers && this.data.markers[markerId]) {
        return this.data.markers[markerId].visible || false;
      }
      return false;
    },

    // Get the position of a marker by its ID
    GetMarkerPosition(markerId) {
      if (this.data.markers && this.data.markers[markerId]) {
        const marker = this.data.markers[markerId];
        return {
          lat: marker.lat,
          lng: marker.lng
        };
      }
      return null;
    },

    // Check if the map has markers
    HasMarkers() {
      return this.data.markers && Object.keys(this.data.markers).length > 0;
    },

    // Check if the map has any marker within a specific distance
    HasMarkersWithinDistance(lat, lng, distance) {
      if (this.data.markers) {
        for (let markerId in this.data.markers) {
          const marker = this.data.markers[markerId];
          const distanceToMarker = this.calculateDistance(lat, lng, marker.lat, marker.lng);
          if (distanceToMarker <= distance) {
            return true;
          }
        }
      }
      return false;
    },
  };
  
  // Helper method to calculate distance between two points (in km)
  C3.Plugins.LysdenArt_MaplyLitePlugin.Cnds.calculateDistance = function(lat1, lng1, lat2, lng2) {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLng = this.degreesToRadians(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) * Math.cos(this.degreesToRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  // Helper method to convert degrees to radians
  C3.Plugins.LysdenArt_MaplyLitePlugin.Cnds.degreesToRadians = function(degrees) {
    return degrees * (Math.PI / 180);
  };

}
