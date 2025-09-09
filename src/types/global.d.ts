/// <reference types="@types/google.maps" />

// Global declarations for browser globals
declare global {
  interface Window {
    google: typeof google;
    initMap?: () => void;
  }
  
  // Make google available globally for the maps API
  const google: typeof import('@types/google.maps').google;
}

export {};