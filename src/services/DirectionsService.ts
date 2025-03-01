type DirectionsResult = google.maps.DirectionsResult;
type TravelMode = google.maps.TravelMode;

export class DirectionsService {
  private directionsService: google.maps.DirectionsService;

  constructor() {
    this.directionsService = new google.maps.DirectionsService();
  }

  /**
   * Get a route between origin and destination
   * @param origin Starting point (address or coordinates)
   * @param destination End point (address or coordinates)
   * @param travelMode Mode of travel
   * @returns Promise with the route result
   */
  public async getRoute(
    origin: string | google.maps.LatLngLiteral,
    destination: string | google.maps.LatLngLiteral,
    travelMode: TravelMode = google.maps.TravelMode.WALKING
  ): Promise<DirectionsResult | null> {
    try {
      const request = {
        origin,
        destination,
        travelMode,
        provideRouteAlternatives: true,
        optimizeWaypoints: true
      };

      const result = await this.directionsService.route(request);
      return result;
    } catch (error) {
      console.error('Error getting directions:', error);
      return null;
    }
  }
}
