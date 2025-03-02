import { DangerZone } from '../types/types';

/**
 * Promise-based wrapper for navigator.geolocation.getCurrentPosition
 */
export const getCurrentPosition = (options?: PositionOptions): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
};

/**
 * Creates an enhanced SVG string for location marker with better visibility
 */
export const createLocationSvg = (heading?: number): string => {
  // Default SVG with no heading (blue dot with pulsing effect)
  if (heading === undefined) {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="10" fill="#4285F4" stroke="white" stroke-width="3">
          <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="24" cy="24" r="20" fill="#4285F4" fill-opacity="0.15" stroke="white" stroke-width="1">
          <animate attributeName="r" values="12;20;12" dur="2s" repeatCount="indefinite" />
          <animate attributeName="fill-opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
      </svg>
    `;
  }
  
  // Heading indicator version
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48">
      <circle cx="24" cy="24" r="12" fill="#4285F4" stroke="white" stroke-width="3">
        <animate attributeName="opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <path transform="rotate(${heading} 24 24)" d="M24 8 L32 24 L24 20 L16 24 Z" fill="white" stroke="white" stroke-width="1">
        <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
      </path>
    </svg>
  `;
};

/**
 * Creates a fallback marker icon if SVG creation fails
 */
export const createFallbackMarker = () => {
  return {
    path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
    scale: 12,
    fillColor: '#4285F4',
    fillOpacity: 1,
    strokeColor: '#FFFFFF',
    strokeWeight: 2,
  };
};

/**
 * Creates customized danger zone markers based on risk level
 * Enhanced to be more visually appealing with larger, more vibrant markers
 */
export const createDangerMarker = (riskLevel: 'high' | 'medium' | 'low'): google.maps.Symbol | google.maps.Icon => {
  // Colors based on risk level
  const colorMap = {
    high: '#FF3B30',    // Vibrant red
    medium: '#FF9500',  // Vibrant orange
    low: '#FFCC00'      // Vibrant yellow
  };
  
  const color = colorMap[riskLevel];
  
  // Create a more detailed SVG marker
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48">
        <path 
          d="M16 0C7.16 0 0 7.16 0 16c0 10.67 16 32 16 32s16-21.33 16-32c0-8.84-7.16-16-16-16z"
          fill="${color}" 
          stroke="#FFFFFF" 
          stroke-width="2"
        />
        <circle cx="16" cy="16" r="7" fill="white" />
        <circle cx="16" cy="16" r="5" fill="${color}" />
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(32, 48),
    anchor: new google.maps.Point(16, 48),
    labelOrigin: new google.maps.Point(16, 16)
  };
};

/**
 * Creates a pulsing dot effect for the current location marker
 */
export const createPulsingDot = (color = '#4285F4'): string => {
  return `
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" fill="${color}" stroke="white" stroke-width="2">
        <animate attributeName="opacity" values="1;0.8;1" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="12" cy="12" r="12" fill="${color}" fill-opacity="0.3">
        <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
        <animate attributeName="fill-opacity" values="0.3;0.1;0.3" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  `;
};

/**
 * Creates a custom marker for showing destinations
 * Enhanced with a more distinct appearance
 */
export const createDestinationMarker = (): google.maps.Symbol | google.maps.Icon => {
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="52" viewBox="0 0 36 52">
        <path 
          d="M18 0C8.06 0 0 8.06 0 18c0 12 18 34 18 34s18-22 18-34c0-9.94-8.06-18-18-18z"
          fill="#4CAF50" 
          stroke="#FFFFFF" 
          stroke-width="2"
        />
        <path 
          d="M26 17h-7v-7c0-.55-.45-1-1-1s-1 .45-1 1v7h-7c-.55 0-1 .45-1 1s.45 1 1 1h7v7c0 .55.45 1 1 1s1-.45 1-1v-7h7c.55 0 1-.45 1-1s-.45-1-1-1z"
          fill="white"
        />
      </svg>
    `)}`,
    scaledSize: new google.maps.Size(36, 52),
    anchor: new google.maps.Point(18, 52),
    labelOrigin: new google.maps.Point(18, 18)
  };
};

/**
 * Checks if a location is inside any danger zone
 */
export const checkIfInDangerZone = (
  lat: number, 
  lng: number, 
  dangerZones: DangerZone[]
): DangerZone | null => {
  // Calculate distance between two points using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371000; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lng2 - lng1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // Check each zone
  for (const zone of dangerZones) {
    const distance = calculateDistance(lat, lng, zone.lat, zone.lng);
    if (distance <= zone.radius) {
      return zone;
    }
  }

  return null;
};

/**
 * Get high precision options for geolocation
 */
export const getHighPrecisionOptions = (): PositionOptions => {
  return {
    enableHighAccuracy: true,
    timeout: 15000,
    maximumAge: 0
  };
};

/**
 * Create a smooth zoom animation effect for the map
 */
export const smoothZoomTo = (map: google.maps.Map, zoom: number, duration = 500): void => {
  if (!map) return;
  
  const startZoom = map.getZoom() || 0;
  const steps = 15;
  const stepDuration = duration / steps;
  let currentStep = 0;
  
  const intervalId = setInterval(() => {
    currentStep++;
    
    if (currentStep >= steps) {
      clearInterval(intervalId);
      map.setZoom(zoom);
      return;
    }
    
    const progress = currentStep / steps;
    const newZoom = startZoom + (zoom - startZoom) * easeInOutCubic(progress);
    map.setZoom(Math.floor(newZoom));
  }, stepDuration);
};

/**
 * Easing function for smooth animations
 */
const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

/**
 * Calculate the current time of day to select appropriate map style
 */
export const getTimeOfDay = (): 'day' | 'night' | 'twilight' => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 18) return 'day';
  if ((hour >= 5 && hour < 6) || (hour >= 18 && hour < 19)) return 'twilight';
  return 'night';
};

/**
 * Add visual effects to map when refreshing location
 */
export const addRefreshEffect = (map: google.maps.Map | null): void => {
  if (!map) return;
  
  const originalZoom = map.getZoom() || 15;
  
  // Quick zoom out and in effect
  const zoomEffect = async () => {
    if (map.getZoom() && map.getZoom()! > 14) {
      map.setZoom(map.getZoom()! - 1);
      await new Promise(resolve => setTimeout(resolve, 150));
      map.setZoom(originalZoom);
    }
  };
  
  zoomEffect();
};

/**
 * Request location permission explicitly and return status
 */
export const requestLocationPermission = async (): Promise<'granted' | 'denied' | 'prompt'> => {
  // Check if the browser supports the Permissions API
  if (navigator.permissions && navigator.permissions.query) {
    try {
      const permissionStatus = await navigator.permissions.query({ name: 'geolocation' });
      console.log(`Location permission status: ${permissionStatus.state}`);

      // Return the permission state
      return permissionStatus.state as 'granted' | 'denied' | 'prompt';
    } catch (error) {
      console.error('Error querying location permission:', error);
    }
  }
  
  // If Permissions API is not supported, fall back to manual checking
  if (navigator.geolocation) {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        () => resolve('granted'),
        (error) => {
          if (error.code === 1) { // PERMISSION_DENIED
            resolve('denied');
          } else {
            resolve('prompt');
          }
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    });
  }
  
  return 'denied'; // Geolocation API not available
};

/**
 * Check if browser supports geolocation
 */
export const isGeolocationSupported = (): boolean => {
  return 'geolocation' in navigator;
};
