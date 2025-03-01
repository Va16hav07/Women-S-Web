export type LatLngLiteral = google.maps.LatLngLiteral;

export interface Place {
  id: string;
  name: string;
  location: LatLngLiteral;
  address?: string;
  phoneNumber?: string;
  type: string;
  openNow?: boolean;
  rating?: number;
  distance?: number; // meters
}

export class PlacesService {
  private placesService: google.maps.places.PlacesService;
  private map: google.maps.Map;

  constructor(map: google.maps.Map) {
    this.map = map;
    this.placesService = new google.maps.places.PlacesService(map);
  }

  /**
   * Search for nearby emergency services
   * @param position Current position
   * @param type Type of place (police, hospital, etc)
   * @param radius Search radius in meters
   * @returns Promise with an array of Places
   */
  public async findNearbyEmergencyServices(
    position: LatLngLiteral,
    type: 'police' | 'hospital' | 'transit_station' | 'store' | 'pharmacy',
    radius: number = 5000
  ): Promise<Place[]> {
    return new Promise((resolve, reject) => {
      const request = {
        location: new google.maps.LatLng(position.lat, position.lng),
        radius,
        type
      };

      this.placesService.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          const places = results.map((result): Place => {
            return {
              id: result.place_id || '',
              name: result.name || 'Unnamed',
              location: {
                lat: result.geometry?.location?.lat() || position.lat,
                lng: result.geometry?.location?.lng() || position.lng
              },
              address: result.vicinity || undefined,
              type: result.types?.[0] || type,
              openNow: result.opening_hours?.isOpen?.() || undefined,
              rating: result.rating || undefined,
              // Calculate distance from current position
              distance: this.calculateDistance(
                position,
                {
                  lat: result.geometry?.location?.lat() || position.lat,
                  lng: result.geometry?.location?.lng() || position.lng
                }
              )
            };
          });

          // Sort by distance
          places.sort((a, b) => (a.distance || Infinity) - (b.distance || Infinity));
          resolve(places);
        } else {
          reject(new Error(`Place search failed: ${status}`));
        }
      });
    });
  }

  /**
   * Get details about a specific place
   * @param placeId Google Places ID
   * @returns Promise with detailed place information
   */
  public async getPlaceDetails(placeId: string): Promise<Place | null> {
    return new Promise((resolve, reject) => {
      this.placesService.getDetails(
        {
          placeId,
          fields: ['name', 'geometry', 'formatted_address', 'formatted_phone_number', 'opening_hours', 'rating', 'types']
        },
        (result, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && result) {
            const place: Place = {
              id: result.place_id || placeId,
              name: result.name || 'Unnamed',
              location: {
                lat: result.geometry?.location?.lat() || 0,
                lng: result.geometry?.location?.lng() || 0
              },
              address: result.formatted_address || undefined,
              phoneNumber: result.formatted_phone_number || undefined,
              type: result.types?.[0] || 'place',
              openNow: result.opening_hours?.isOpen?.() || undefined,
              rating: result.rating || undefined
            };
            resolve(place);
          } else {
            reject(new Error(`Place details request failed: ${status}`));
          }
        }
      );
    });
  }

  /**
   * Calculate distance between two points in meters
   */
  private calculateDistance(point1: LatLngLiteral, point2: LatLngLiteral): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = this.toRadians(point1.lat);
    const φ2 = this.toRadians(point2.lat);
    const Δφ = this.toRadians(point2.lat - point1.lat);
    const Δλ = this.toRadians(point2.lng - point1.lng);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
  }
}
