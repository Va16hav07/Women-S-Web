import { DangerZone } from '../types/types';

interface Location {
  lat: number;
  lng: number;
  heading?: number;
  accuracy?: number;
}

// Create SVG for location marker with heading direction
export const createLocationSvg = (heading?: number): string => {
  const rotation = heading !== undefined ? heading : 0;
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <g transform="rotate(${rotation} 24 24)">
        <circle cx="24" cy="24" r="20" fill="#4285F4" fill-opacity="0.2" />
        <circle cx="24" cy="24" r="12" fill="#4285F4" stroke="#FFFFFF" stroke-width="2" />
        <path d="M24 16 L28 24 L24 32 L20 24 Z" fill="#FFFFFF" />
      </g>
    </svg>
  `;
};

// Create a fallback marker if SVG fails
export const createFallbackMarker = () => {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: "#4285F4",
    fillOpacity: 1,
    strokeColor: "#FFFFFF",
    strokeWeight: 2,
    scale: 8,
  };
};

// Create danger zone marker based on risk level
export const createDangerMarker = (riskLevel: string) => {
  let color = "#FF9500"; // Default orange for medium
  
  if (riskLevel === 'high') {
    color = "#FF3B30"; // Red
  } else if (riskLevel === 'low') {
    color = "#FFCC00"; // Yellow
  }
  
  return {
    path: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
    fillColor: color,
    fillOpacity: 0.9,
    strokeColor: "#FFFFFF",
    strokeWeight: 1.5,
    scale: 6,
    labelOrigin: new google.maps.Point(0, -3),
  };
};

// Create a pulsing dot effect
export const createPulsingDot = () => {
  return {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
        <circle cx="10" cy="10" r="8" fill="#4285F4" fill-opacity="0.8">
          <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
          <animate attributeName="fill-opacity" values="0.8;0.4;0.8" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="10" cy="10" r="5" fill="#4285F4" />
      </svg>
    `),
    scaledSize: new google.maps.Size(20, 20),
    anchor: new google.maps.Point(10, 10),
  };
};

// Create a destination marker
export const createDestinationMarker = () => {
  return {
    url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="36" viewBox="0 0 24 36">
        <path d="M12 0C5.383 0 0 5.383 0 12c0 9 12 24 12 24s12-15 12-24c0-6.617-5.383-12-12-12z" fill="#6D28D9" />
        <circle cx="12" cy="12" r="5" fill="white" />
      </svg>
    `),
    scaledSize: new google.maps.Size(24, 36),
    anchor: new google.maps.Point(12, 36),
  };
};

// High precision options for geolocation
export const getHighPrecisionOptions = (): PositionOptions => {
  return {
    enableHighAccuracy: true,
    timeout: 10000, // 10 seconds
    maximumAge: 30000 // 30 seconds
  };
};

// Get current position with a Promise interface
export const getCurrentPosition = (options?: PositionOptions): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

/**
 * Checks if coordinates are within any danger zone
 */
export const checkIfInDangerZone = (
  lat: number,
  lng: number,
  dangerZones: DangerZone[]
): DangerZone | null => {
  for (const zone of dangerZones) {
    const distance = getDistanceFromLatLonInMeters(lat, lng, zone.lat, zone.lng);
    if (distance <= zone.radius) {
      return zone;
    }
  }
  return null;
};

// Calculate distance between two points using Haversine formula
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

// Calculate distance between two points in meters
const getDistanceFromLatLonInMeters = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lat2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c * 1000; // Distance in meters
  return distance;
};

// Convert degrees to radians
const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Format coordinates for sharing
export const formatLocationForSharing = (lat: number, lng: number): string => {
  return `${lat.toFixed(6)},${lng.toFixed(6)}`;
};

// Create Google Maps URL from coordinates
export const createGoogleMapsUrl = (lat: number, lng: number): string => {
  return `https://www.google.com/maps?q=${lat},${lng}`;
};

// Create panic mode SMS message
export const createPanicMessage = (
  name: string, 
  lat: number, 
  lng: number,
  address?: string
): string => {
  const locationUrl = createGoogleMapsUrl(lat, lng);
  const addressText = address ? `near ${address}` : '';
  
  return `EMERGENCY ALERT: ${name} needs help! Current location ${addressText}: ${locationUrl}`;
};

/**
 * Helper function to get a more accurate location using multiple readings
 * This is useful for improving GPS accuracy
 */
export const getMoreAccuratePosition = async (
  maxWait = 10000, 
  desiredAccuracy = 20,
  maxRetries = 5
): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    // Initialize variables
    let bestPosition: GeolocationPosition | null = null;
    let tryCount = 0;
    let timeoutId: number | null = null;
    let watchId: number | null = null;
    
    // Time when we started this process
    const startTime = Date.now();
    
    // Clear everything
    const cleanup = () => {
      if (watchId !== null) navigator.geolocation.clearWatch(watchId);
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
    
    // Set timeout - we can't wait forever
    timeoutId = window.setTimeout(() => {
      cleanup();
      // If we have a position with reasonable accuracy, return it
      if (bestPosition && bestPosition.coords.accuracy <= 100) {
        resolve(bestPosition);
      } else if (bestPosition) {
        // Return whatever we have, even if not great
        resolve(bestPosition);
      } else {
        reject(new Error("Location timeout - couldn't get an accurate reading"));
      }
    }, maxWait);
    
    // Start watching position
    watchId = navigator.geolocation.watchPosition(
      (position) => {
        tryCount++;
        console.log(`Location attempt ${tryCount}, accuracy: ${position.coords.accuracy}m`);
        
        // If this is our first position or it's more accurate than the previous best
        if (!bestPosition || position.coords.accuracy < bestPosition.coords.accuracy) {
          bestPosition = position;
        }
        
        // If we reached desired accuracy or max retries, we're done
        if (position.coords.accuracy <= desiredAccuracy || tryCount >= maxRetries) {
          cleanup();
          resolve(position);
        }
        
        // If we've waited too long but have a decent position, stop
        if (Date.now() - startTime > maxWait * 0.8 && bestPosition && bestPosition.coords.accuracy <= 50) {
          cleanup();
          resolve(bestPosition);
        }
      },
      (error) => {
        cleanup();
        reject(error);
      },
      { 
        enableHighAccuracy: true,
        timeout: maxWait * 0.8,
        maximumAge: 0
      }
    );
  });
};

/**
 * Enhance accuracy indication beyond just meters
 * Returns a rating and text description of the accuracy level
 */
export const getAccuracyRating = (
  accuracy: number | undefined
): { rating: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown', text: string } => {
  if (accuracy === undefined) return { rating: 'unknown', text: 'Unknown' };
  
  if (accuracy <= 5) return { rating: 'excellent', text: 'Excellent (±5m)' };
  if (accuracy <= 20) return { rating: 'good', text: 'Good (±20m)' };
  if (accuracy <= 100) return { rating: 'fair', text: 'Fair (±100m)' };
  return { rating: 'poor', text: `Poor (±${Math.round(accuracy)}m)` };
};

// Smooth zoom effect
export const smoothZoomTo = (map: google.maps.Map, targetZoom: number): void => {
  const currentZoom = map.getZoom() || 0;
  if (currentZoom !== targetZoom) {
    // If we're zooming in, zoom in all the way in small increments
    const zoomAnimationStep = () => {
      const currentZoomLevel = map.getZoom() || 0;
      if (targetZoom > currentZoomLevel) {
        map.setZoom(currentZoomLevel + 1);
        setTimeout(zoomAnimationStep, 80);
      }
    };
    zoomAnimationStep();
  }
};

// Get time of day for theming
export const getTimeOfDay = (): 'day' | 'night' | 'twilight' => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 17) {
    return 'day';
  } else if (hour >= 17 && hour < 20) {
    return 'twilight';
  } else {
    return 'night';
  }
};

// Add refresh visual effect to map
export const addRefreshEffect = (map: google.maps.Map): void => {
  const originalZoom = map.getZoom() || 0;
  
  // Flash effect by slightly changing the zoom and restoring
  map.setZoom(originalZoom - 0.5);
  
  setTimeout(() => {
    map.setZoom(originalZoom);
  }, 150);
};

/**
 * Track user's live location and update the marker on map
 * Returns a cleanup function to stop tracking when needed
 */
export const trackLiveLocation = (
  map: google.maps.Map,
  onLocationUpdate?: (location: Location) => void,
  onError?: (error: GeolocationPositionError) => void
): () => void => {
  let marker: google.maps.Marker | null = null;
  let accuracyCircle: google.maps.Circle | null = null;

  // Initialize heading tracking
  let currentHeading: number | undefined = undefined;
  const deviceOrientationHandler = (event: DeviceOrientationEvent) => {
    // Alpha is the compass direction the device is facing in degrees
    if (event.alpha !== null) {
      currentHeading = event.alpha;
      updateLocationMarker({ lat: 0, lng: 0, heading: currentHeading });
    }
  };

  // Try to start device orientation tracking if available
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', deviceOrientationHandler);
  }

  // Watch position with high accuracy
  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude, accuracy, heading } = position.coords;
      
      // If device doesn't provide heading but we have one from device orientation
      const finalHeading = heading || currentHeading;
      
      // Update the marker on the map
      updateLocationMarker({
        lat: latitude,
        lng: longitude,
        heading: finalHeading,
        accuracy: accuracy
      });
      
      // Call the callback if provided
      if (onLocationUpdate) {
        onLocationUpdate({
          lat: latitude,
          lng: longitude,
          heading: finalHeading,
          accuracy: accuracy
        });
      }
    },
    (error) => {
      console.error('Geolocation error:', error);
      if (onError) onError(error);
    },
    getHighPrecisionOptions()
  );

  // Function to update or create the location marker
  function updateLocationMarker(location: Location) {
    const position = new google.maps.LatLng(location.lat, location.lng);
    
    // Create or update the accuracy circle
    if (!accuracyCircle && location.accuracy) {
      accuracyCircle = new google.maps.Circle({
        strokeColor: '#4285F4',
        strokeOpacity: 0.2,
        strokeWeight: 1,
        fillColor: '#4285F4',
        fillOpacity: 0.1,
        map,
        center: position,
        radius: location.accuracy
      });
    } else if (accuracyCircle && location.accuracy) {
      accuracyCircle.setCenter(position);
      accuracyCircle.setRadius(location.accuracy);
    }

    // Create or update the marker
    if (!marker) {
      const markerIcon = {
        url: 'data:image/svg+xml;charset=UTF-8,' + 
              encodeURIComponent(createLocationSvg(location.heading)),
        scaledSize: new google.maps.Size(48, 48),
        anchor: new google.maps.Point(24, 24),
      };
      
      marker = new google.maps.Marker({
        position,
        map,
        icon: markerIcon,
        optimized: true,
        zIndex: 999
      });
    } else {
      marker.setPosition(position);
      
      if (location.heading !== undefined) {
        // Update marker icon with new heading
        marker.setIcon({
          url: 'data:image/svg+xml;charset=UTF-8,' + 
                encodeURIComponent(createLocationSvg(location.heading)),
          scaledSize: new google.maps.Size(48, 48),
          anchor: new google.maps.Point(24, 24),
        });
      }
    }
  }

  // Return cleanup function
  return () => {
    navigator.geolocation.clearWatch(watchId);
    if (window.DeviceOrientationEvent) {
      window.removeEventListener('deviceorientation', deviceOrientationHandler);
    }
    if (marker) marker.setMap(null);
    if (accuracyCircle) accuracyCircle.setMap(null);
  };
};

/**
 * Centers the map on current location with smooth animation
 */
export const centerMapOnCurrentLocation = async (
  map: google.maps.Map,
  animate: boolean = true
): Promise<Location> => {
  try {
    const position = await getCurrentPosition(getHighPrecisionOptions());
    const { latitude, longitude, heading } = position.coords;
    const location: Location = { 
      lat: latitude, 
      lng: longitude, 
      heading: heading !== null ? heading : undefined 
    };
    
    if (animate) {
      map.panTo(new google.maps.LatLng(latitude, longitude));
    } else {
      map.setCenter(new google.maps.LatLng(latitude, longitude));
    }
    
    return location;
  } catch (error) {
    console.error("Error getting current location:", error);
    throw error;
  }
};
