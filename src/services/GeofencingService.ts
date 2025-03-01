export type LatLngLiteral = google.maps.LatLngLiteral;
export type GeofenceType = 'route' | 'safeZone' | 'dangerZone';

export interface Geofence {
  id: string;
  type: GeofenceType;
  points: LatLngLiteral[];
  radius?: number; // meters
  name?: string;
}

export interface GeofenceEvent {
  geofenceId: string;
  position: LatLngLiteral;
  eventType: 'enter' | 'exit';
  timestamp: number;
}

export class GeofencingService {
  private geofences: Map<string, Geofence> = new Map();
  private watchId: number | null = null;
  private lastKnownPosition: LatLngLiteral | null = null;
  private listeners: ((event: GeofenceEvent) => void)[] = [];

  constructor() {}

  public addGeofence(geofence: Geofence): void {
    this.geofences.set(geofence.id, geofence);
  }

  public removeGeofence(id: string): boolean {
    return this.geofences.delete(id);
  }

  public clearGeofences(): void {
    this.geofences.clear();
  }

  public startMonitoring(): boolean {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return false;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.lastKnownPosition = currentPosition;
        this.checkGeofences(currentPosition);
      },
      (error) => {
        console.error("Error watching position:", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
      }
    );

    return true;
  }

  public stopMonitoring(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  public addListener(callback: (event: GeofenceEvent) => void): void {
    this.listeners.push(callback);
  }

  public removeListener(callback: (event: GeofenceEvent) => void): void {
    const index = this.listeners.indexOf(callback);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  private checkGeofences(position: LatLngLiteral): void {
    this.geofences.forEach((geofence, id) => {
      const wasInside = this.isInside(this.lastKnownPosition, geofence);
      const isInside = this.isInside(position, geofence);

      if (isInside && !wasInside) {
        // Entered the geofence
        this.notifyListeners({
          geofenceId: id,
          position,
          eventType: 'enter',
          timestamp: Date.now()
        });
      } else if (!isInside && wasInside) {
        // Exited the geofence
        this.notifyListeners({
          geofenceId: id,
          position,
          eventType: 'exit',
          timestamp: Date.now()
        });
      }
    });
  }

  private isInside(position: LatLngLiteral | null, geofence: Geofence): boolean {
    if (!position) return false;

    if (geofence.type === 'route') {
      // For routes, check if the position is on the path with a buffer
      return google.maps.geometry.poly.isLocationOnEdge(
        new google.maps.LatLng(position.lat, position.lng),
        new google.maps.Polyline({ path: geofence.points }),
        (geofence.radius || 50) / 1000 // Convert meters to kilometers
      );
    } else {
      // For safe/danger zones, check if inside polygon
      return google.maps.geometry.poly.containsLocation(
        new google.maps.LatLng(position.lat, position.lng),
        new google.maps.Polygon({ paths: geofence.points })
      );
    }
  }

  private notifyListeners(event: GeofenceEvent): void {
    this.listeners.forEach(listener => listener(event));
  }
}
