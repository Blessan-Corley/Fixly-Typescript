// Google Maps type definitions
declare namespace google {
  namespace maps {
    interface MapOptions {
      zoom?: number;
      center?: { lat: number; lng: number };
      [key: string]: any;
    }
    
    interface LatLng {
      lat(): number;
      lng(): number;
    }
    
    interface Marker {
      setPosition(_position: LatLng | { lat: number; lng: number }): void;
      [key: string]: any;
    }
    
    interface Map {
      [key: string]: any;
    }
    
    interface Geocoder {
      [key: string]: any;
    }
    
    interface GeocoderResult {
      [key: string]: any;
    }
    
    interface DirectionsService {
      [key: string]: any;
    }
    
    interface DirectionsRenderer {
      [key: string]: any;
    }
    
    interface PlacesService {
      [key: string]: any;
    }
    
    interface Autocomplete {
      [key: string]: any;
    }
  }
}