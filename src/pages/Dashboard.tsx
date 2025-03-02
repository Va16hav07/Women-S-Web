import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer, useJsApiLoader, Autocomplete, InfoWindow } from '@react-google-maps/api';
import { AlertTriangle, Phone, Navigation, Home, Menu, X, Plus, Shield, Bell, Heart, Map, Settings, LogOut, Users, Compass, Crosshair, AlertOctagon, Sun, Moon, MapPin, Layers } from 'lucide-react';
import { createLocationSvg, getCurrentPosition, checkIfInDangerZone, createFallbackMarker, getHighPrecisionOptions, smoothZoomTo, getTimeOfDay, addRefreshEffect, createDangerMarker, createPulsingDot, createDestinationMarker, trackLiveLocation, centerMapOnCurrentLocation } from '../utils/LocationUtil';
import { Contact, DangerZone, Location, MapStyles } from '../types/types';
import { getMapStyle } from '../styles/mapStyles';

// Mock data
const mockContacts: Contact[] = [
  { id: '1', name: 'Mom', phone: '555-1234', relation: 'Family' },
  { id: '2', name: 'Dad', phone: '555-5678', relation: 'Family' },
  { id: '3', name: 'Emergency Services', phone: '911', relation: 'Emergency' },
];

const mockDangerZones: DangerZone[] = [
  { id: '1', name: 'Downtown Alley', radius: 300, lat: 40.7128, lng: -74.006, riskLevel: 'high' },
  { id: '2', name: 'Park Area', radius: 500, lat: 40.7228, lng: -74.016, riskLevel: 'medium' },
  { id: '3', name: 'South Station', radius: 200, lat: 40.7028, lng: -74.026, riskLevel: 'low' },
];

// Google Maps API Key - using the provided key
const googleMapsApiKey = "AIzaSyCTncgg-x65QicwCIqyGJYopp45dMBh74Y";

// Define libraries for the Google Maps API
import { Libraries } from '@react-google-maps/api';
const libraries: Libraries = ['places'];

// Custom map style
import { mapStyles } from '../styles/mapStyles';

// Component
const SafetyDashboard: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [currentLocation, setCurrentLocation] = useState<Location>({ lat: 40.7128, lng: -74.006 });
  const [destination, setDestination] = useState<Location | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<Contact[]>(mockContacts);
  const [dangerZones, setDangerZones] = useState<DangerZone[]>(mockDangerZones);
  const [showSideMenu, setShowSideMenu] = useState<boolean>(false);
  const [showContactForm, setShowContactForm] = useState<boolean>(false);
  const [newContact, setNewContact] = useState<Partial<Contact>>({ name: '', phone: '', relation: '' });
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [mapLoaded, setMapLoaded] = useState<boolean>(false);
  const [sosActive, setSosActive] = useState<boolean>(false);
  const [showZoneForm, setShowZoneForm] = useState<boolean>(false);
  const [newZone, setNewZone] = useState<Partial<DangerZone>>({ name: '', radius: 200, lat: 0, lng: 0, riskLevel: 'medium' });
  const [liveTracking, setLiveTracking] = useState<boolean>(true); // Start with tracking enabled
  const [locationWatchId, setLocationWatchId] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [intercityTravel, setIntercityTravel] = useState<boolean>(false);
  const [fromLocation, setFromLocation] = useState<Location | null>(null);
  const [toLocation, setToLocation] = useState<Location | null>(null);
  const fromAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const toAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [panicMode, setPanicMode] = useState<boolean>(false);
  const [panicCountdown, setPanicCountdown] = useState<number | null>(null);
  const panicTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Add missing trackingCleanup state
  const [trackingCleanup, setTrackingCleanup] = useState<(() => void) | null>(null);

  // Enhanced location tracking state
  const [locationInitialized, setLocationInitialized] = useState<boolean>(false);
  const [locationWatchActive, setLocationWatchActive] = useState<boolean>(false);
  const highPrecisionLocationOptions = getHighPrecisionOptions();

  // Enhanced map state 
  const [mapMode, setMapMode] = useState<'day' | 'night' | 'twilight'>(getTimeOfDay());
  const [mapZoomLevel, setMapZoomLevel] = useState<number>(16);
  const [showHeatmap, setShowHeatmap] = useState<boolean>(false);
  const [mapBoundsChanged, setMapBoundsChanged] = useState<boolean>(false);
  const [isLocationRefreshing, setIsLocationRefreshing] = useState<boolean>(false);
  const [mapTiltValue, setMapTiltValue] = useState<number>(0); // 0-45 degrees
  const [mapHeadingValue, setMapHeadingValue] = useState<number>(0); // 0-360 degrees
  const [showBuildings3D, setShowBuildings3D] = useState<boolean>(false);

  // New state for info windows
  const [selectedZone, setSelectedZone] = useState<DangerZone | null>(null);
  const [showEnhancedVisuals, setShowEnhancedVisuals] = useState<boolean>(false); // Changed default to false to hide circles

  // Use the useJsApiLoader hook to properly load the Google Maps API with places library
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey,
    libraries: libraries
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const locationMarkerRef = useRef<google.maps.Marker | null>(null);
  
  const mapContainerStyle: MapStyles = {
    height: '100%', // Keep this as is
    width: '100%'   // Keep this as is
  };
  
  const directionsCallback = (
    result: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    console.log("Directions service returned:", status);
    
    if (result !== null && status === 'OK') {
      console.log("Got directions:", result);
      setDirections(result);
    } else {
      console.error("Failed to get directions:", status);
      if (status === "ZERO_RESULTS") {
        alert("Could not find a route between these locations. Please try different locations.");
      }
    }
  };
  
  // Enhanced location marker with SVG and fallback
  const createLocationMarkerIcon = () => {
    try {
      // Try to create SVG marker
      const svgString = createLocationSvg(currentLocation.heading);
      
      return {
        url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svgString),
        scaledSize: new google.maps.Size(48, 48),
        anchor: new google.maps.Point(24, 24),
      };
    } catch (error) {
      console.error("Error creating SVG marker, using fallback", error);
      // Use fallback marker if SVG fails
      return createFallbackMarker();
    }
  };

  // Enhanced get current location function with better error handling
  const fetchAndUpdateLocation = useCallback(async (zoomIn: boolean = false, forceRefresh: boolean = false) => {
    try {
      setLocationError(null);
      setIsLocationRefreshing(true);
      console.log(`Attempting to get current position (forced: ${forceRefresh})...`);
      
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by your browser");
      }
      
      // Wrap getCurrentPosition in a promise with timeout handling
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        const timeoutId = setTimeout(() => {
          reject(new Error("Location request timed out. Please try again."));
        }, 10000); // 10 second timeout
        
        navigator.geolocation.getCurrentPosition(
          (position) => {
            clearTimeout(timeoutId);
            resolve(position);
          },
          (error) => {
            clearTimeout(timeoutId);
            reject(error);
          },
          {
            ...highPrecisionLocationOptions,
            maximumAge: forceRefresh ? 0 : highPrecisionLocationOptions.maximumAge,
          }
        );
      });
      
      const newLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        heading: position.coords.heading || undefined,
      };
      
      console.log(`Location retrieved:`, newLocation);
      
      // Update location state
      setCurrentLocation(newLocation);
      setLocationInitialized(true);
      
      // If map is loaded, pan to the new location with enhanced animation
      if (mapRef.current) {
        // Use smooth animation to center map
        mapRef.current.panTo(newLocation);
        
        if (zoomIn) {
          // Apply smooth zoom effect to zoom level 19 (closer than before)
          smoothZoomTo(mapRef.current, 19);
          setMapZoomLevel(19);
          
          // Apply visual refresh effect
          addRefreshEffect(mapRef.current);
        }
      }
      
      // Check if in danger zone
      const dangerZone = checkIfInDangerZone(newLocation.lat, newLocation.lng, dangerZones);
      if (dangerZone) {
        console.log(`Currently in danger zone: ${dangerZone.name}`);
        if (!locationWatchActive) {
          // Only alert if this is a manual location check, not during constant tracking
          alert(`Warning: You are entering a ${dangerZone.riskLevel} risk area: ${dangerZone.name}`);
        }
      }

      // Add slight delay before turning off the refreshing state for better UX
      setTimeout(() => {
        setIsLocationRefreshing(false);
      }, 800);

      // Update to use pointer style markers instead of circles
      setSelectedZone(null); // Close any open info windows when refreshing location

      return newLocation;
    } catch (error: any) {
      console.error("Error getting location:", error);
      
      // Provide specific error messages based on the error code
      let errorMessage = "Unable to access your location.";
      if (error instanceof GeolocationPositionError) {
        switch(error.code) {
          case 1: // PERMISSION_DENIED
            errorMessage = "Location permission denied. Please enable location services in your browser/device settings and reload the page.";
            break;
          case 2: // POSITION_UNAVAILABLE
            errorMessage = "Location information is unavailable. Please check your device's GPS or try again later.";
            break;
          case 3: // TIMEOUT
            errorMessage = "Location request timed out. Please check your connection and try again.";
            break;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setLocationError(errorMessage);
      setIsLocationRefreshing(false);
      
      // Use fallback location if we can't get the real one
      if (!locationInitialized) {
        console.log("Using fallback location since we couldn't get the real one");
        // Keep using the default location that was set in state initially
      }
      
      return null;
    }
  }, [dangerZones, locationWatchActive]);

  // Get current location on mount using our improved function
  useEffect(() => {
    if (isLoaded && !locationInitialized) {
      fetchAndUpdateLocation(true, true); // Force a fresh location check on first load
    }
  }, [isLoaded, locationInitialized, fetchAndUpdateLocation]);
  
  // Enhanced live location tracking with better error handling
  useEffect(() => {
    if (!isLoaded) return; // Wait for maps to load
    
    if (liveTracking && navigator.geolocation) {
      // Clear any existing watchers
      if (locationWatchId !== null) {
        navigator.geolocation.clearWatch(locationWatchId);
      }
      
      console.log('Starting live location tracking with high precision options...');
      setLocationWatchActive(true);
      
      // Start watching position with high accuracy options
      const watchId = navigator.geolocation.watchPosition(
        position => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            heading: position.coords.heading || undefined,
          };
          
          console.log(`Live tracking updated location:`, newLocation);
          
          // Update location
          setCurrentLocation(newLocation);
          setLocationInitialized(true);
          setLocationError(null);
          
          // If map is loaded, pan to new location
          if (mapRef.current) {
            mapRef.current.panTo(newLocation);
          }
          
          // Check if in danger zone
          const dangerZone = checkIfInDangerZone(newLocation.lat, newLocation.lng, dangerZones);
          if (dangerZone) {
            console.log(`Currently in danger zone: ${dangerZone.name}`);
          }
        },
        error => {
          console.error("Error tracking location:", error);
          let errorMessage = "Unable to track your location.";
          
          // Provide more specific error messages based on the error code
          switch(error.code) {
            case 1: // PERMISSION_DENIED
              errorMessage = "Location access denied. Please check your browser/device settings to enable location services for this app.";
              break;
            case 2: // POSITION_UNAVAILABLE
              errorMessage = "Location information unavailable. Please check your device's GPS or try again in a different area.";
              break;
            case 3: // TIMEOUT
              errorMessage = "Location request timed out. Please check your internet connection and try again.";
              break;
          }
          
          setLocationError(errorMessage);
          setLocationWatchActive(false);
        },
        highPrecisionLocationOptions
      );
      
      setLocationWatchId(watchId);
      
      // Clean up on unmount or when tracking is stopped
      return () => {
        if (watchId !== null) {
          console.log('Clearing location tracking...');
          navigator.geolocation.clearWatch(watchId);
          setLocationWatchActive(false);
        }
      };
    } else if (!liveTracking && locationWatchId !== null) {
      console.log('Stopping location tracking...');
      navigator.geolocation.clearWatch(locationWatchId);
      setLocationWatchId(null);
      setLocationWatchActive(false);
    }
  }, [liveTracking, dangerZones, isLoaded]);
  
  // Toggle live tracking with immediate location update
  const toggleLiveTracking = useCallback(() => {
    const newTrackingState = !liveTracking;
    setLiveTracking(newTrackingState);
    
    if (newTrackingState) {
      // If turning tracking on, immediately get current location
      fetchAndUpdateLocation(true, true);
    }
  }, [liveTracking, fetchAndUpdateLocation]);
  
  // Toggle 3D buildings mode
  const toggle3DBuildings = useCallback(() => {
    setShowBuildings3D(prev => !prev);
    if (mapRef.current) {
      setTimeout(() => {
        // Apply tilt when enabling 3D buildings
        if (!showBuildings3D) {
          setMapTiltValue(45);
        } else {
          setMapTiltValue(0);
        }
      }, 100);
    }
  }, [showBuildings3D]);

  // Change map visualization mode (day/night/twilight)
  const cycleMapMode = useCallback(() => {
    setMapMode(prevMode => {
      switch (prevMode) {
        case 'day': return 'night';
        case 'night': return 'twilight';
        case 'twilight': return 'day';
        default: return 'day';
      }
    });
  }, []);

  // Enhanced map load handler with initial location check and live tracking setup
  const handleMapLoad = useCallback((map: google.maps.Map) => {
    console.log('Map loaded successfully');
    mapRef.current = map;
    setMapLoaded(true);
    
    // If we already have the location, center the map
    if (currentLocation) {
      map.panTo(currentLocation);
    } else {
      // Try to get location immediately if not already available
      fetchAndUpdateLocation(true, true);
    }
    
    // Initialize live location tracking
    if (liveTracking) {
      const cleanup = trackLiveLocation(
        map,
        (location) => {
          console.log("Live location update:", location);
          setCurrentLocation(location);
          setLocationInitialized(true);
          setLocationError(null);
          
          // Check if in danger zone
          const dangerZone = checkIfInDangerZone(location.lat, location.lng, dangerZones);
          if (dangerZone) {
            console.log(`Currently in danger zone: ${dangerZone.name}`);
          }
        },
        (error) => {
          console.error("Error tracking location:", error);
          let errorMessage = "Unable to track your location.";
          
          switch(error.code) {
            case 1: // PERMISSION_DENIED
              errorMessage = "Location access denied. Please check your browser/device settings to enable location services for this app.";
              break;
            case 2: // POSITION_UNAVAILABLE
              errorMessage = "Location information unavailable. Please check your device's GPS or try again in a different area.";
              break;
            case 3: // TIMEOUT
              errorMessage = "Location request timed out. Please check your internet connection and try again.";
              break;
          }
          
          setLocationError(errorMessage);
          setLocationWatchActive(false);
        }
      );
      
      // Save cleanup function
      setTrackingCleanup(() => cleanup);
      setLocationWatchActive(true);
    }
    
    // Add advanced event listeners for enhanced map experience
    map.addListener('idle', () => {
      console.log('Map idle, center:', map.getCenter()?.toJSON());
      setMapBoundsChanged(true);
      // Auto-update zoom level state when user zooms
      const newZoom = map.getZoom();
      if (newZoom !== undefined && newZoom !== mapZoomLevel) {
        setMapZoomLevel(newZoom);
      }
    });

    // Add fancy tilt listener
    map.addListener('tilt_changed', () => {
      setMapTiltValue(map.getTilt() || 0);
    });
  }, [currentLocation, fetchAndUpdateLocation, mapZoomLevel, liveTracking, dangerZones]);
  
  // Manage live tracking with our new function
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;
    
    // Clean up any existing tracking
    if (trackingCleanup) {
      trackingCleanup();
      setTrackingCleanup(null);
      setLocationWatchActive(false);
    }
    
    // Start new tracking if enabled
    if (liveTracking) {
      console.log('Starting new live location tracking...');
      const cleanup = trackLiveLocation(
        mapRef.current,
        (location) => {
          console.log("Live location update:", location);
          setCurrentLocation(location);
          setLocationInitialized(true);
          setLocationError(null);
          
          // Check if in danger zone
          const dangerZone = checkIfInDangerZone(location.lat, location.lng, dangerZones);
          if (dangerZone) {
            console.log(`Currently in danger zone: ${dangerZone.name}`);
          }
        },
        (error) => {
          console.error("Error tracking location:", error);
          let errorMessage = "Unable to track your location.";
          
          switch(error.code) {
            case 1: // PERMISSION_DENIED
              errorMessage = "Location access denied. Please check your browser/device settings to enable location services for this app.";
              break;
            case 2: // POSITION_UNAVAILABLE
              errorMessage = "Location information unavailable. Please check your device's GPS or try again in a different area.";
              break;
            case 3: // TIMEOUT
              errorMessage = "Location request timed out. Please check your internet connection and try again.";
              break;
          }
          
          setLocationError(errorMessage);
          setLocationWatchActive(false);
        }
      );
      
      setTrackingCleanup(() => cleanup);
      setLocationWatchActive(true);
    }
    
    return () => {
      // Clean up tracking when component unmounts or when effect re-runs
      if (trackingCleanup) {
        trackingCleanup();
      }
    };
  }, [liveTracking, isLoaded, dangerZones]);

  // Handle live location button click - now using centerMapOnCurrentLocation
  const handleRefreshLocation = useCallback(() => {
    console.log('Forcing location refresh with visual effects...');
    
    if (mapRef.current) {
      // Use our new function
      centerMapOnCurrentLocation(mapRef.current, true)
        .then(location => {
          setCurrentLocation(location);
          setLocationInitialized(true);
          
          // Add zoom effect
          if (mapRef.current) {
            smoothZoomTo(mapRef.current, 19);
            setMapZoomLevel(19);
            addRefreshEffect(mapRef.current);
          }
        })
        .catch(error => {
          console.error("Error refreshing location:", error);
          fetchAndUpdateLocation(true, true); // Fallback to the old method
        });
    } else {
      fetchAndUpdateLocation(true, true);
    }
  }, [fetchAndUpdateLocation]);

  // Apply map style based on selected mode
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setOptions({
        styles: getMapStyle(mapMode),
        tilt: mapTiltValue
      });
    }
  }, [mapMode, mapTiltValue]);

  // Auto-update map mode based on time of day
  useEffect(() => {
    const checkTimeAndUpdateMode = () => {
      const currentTimeOfDay = getTimeOfDay();
      setMapMode(currentTimeOfDay);
    };
    
    // Check initially
    checkTimeAndUpdateMode();
    
    // Set up interval to check every hour
    const intervalId = setInterval(checkTimeAndUpdateMode, 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Mock function to trigger SOS
  const triggerSOS = () => {
    setSosActive(true);
    alert('SOS alert triggered! Sending your location to emergency contacts.');
    // In a real app, this would send SMS/notifications to contacts
  };
  
  // Set destination for navigation
  const handleSetDestination = () => {
    // In a real app, this would use a location search API
    // For now, setting a mock destination
    setDestination({ lat: 40.7328, lng: -74.016 });
  };
  
  // Add new emergency contact
  const addNewContact = () => {
    if (newContact.name && newContact.phone) {
      const contact: Contact = {
        id: Date.now().toString(),
        name: newContact.name || '',
        phone: newContact.phone || '',
        relation: newContact.relation || 'Other'
      };
      setEmergencyContacts([...emergencyContacts, contact]);
      setNewContact({ name: '', phone: '', relation: '' });
      setShowContactForm(false);
    }
  };
  
  // Add new danger zone
  const addNewDangerZone = () => {
    if (newZone.name && newZone.lat && newZone.lng) {
      const zone: DangerZone = {
        id: Date.now().toString(),
        name: newZone.name || '',
        radius: newZone.radius || 200,
        lat: newZone.lat || 0,
        lng: newZone.lng || 0,
        riskLevel: (newZone.riskLevel as 'high' | 'medium' | 'low') || 'medium'
      };
      setDangerZones([...dangerZones, zone]);
      setNewZone({ name: '', radius: 200, lat: 0, lng: 0, riskLevel: 'medium' });
      setShowZoneForm(false);
    }
  };
  
  // Remove contact
  const removeContact = (id: string) => {
    setEmergencyContacts(emergencyContacts.filter(contact => contact.id !== id));
  };
  
  // Remove danger zone
  const removeDangerZone = (id: string) => {
    setDangerZones(dangerZones.filter(zone => zone.id !== id));
  };
  
  // Get color for danger zones based on risk level
  const getDangerZoneColor = (riskLevel: string): string => {
    switch (riskLevel) {
      case 'high': return '#FF3B30'; // More vibrant red
      case 'medium': return '#FF9500'; // More vibrant orange
      case 'low': return '#FFCC00'; // More vibrant yellow
      default: return '#FF9500';
    }
  };

  // Enhanced handleIntercityTravel function
  const handleIntercityTravel = () => {
    if (fromLocation && toLocation) {
      console.log("Starting intercity travel from", fromLocation, "to", toLocation);
      
      // Set the destination first
      setDestination(toLocation);
      
      // Set the current location to the starting point
      setCurrentLocation(fromLocation);
      
      // Explicitly request directions
      if (mapRef.current) {
        // Center the map somewhere between the start and end points
        mapRef.current.panTo({
          lat: (fromLocation.lat + toLocation.lat) / 2,
          lng: (fromLocation.lng + toLocation.lng) / 2
        });
        
        // Adjust zoom to fit both points
        if (mapRef.current.fitBounds && window.google) {
          const bounds = new window.google.maps.LatLngBounds();
          bounds.extend(new window.google.maps.LatLng(fromLocation.lat, fromLocation.lng));
          bounds.extend(new window.google.maps.LatLng(toLocation.lat, toLocation.lng));
          mapRef.current.fitBounds(bounds);
        }
      }
      
      // Clear any existing directions and set new ones
      setDirections(null);
      
      // Close the intercity travel form
      setIntercityTravel(false);
      
      // Show a notification to confirm the route is being calculated
      alert(`Planning your journey from ${fromLocation.lat.toFixed(4)}, ${fromLocation.lng.toFixed(4)} to ${toLocation.lat.toFixed(4)}, ${toLocation.lng.toFixed(4)}`);
    } else {
      // Show an error message if locations aren't selected
      alert("Please select both starting point and destination.");
    }
  };

  // Create or update location marker when the map is loaded or location changes
  useEffect(() => {
    if (mapLoaded && mapRef.current && isLoaded) {
      console.log('Updating location marker position');
      
      // Update existing marker if it exists, otherwise create a new one
      if (locationMarkerRef.current) {
        locationMarkerRef.current.setPosition(currentLocation);
        locationMarkerRef.current.setIcon(createLocationMarkerIcon());
      } 
      // Note: The marker is created in the GoogleMap component, so we don't need to create it here
    }
  }, [mapLoaded, currentLocation, isLoaded]);

  // Activate panic mode
  const activatePanicMode = () => {
    if (panicMode) return; // Already in panic mode
    
    setPanicMode(true);
    setPanicCountdown(10); // 10 second countdown before notifying contacts
    
    // Start high frequency location tracking
    setLiveTracking(true);
    
    // Zoom the map to current location
    fetchAndUpdateLocation(true);
    
    // Start countdown
    panicTimeoutRef.current = setInterval(() => {
      setPanicCountdown(prev => {
        const newCount = prev !== null ? prev - 1 : 0;
        
        // When countdown reaches zero, send alerts
        if (newCount <= 0) {
          // Clear interval
          if (panicTimeoutRef.current) {
            clearInterval(panicTimeoutRef.current);
            panicTimeoutRef.current = null;
          }
          
          // Send alerts to emergency contacts
          sendPanicAlerts();
          return null;
        }
        
        return newCount;
      });
    }, 1000);
    
    // Display immediate visual feedback
    if (mapRef.current) {
      // Add pulsing effect by temporarily changing map style
      const originalStyle = mapRef.current.get('styles');
      mapRef.current.set('styles', [
        ...mapStyles,
        {
          "featureType": "all",
          "elementType": "geometry",
          "stylers": [{"saturation": -30}]
        }
      ]);
      
      // Restore original style after 1 second
      setTimeout(() => {
        if (mapRef.current) {
          mapRef.current.set('styles', originalStyle || mapStyles);
        }
      }, 1000);
    }
  };
  
  // Cancel panic mode
  const cancelPanicMode = () => {
    setPanicMode(false);
    setPanicCountdown(null);
    
    // Clear countdown interval
    if (panicTimeoutRef.current) {
      clearInterval(panicTimeoutRef.current);
      panicTimeoutRef.current = null;
    }
  };
  
  // Send alerts to emergency contacts
  const sendPanicAlerts = () => {
    // In a real app, this would send SMS/push notifications with current location
    console.log("ALERT: Sending panic alerts to emergency contacts");
    alert(`EMERGENCY ALERT SENT to ${emergencyContacts.length} contacts with your current location.`);
    
    // This would be implemented with a backend API call in a real app
    emergencyContacts.forEach(contact => {
      console.log(`Sending alert to ${contact.name} at ${contact.phone}`);
      // API call would happen here
    });
  };
  
  // Clean up panic mode on component unmount
  useEffect(() => {
    return () => {
      if (panicTimeoutRef.current) {
        clearInterval(panicTimeoutRef.current);
      }
    };
  }, []);
  
  function handleFromPlaceChanged(): void {
    if (fromAutocompleteRef.current) {
      const place = fromAutocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        setFromLocation({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
      }
    }
  }

  function handleToPlaceChanged(): void {
    if (toAutocompleteRef.current) {
      const place = toAutocompleteRef.current.getPlace();
      if (place.geometry && place.geometry.location) {
        setToLocation({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng()
        });
      }
    }
  }

  // Enhanced marker click handler for showing info windows
  const handleMarkerClick = useCallback((zone: DangerZone) => {
    setSelectedZone(zone);
  }, []);

  // Add a helper function to guide users through location permission troubleshooting
  const showLocationTroubleshootingGuide = useCallback(() => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    const isFirefox = /Firefox/.test(navigator.userAgent);
    const isChrome = /Chrome/.test(navigator.userAgent) && !/Edge/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    let instructions = "To enable location services:";
    
    if (isIOS) {
      instructions += "\n\n• Go to Settings > Privacy > Location Services\n• Enable Location Services\n• Find this app/browser in the list and select 'While Using the App'";
    } else if (isAndroid) {
      instructions += "\n\n• Go to Settings > Location\n• Turn on 'Use location'\n• Open browser settings and enable site permissions for location";
    } else {
      if (isChrome) {
        instructions += "\n\n• Click the lock/info icon in the address bar\n• Check that Location permission is set to 'Allow'\n• If not, change the setting and refresh the page";
      } else if (isFirefox) {
        instructions += "\n\n• Click the info icon in the address bar\n• Go to Permissions > Access Your Location > Allow\n• Refresh the page";
      } else if (isSafari) {
        instructions += "\n\n• Go to Safari > Preferences > Websites > Location\n• Find this website and select 'Allow'\n• Refresh the page";
      } else {
        instructions += "\n\n• Check your browser settings to allow location access\n• Look for site permissions or privacy settings\n• Refresh the page after enabling location";
      }
    }
    
    alert(instructions);
  }, []);

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Side Menu */}
      <div className={`fixed z-20 h-full w-72 bg-gradient-to-b from-purple-900 to-indigo-800 shadow-xl transform transition-transform ease-in-out duration-300 ${showSideMenu ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-purple-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Shield size={24} className="text-purple-300 mr-2" />
              <h2 className="text-xl font-bold text-white">SafeGuard</h2>
            </div>
            <button onClick={() => setShowSideMenu(false)} className="p-2 rounded-full text-purple-300 hover:bg-purple-800 hover:text-white transition-all">
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-6 flex flex-col items-center p-4">
            <div className="w-20 h-20 bg-purple-700 rounded-full flex items-center justify-center mb-2">
              <Users size={32} className="text-white" />
            </div>
            <h3 className="text-white font-medium">User Profile</h3>
            <p className="text-purple-300 text-sm">Safety is our priority</p>
          </div>
          
          <ul className="space-y-1">
            <li className={`p-3 rounded-lg cursor-pointer ${currentTab === 'dashboard' ? 'bg-purple-700 text-white' : 'text-purple-300 hover:bg-purple-800 hover:text-white'} transition-all`}
              onClick={() => { setCurrentTab('dashboard'); setShowSideMenu(false); }}>
              <div className="flex items-center">
                <Home size={18} className="mr-3" />
                <span>Dashboard</span>
              </div>
            </li>
            <li className={`p-3 rounded-lg cursor-pointer ${currentTab === 'contacts' ? 'bg-purple-700 text-white' : 'text-purple-300 hover:bg-purple-800 hover:text-white'} transition-all`}
              onClick={() => { setCurrentTab('contacts'); setShowSideMenu(false); }}>
              <div className="flex items-center">
                <Phone size={18} className="mr-3" />
                <span>Emergency Contacts</span>
              </div>
            </li>
            <li className={`p-3 rounded-lg cursor-pointer ${currentTab === 'danger-zones' ? 'bg-purple-700 text-white' : 'text-purple-300 hover:bg-purple-800 hover:text-white'} transition-all`}
              onClick={() => { setCurrentTab('danger-zones'); setShowSideMenu(false); }}>
              <div className="flex items-center">
                <AlertTriangle size={18} className="mr-3" />
                <span>Danger Zones</span>
              </div>
            </li>
            <li className="p-3 rounded-lg cursor-pointer text-purple-300 hover:bg-purple-800 hover:text-white transition-all">
              <div className="flex items-center">
                <Map size={18} className="mr-3" />
                <span>Safe Routes</span>
              </div>
            </li>
            <li className="p-3 rounded-lg cursor-pointer text-purple-300 hover:bg-purple-800 hover:text-white transition-all">
              <div className="flex items-center">
                <Settings size={18} className="mr-3" />
                <span>Settings</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-md p-4 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button onClick={() => setShowSideMenu(true)} className="p-2 rounded-full hover:bg-purple-100 hover:text-purple-700 transition-all mr-2">
                <Menu size={20} />
              </button>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">Women Safety Dashboard</h1>
                <p className="text-xs text-gray-500">Stay safe, stay connected</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-purple-100 hover:text-purple-700 transition-all relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500"></span>
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-medium cursor-pointer">
                JS
              </div>
            </div>
          </div>
        </header>
        
        {/* Content based on current tab */}
        <main className="flex-1 overflow-y-auto p-6">
          {currentTab === 'dashboard' && (
            <div className="h-full flex flex-col space-y-6">
              {/* Welcome Message - Make it smaller to give more room to map */}
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-lg p-4 text-white animate-fadeIn">
                <h2 className="text-xl font-bold mb-1">Welcome Back!</h2>
                <p className="opacity-90 text-sm">Your safety is our priority. Use the SOS button in case of emergency.</p>
                <div className="flex mt-3">
                  <button 
                    onClick={triggerSOS}
                    className={`px-4 py-1.5 rounded-lg ${sosActive ? 'bg-red-700 animate-pulse' : 'bg-white text-red-600'} font-bold transition-all mr-3 flex items-center shadow-md text-sm`}
                  >
                    <Shield size={16} className="mr-1.5" />
                    SOS Emergency
                  </button>
                  <button 
                    onClick={activatePanicMode}
                    className={`px-4 py-1.5 rounded-lg ${panicMode ? 'bg-red-700 animate-pulse' : 'bg-white text-orange-600'} font-bold transition-all mr-3 flex items-center shadow-md text-sm`}
                  >
                    <AlertOctagon size={16} className="mr-1.5" />
                    Panic Mode {panicCountdown !== null && `(${panicCountdown})`}
                  </button>
                  <button className="px-4 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 transition-all flex items-center shadow-md text-sm">
                    <Phone size={16} className="mr-1.5" />
                    Quick Call
                  </button>
                </div>
              </div>
              
              {/* Intercity Travel Section */}
              <div className="bg-white rounded-2xl shadow-lg p-4 text-gray-800 animate-fadeIn">
                <h2 className="text-xl font-bold mb-1">Intercity Travel</h2>
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    {isLoaded ? (
                      <Autocomplete
                        onLoad={autocomplete => (fromAutocompleteRef.current = autocomplete)}
                        onPlaceChanged={handleFromPlaceChanged}
                      >
                        <input 
                          type="text" 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                          placeholder="Enter starting location"
                        />
                      </Autocomplete>
                    ) : (
                      <input 
                        type="text" 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                        placeholder="Loading..."
                        disabled
                      />
                    )}
                    {fromLocation && (
                      <p className="text-xs text-green-600 mt-1">
                        Location set: {fromLocation.lat.toFixed(4)}, {fromLocation.lng.toFixed(4)}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    {isLoaded ? (
                      <Autocomplete
                        onLoad={autocomplete => (toAutocompleteRef.current = autocomplete)}
                        onPlaceChanged={handleToPlaceChanged}
                      >
                        <input 
                          type="text" 
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                          placeholder="Enter destination"
                        />
                      </Autocomplete>
                    ) : (
                      <input 
                        type="text" 
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none transition-all"
                        placeholder="Loading..."
                        disabled
                      />
                    )}
                    {toLocation && (
                      <p className="text-xs text-green-600 mt-1">
                        Location set: {toLocation.lat.toFixed(4)}, {toLocation.lng.toFixed(4)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex space-x-3 pt-2 mt-4">
                  <button 
                    onClick={handleIntercityTravel}
                    className={`flex-1 ${fromLocation && toLocation 
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700' 
                      : 'bg-gray-400 cursor-not-allowed'} text-white px-4 py-3 rounded-lg transition-all shadow-md font-medium flex items-center justify-center`}
                    disabled={!isLoaded || !fromLocation || !toLocation}
                  >
                    <Navigation size={18} className="mr-2" />
                    Start Travel
                  </button>
                  <button 
                    onClick={() => {
                      setIntercityTravel(false);
                      setFromLocation(null);
                      setToLocation(null);
                    }}
                    className="flex-1 bg-gray-200 px-4 py-3 rounded-lg hover:bg-gray-300 transition-all font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Enhanced Map Container with pointer markers only (no circles) */}
              <div className="flex-grow bg-white rounded-2xl shadow-lg overflow-hidden relative" style={{ minHeight: "70vh" }}>
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={currentLocation}
                    zoom={mapZoomLevel}
                    onLoad={handleMapLoad}
                    options={{
                      styles: getMapStyle(mapMode),
                      streetViewControl: false, // Disabled for cleaner UI
                      mapTypeControl: false,
                      fullscreenControl: false, // Disabled for cleaner UI
                      zoomControl: false, // We'll use custom controls
                      rotateControl: false, // Disabled for cleaner UI
                      tilt: mapTiltValue,
                      heading: mapHeadingValue,
                      mapTypeId: showBuildings3D ? 'satellite' : 'roadmap',
                      mapId: "8e0a97af9386fef",
                      disableDefaultUI: false,
                      clickableIcons: true,
                      gestureHandling: "greedy",
                    }}
                    onClick={() => setSelectedZone(null)} // Close info window when clicking map
                  >
                    {/* Current Location Marker - Enhanced visibility */}
                    {/* Remove the standalone current location marker, as it's now handled by trackLiveLocation */}
                    {/* We don't need this anymore since trackLiveLocation creates the marker:
                    <Marker
                      position={currentLocation}
                      icon={createLocationMarkerIcon()}
                      onLoad={marker => {
                        locationMarkerRef.current = marker;
                        console.log("Marker loaded:", marker);
                      }}
                      zIndex={1000}
                      animation={window.google?.maps?.Animation?.DROP}
                    /> 
                    */}
                    
                    {/* Removed all circle elements */}
                    
                    {/* Destination Marker */}
                    {destination && (
                      <Marker
                        position={destination}
                        icon={createDestinationMarker()}
                        animation={google.maps.Animation.DROP}
                      />
                    )}
                    
                    {/* Danger Zones - Now using only pointer markers, no circles */}
                    {dangerZones.map(zone => (
                      <React.Fragment key={zone.id}>
                        {/* Primary Marker */}
                        <Marker
                          position={{ lat: zone.lat, lng: zone.lng }}
                          icon={createDangerMarker(zone.riskLevel)}
                          onClick={() => handleMarkerClick(zone)}
                          title={zone.name}
                        />
                        
                        {/* Info Window showing when marker is clicked */}
                        {selectedZone?.id === zone.id && (
                          <InfoWindow
                            position={{ lat: zone.lat, lng: zone.lng }}
                            onCloseClick={() => setSelectedZone(null)}
                          >
                            <div className="p-1">
                              <h3 className="font-bold text-sm">{zone.name}</h3>
                              <p className="text-xs text-gray-600 capitalize">{zone.riskLevel} Risk Area</p>
                              <p className="text-xs text-gray-600">Radius: {zone.radius}m</p>
                            </div>
                          </InfoWindow>
                        )}
                      </React.Fragment>
                    ))}
                    
                    {/* Directions */}
                    {destination && currentLocation && mapLoaded && (
                      <DirectionsService
                        options={{
                          destination: destination,
                          origin: currentLocation,
                          travelMode: google.maps.TravelMode.DRIVING // Changed to DRIVING for intercity travel
                        }}
                        callback={directionsCallback}
                      />
                    )}
                    
                    {directions && (
                      <DirectionsRenderer
                        options={{
                          directions: directions,
                          markerOptions: { 
                            visible: false, // Hide default markers and use our custom ones
                          },
                          polylineOptions: {
                            strokeColor: '#6D28D9',
                            strokeWeight: 5,
                            strokeOpacity: 0.7
                          }
                        }}
                      />
                    )}
                  </GoogleMap>
                ) : loadError ? (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-red-500 mb-4">
                        <AlertTriangle size={48} className="mx-auto" />
                      </div>
                      <p className="text-red-600 font-medium">Failed to load Google Maps</p>
                      <p className="text-gray-600 mt-2">{loadError.message}</p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        Retry
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-full w-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading Google Maps...</p>
                    </div>
                  </div>
                )}
                
                {/* Location error indicator with retry button */}
                {locationError && (
                  <div className="absolute top-4 right-4 left-4 md:left-auto bg-red-500 text-white px-6 py-4 rounded-lg flex items-start shadow-lg max-w-md">
                    <AlertTriangle size={20} className="mr-3 flex-shrink-0 mt-1" />
                    <div className="flex-grow">
                      <p className="font-medium mb-2">{locationError}</p>
                      <div className="flex space-x-2 mt-2">
                        <button 
                          onClick={showLocationTroubleshootingGuide}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md text-sm transition-all"
                        >
                          Show Help
                        </button>
                        <button 
                          onClick={() => window.location.reload()}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 rounded-md text-sm transition-all"
                        >
                          Refresh Page
                        </button>
                        <button 
                          onClick={handleRefreshLocation}
                          className="px-3 py-1.5 bg-white text-red-600 hover:bg-red-100 rounded-md text-sm transition-all flex items-center"
                        >
                          <Crosshair size={14} className="mr-1.5" />
                          Try Again
                        </button>
                      </div>
                    </div>
                    <button 
                      onClick={() => setLocationError(null)}
                      className="p-1 ml-2 flex-shrink-0 hover:text-red-200 transition-all"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
                
                {/* Enhanced location tracking indicator - Moved to top-center for better visibility */}
                {locationWatchActive && liveTracking && (
                  <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center animate-pulse shadow-md z-10">
                    <Compass size={16} className="mr-2" />
                    <div>
                      <span className="text-sm font-medium">Live Location Active</span>
                    </div>
                  </div>
                )}
                
                {/* Improved Control Overlay - Positioned in floating card at bottom-center for better reachability */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 rounded-full shadow-lg flex items-center px-2 py-1 space-x-1">
                  {/* Live Location Button */}
                  <button 
                    onClick={handleRefreshLocation}
                    className="p-3 rounded-full hover:bg-blue-500 hover:text-white transition-all relative"
                    title="Center on my live location"
                  >
                    <Crosshair size={20} />
                    {isLocationRefreshing && (
                      <span className="absolute inset-0 rounded-full border-2 border-blue-500 animate-ping opacity-75"></span>
                    )}
                  </button>
                  
                  {/* Toggle Live Tracking Button */}
                  <button 
                    onClick={toggleLiveTracking}
                    className={`p-3 rounded-full transition-all ${liveTracking ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
                    title={liveTracking ? "Disable live tracking" : "Enable live tracking"}
                  >
                    <Compass size={20} />
                  </button>
                  
                  {/* Map Mode Toggle Button */}
                  <button 
                    onClick={cycleMapMode}
                    className="p-3 rounded-full hover:bg-indigo-500 hover:text-white transition-all"
                    title={`Current: ${mapMode} mode - Click to change`}
                  >
                    {mapMode === 'day' ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                  
                  {/* Toggle 3D Buildings */}
                  <button 
                    onClick={toggle3DBuildings}
                    className={`p-3 rounded-full transition-all ${showBuildings3D ? 'bg-indigo-500 text-white' : 'hover:bg-gray-100'}`}
                    title={showBuildings3D ? "Switch to 2D view" : "Switch to 3D view"}
                  >
                    <Layers size={20} />
                  </button>
                </div>
                
                {/* Zoom controls - Positioned at right for standard map UI experience */}
                <div className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-90 rounded-lg shadow-lg flex flex-col p-1">
                  <button 
                    onClick={() => {
                      if (mapRef.current) {
                        const currentZoom = mapRef.current.getZoom() || 16;
                        mapRef.current.setZoom(currentZoom + 1);
                        setMapZoomLevel(currentZoom + 1);
                      }
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                    title="Zoom in"
                  >
                    <Plus size={18} />
                  </button>
                  <div className="border-t border-gray-200 my-1"></div>
                  <button 
                    onClick={() => {
                      if (mapRef.current) {
                        const currentZoom = mapRef.current.getZoom() || 16;
                        mapRef.current.setZoom(currentZoom - 1);
                        setMapZoomLevel(currentZoom - 1);
                      }
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                    title="Zoom out"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                {/* Quick action button - Bottom right for panic mode */}
                <div className="absolute bottom-24 right-4">
                  <button 
                    onClick={panicMode ? cancelPanicMode : activatePanicMode}
                    className={`p-4 rounded-full shadow-lg transition-all ${panicMode ? 'bg-red-500 text-white animate-pulse' : 'bg-red-500 text-white hover:bg-red-600'}`}
                    title={panicMode ? "Cancel panic mode" : "Activate panic mode"}
                  >
                    <AlertOctagon size={24} />
                  </button>
                </div>
                
                {/* Panic Mode Overlay */}
                {panicMode && (
                  <div className="absolute top-0 left-0 w-full h-full bg-red-500 bg-opacity-20 flex items-center justify-center z-10">
                    <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full">
                      <div className="flex items-center justify-center mb-4">
                        <AlertOctagon size={48} className="text-red-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-center mb-2">Panic Mode Activated</h3>
                      
                      {panicCountdown !== null ? (
                        <>
                          <p className="text-center mb-4">
                            Alerting your emergency contacts in <span className="text-red-500 font-bold">{panicCountdown}</span> seconds
                          </p>
                          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                            <div 
                              className="bg-red-500 h-2.5 rounded-full" 
                              style={{ width: `${((10 - panicCountdown) / 10) * 100}%` }}
                            ></div>
                          </div>
                        </>
                      ) : (
                        <p className="text-center mb-4 text-red-500 font-medium">
                          Emergency contacts have been notified with your location
                        </p>
                      )}
                      
                      <div className="flex space-x-4">
                        <button
                          onClick={cancelPanicMode}
                          className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-all"
                        >
                          Cancel
                        </button>
                        {panicCountdown === null && (
                          <button
                            onClick={sendPanicAlerts}
                            className="flex-1 py-3 px-4 bg-red-500 text-white hover:bg-red-600 rounded-lg font-medium transition-all flex items-center justify-center"
                          >
                            <Phone size={18} className="mr-2" />
                            Send Again
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Debug information overlay - Made more compact and positioned at bottom-left */}
                <div className="absolute bottom-4 left-4 bg-white bg-opacity-80 text-xs p-2 rounded shadow">
                  <p className="flex items-center">
                    <span className="w-3 h-3 rounded-full bg-blue-500 inline-block mr-1"></span>
                    {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
                  </p>
                </div>
              </div>
              
              {/* Quick Access - Make it smaller or optionally collapse/hide on smaller screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {/* Emergency contacts and danger zones sections removed */}
              </div>
            </div>
          )}
          
          {currentTab === 'contacts' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Emergency Contacts</h2>
                  <p className="text-gray-500">Manage your trusted contacts for emergencies</p>
                </div>
                <button 
                  onClick={() => setShowContactForm(true)}
                  className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md"
                >
                  <Plus size={20} />
                </button>
              </div>
              {showContactForm && (
                <div className="mb-6 p-6 border rounded-xl bg-purple-50 border-purple-200 animate-fadeIn">
                  <h3 className="font-bold mb-4 text-purple-800">Add New Emergency Contact</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={newContact.name}
                        onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all"
                        placeholder="Enter contact name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input 
                        type="text" 
                        value={newContact.phone}
                        onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all"
                        placeholder="Enter phone number"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                      <input 
                        type="text" 
                        value={newContact.relation}
                        onChange={(e) => setNewContact({...newContact, relation: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all"
                        placeholder="Family, Friend, etc."
                      />
                    </div>
                    <div className="flex space-x-3 pt-2">
                      <button 
                        onClick={addNewContact}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md font-medium"
                      >
                        Add Contact
                      </button>
                      <button 
                        onClick={() => setShowContactForm(false)}
                        className="flex-1 bg-gray-200 px-4 py-3 rounded-lg hover:bg-gray-300 transition-all font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyContacts.map(contact => (
                  <div key={contact.id} className="p-4 border border-gray-200 rounded-xl hover:border-purple-200 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl mr-4">
                          {contact.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-800">{contact.name}</h3>
                          <p className="text-sm text-gray-500">{contact.relation}</p>
                          <p className="text-sm font-medium text-gray-700 mt-1">{contact.phone}</p>
                        </div>
                      </div>
                      <div className="flex space-x-1">
                        <button className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-all">
                          <Phone size={18} />
                        </button>
                        <button 
                          onClick={() => removeContact(contact.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-all"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {currentTab === 'danger-zones' && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Danger Zones</h2>
                  <p className="text-gray-500">Areas to avoid for your safety</p>
                </div>
                <button 
                  onClick={() => setShowZoneForm(true)}
                  className="p-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:from-orange-600 hover:to-red-600 transition-all shadow-md"
                >
                  <Plus size={20} />
                </button>
              </div>
              {showZoneForm && (
                <div className="mb-6 p-6 border rounded-xl bg-orange-50 border-orange-200 animate-fadeIn">
                  <h3 className="font-bold mb-4 text-orange-800">Add New Danger Zone</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Zone Name</label>
                      <input 
                        type="text" 
                        value={newZone.name}
                        onChange={(e) => setNewZone({...newZone, name: e.target.value})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all"
                        placeholder="Enter zone name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Radius (meters)</label>
                      <input 
                        type="number" 
                        value={newZone.radius}
                        onChange={(e) => setNewZone({...newZone, radius: parseInt(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all"
                        placeholder="Enter radius"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                      <input 
                        type="number" 
                        value={newZone.lat}
                        onChange={(e) => setNewZone({...newZone, lat: parseFloat(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all"
                        placeholder="Enter latitude"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                      <input 
                        type="number" 
                        value={newZone.lng}
                        onChange={(e) => setNewZone({...newZone, lng: parseFloat(e.target.value)})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all"
                        placeholder="Enter longitude"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Risk Level</label>
                      <select 
                        value={newZone.riskLevel}
                        onChange={(e) => setNewZone({...newZone, riskLevel: e.target.value as 'high' | 'medium' | 'low'})}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-transparent outline-none transition-all"
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                    <div className="flex space-x-3 pt-2">
                      <button 
                        onClick={addNewDangerZone}
                        className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-3 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-md font-medium"
                      >
                        Add Zone
                      </button>
                      <button 
                        onClick={() => setShowZoneForm(false)}
                        className="flex-1 bg-gray-200 px-4 py-3 rounded-lg hover:bg-gray-300 transition-all font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dangerZones.map(zone => (
                  <div key={zone.id} className="p-4 border border-gray-200 rounded-xl hover:border-orange-200 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-800">{zone.name}</h3>
                        <p className="text-sm text-gray-500 capitalize">{zone.riskLevel} Risk Level</p>
                        <p className="text-sm font-medium text-gray-700 mt-1">Radius: {zone.radius} meters</p>
                        <p className="text-sm font-medium text-gray-700 mt-1">Lat: {zone.lat}, Lng: {zone.lng}</p>
                      </div>
                      <div className="flex space-x-1">
                        <button 
                          onClick={() => removeDangerZone(zone.id)}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-full transition-all"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SafetyDashboard;