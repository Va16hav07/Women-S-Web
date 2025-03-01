import { DirectionsService } from './DirectionsService';

export type LatLngLiteral = google.maps.LatLngLiteral;
export type DirectionsResult = google.maps.DirectionsResult;
export type RoutePoint = LatLngLiteral;

export interface RouteMonitoringOptions {
  checkInterval?: number; // milliseconds
  onDeviation?: (position: LatLngLiteral, route: RoutePoint[]) => void;
  onReentry?: (position: LatLngLiteral, route: RoutePoint[]) => void;
  geofenceRadius?: number; // meters
}

export class RouteMonitoringService {
  private directionsService: DirectionsService;
  private watchId: number | null = null;
  private route: RoutePoint[] = [];
  private lastKnownPosition: LatLngLiteral | null = null;
  private onRoute: boolean = true;
  private options: RouteMonitoringOptions = {
    checkInterval: 10000, // 10 seconds
    geofenceRadius: 50, // 50 meters
  };

  constructor(options?: RouteMonitoringOptions) {
    this.directionsService = new DirectionsService();
    if (options) {
      this.options = { ...this.options, ...options };
    }
  }

  public async startMonitoring(origin: string, destination: string): Promise<boolean> {
    try {
      // Calculate the route
      const route = await this.directionsService.getRoute(origin, destination);
      if (!route) return false;
      
      // Extract route points
      this.route = this.extractRoutePoints(route);
      
      // Start monitoring the user's position
      this.startWatchingPosition();
      return true;
    } catch (error) {
      console.error("Failed to start route monitoring:", error);
      return false;
    }
  }

  public stopMonitoring(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    this.route = [];
    this.lastKnownPosition = null;
  }

  public isOnRoute(): boolean {
    return this.onRoute;
  }

  public getCurrentPosition(): LatLngLiteral | null {
    return this.lastKnownPosition;
  }

  public getRoutePoints(): RoutePoint[] {
    return [...this.route];
  }

  private extractRoutePoints(result: DirectionsResult): RoutePoint[] {
    if (!result.routes[0]?.overview_path) return [];
    
    return result.routes[0].overview_path.map(point => ({
      lat: point.lat(),
      lng: point.lng()
    }));
  }

  private startWatchingPosition(): void {
    if (!navigator.geolocation) {
      console.error("Geolocation is not supported by this browser.");
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.lastKnownPosition = currentPosition;
        this.checkRouteDeviation(currentPosition);
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

    // Also set up interval checking for more reliability
    setInterval(() => {
      if (this.lastKnownPosition) {
        this.checkRouteDeviation(this.lastKnownPosition);
      }
    }, this.options.checkInterval);
  }

  private checkRouteDeviation(position: LatLngLiteral): void {
    if (this.route.length === 0) return;

    // Use Google's geometry library to check if point is on path
    const isOnPath = google.maps.geometry.poly.isLocationOnEdge(
      new google.maps.LatLng(position.lat, position.lng),
      new google.maps.Polyline({ path: this.route }),
      this.options.geofenceRadius! / 1000 // Convert meters to kilometers
    );

    // If route status changed, trigger callbacks
    if (isOnPath && !this.onRoute) {
      this.onRoute = true;
      if (this.options.onReentry) {
        this.options.onReentry(position, this.route);
      }
    } else if (!isOnPath && this.onRoute) {
      this.onRoute = false;
      if (this.options.onDeviation) {
        this.options.onDeviation(position, this.route);
      }
    }
  }
}
