export interface Contact {
  id: string;
  name: string;
  phone: string;
  relation: string;
}

export interface DangerZone {
  id: string;
  name: string;
  radius: number;
  lat: number;
  lng: number;
  riskLevel: 'high' | 'medium' | 'low';
}

export interface Location {
  lat: number;
  lng: number;
  heading?: number;
}

export interface MapStyles {
  height: string;
  width: string;
}

export interface MarkerStyle {
  path: string;
  fillColor: string;
  fillOpacity: number;
  strokeWeight: number;
  strokeColor: string;
  scale: number;
  anchor?: google.maps.Point;
}
