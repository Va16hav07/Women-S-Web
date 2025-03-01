import { useState, useEffect, MouseEvent, useRef, useCallback } from "react";
import {
  Menu, User, LogOut, AlertCircle, Home, Phone, Clock,
  Bell, Users, MapPin, Settings, HelpCircle, Share, Shield,
  AlertTriangle, Navigation, ChevronRight, Heart, X,
  Plus, Trash2, Send, CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useContacts } from '../hooks/useContacts';
import ContactsList from '../components/ContactsList';
import { GoogleMap, useJsApiLoader, DirectionsRenderer, Marker, InfoWindow } from '@react-google-maps/api';
import SavedRoutesPanel from '../components/SavedRoutesPanel';
import SaveRouteModal from '../components/SaveRouteModal';
import { TravelRecommendationService, TravelRoute } from '../services/TravelRecommendationService';

// Add this type definition at the top of the file
type Priority = "high" | "medium" | "low";
type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;
type GeofenceStatus = "inside" | "outside" | "unknown";

const GOOGLE_MAPS_API_KEY = "AIzaSyCTncgg-x65QicwCIqyGJYopp45dMBh74Y";
const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 }; // Delhi coordinates
const DEFAULT_ZOOM = 13;
const LIBRARIES: ["places", "geometry"] = ["places", "geometry"];

const Dashboard = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [routeDisplayed, setRouteDisplayed] = useState<boolean | "loading">(false);
  const [showNotification, setShowNotification] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [newContact, setNewContact] = useState<{
    name: string;
    phone: string;
    priority: Priority;
  }>({ name: "", phone: "", priority: "medium" });
  const [showAddContact, setShowAddContact] = useState(false);
  const [alertSent, setAlertSent] = useState<number | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLngLiteral>(DEFAULT_CENTER);
  const [safePoints, setSafePoints] = useState<Array<{
    location: LatLngLiteral;
    name: string;
    type: string;
  }>>([]);
  const [userLocation, setUserLocation] = useState<LatLngLiteral | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [directionsResponse, setDirectionsResponse] = useState<DirectionsResult | null>(null);
  const [routeDeviation, setRouteDeviation] = useState<GeofenceStatus>("unknown");
  const [distance, setDistance] = useState<string>("");
  const [duration, setDuration] = useState<string>("");
  const [routePoints, setRoutePoints] = useState<LatLngLiteral[]>([]);
  const [geofenceRadius, setGeofenceRadius] = useState<number>(50); // 50 meters radius
  const [deviationAlert, setDeviationAlert] = useState<boolean>(false);
  const [saveRouteModal, setSaveRouteModal] = useState<boolean>(false);
  const [routeName, setRouteName] = useState<string>("");
  const [savedRoutes, setSavedRoutes] = useState<TravelRoute[]>([]);
  const [travelRecommendationService] = useState<TravelRecommendationService>(
    new TravelRecommendationService()
  );

  const { contacts, addContact, deleteContact } = useContacts();
  const mapRef = useRef<google.maps.Map | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(null);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
    placesServiceRef.current = new google.maps.places.PlacesService(map);
    directionsServiceRef.current = new google.maps.DirectionsService();
  }, []);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Calculate route
  const calculateRoute = async () => {
    if (!fromAddress || !toAddress) {
      alert("Please enter both 'From' and 'To' addresses");
      return;
    }

    setRouteDisplayed("loading");

    if (directionsServiceRef.current) {
      try {
        const results = await directionsServiceRef.current.route({
          origin: fromAddress,
          destination: toAddress,
          travelMode: google.maps.TravelMode.WALKING,
          provideRouteAlternatives: true,
          optimizeWaypoints: true,
        });

        setDirectionsResponse(results);
        setDistance(results.routes[0].legs[0].distance?.text || "");
        setDuration(results.routes[0].legs[0].duration?.text || "");
        
        // Extract route points for geofencing
        const path = results.routes[0].overview_path.map(point => ({
          lat: point.lat(),
          lng: point.lng()
        }));
        setRoutePoints(path);
        
        // Once route is calculated, fetch nearby safe points
        fetchNearbyPlaces();
        
        setRouteDisplayed(true);
      } catch (error) {
        console.error("Failed to calculate route:", error);
        alert("Could not calculate a route. Please check your addresses.");
        setRouteDisplayed(false);
      }
    }
  };

  const fetchNearbyPlaces = () => {
    if (!placesServiceRef.current || !mapRef.current || !userLocation) return;
    
    const types = ['police', 'hospital', 'transit_station'];
    const safePointsData: Array<{
      location: LatLngLiteral;
      name: string;
      type: string;
    }> = [];

    types.forEach(type => {
      const request = {
        location: userLocation,
        radius: 5000, // 5km radius
        type: type
      };

      placesServiceRef.current?.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          results.slice(0, 5).forEach(place => {
            if (place.geometry && place.geometry.location) {
              safePointsData.push({
                location: { 
                  lat: place.geometry.location.lat(), 
                  lng: place.geometry.location.lng() 
                },
                name: place.name || "Unnamed",
                type: type
              });
            }
          });
          setSafePoints(prevPoints => [...prevPoints, ...safePointsData]);
        }
      });
    });
  };

  const checkRouteDeviation = useCallback(() => {
    if (!userLocation || routePoints.length === 0) return;

    // Use Google's geometry library to check if point is on path
    const isOnPath = google.maps.geometry.poly.isLocationOnEdge(
      new google.maps.LatLng(userLocation.lat, userLocation.lng),
      new google.maps.Polyline({ path: routePoints }),
      geofenceRadius / 1000 // Convert meters to kilometers
    );

    const newStatus = isOnPath ? "inside" : "outside";
    
    if (newStatus === "outside" && routeDeviation !== "outside") {
      // Only show alert when first deviating
      setDeviationAlert(true);
      setTimeout(() => setDeviationAlert(false), 10000); // Hide after 10 seconds
    }
    
    setRouteDeviation(newStatus);
  }, [userLocation, routePoints, geofenceRadius, routeDeviation]);

  // Monitor user's location for route deviation
  useEffect(() => {
    if (routeDisplayed === true) {
      const interval = setInterval(checkRouteDeviation, 10000); // Check every 10 seconds
      return () => clearInterval(interval);
    }
  }, [routeDisplayed, checkRouteDeviation]);

  // Fetch user's live location
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          if (!mapCenter) {
            setMapCenter({ lat: latitude, lng: longitude });
          }
        },
        (error) => {
          console.error("Error fetching user location:", error);
        },
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
      );
      
      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, [mapCenter]);

  const sendLocationToAPI = async () => {
    if (userLocation) {
      try {
        const response = await fetch("http://localhost:8888/api/location", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            latitude: userLocation.lat,
            longitude: userLocation.lng,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          console.error("Failed to send location:", data.message);
        }
      } catch (error) {
        console.error("Error sending location:", error);
      }
    }
  };

  // Send location to API every 1 minute
  useEffect(() => {
    const interval = setInterval(sendLocationToAPI, 60000);
    return () => clearInterval(interval);
  }, [userLocation]);

  const handleSOS = async () => {
    const sosButton = document.getElementById("sos-button");
    sosButton?.classList.add("scale-150");
  
    // Show confirmation alert instantly
    const userConfirmed = window.confirm("⚠️ SOS Alert! Press 'OK' within 5 seconds to confirm.");
  
    // Start a 5-second timer
    setTimeout(async () => {
      if (!userConfirmed) {
        sosButton?.classList.remove("scale-150");
        alert("SOS alert cancelled.");
        return;
      }
  
      // Capture any message the user wants to send
      const message = prompt("Enter any additional details about your emergency (optional):");
      
      try {
        // Analyze message for distress signals using Google Natural Language API
        if (message) {
          const sentimentResponse = await fetch("http://localhost:3001/api/analyze-sentiment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: message }),
          });
          
          if (sentimentResponse.ok) {
            const sentimentData = await sentimentResponse.json();
            // If sentiment is very negative, escalate the alert
            if (sentimentData.score < -0.5) {
              // Add high priority flag
            }
          }
        }
      
        const response = await fetch("http://localhost:3001/api/sos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            location: userLocation,
            message: message || "Emergency alert triggered",
          }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to send SOS messages.");
        }
  
        alert("🚨 SOS alert sent to your emergency contacts and nearby authorities!");
  
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Network error. Please try again.";
        alert(errorMessage);
      } finally {
        sosButton?.classList.remove("scale-150");
      }
    }, 5000); // 5-second delay before action
  };
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  function handleSignOut(event: MouseEvent<HTMLButtonElement>): void {
    // Add actual sign out logic here
    console.log("Signing out...");
    // Example: Redirect to login page
    window.location.href = "/login";
  }

  const sendAlert = (id: number) => {
    setAlertSent(id);
    setTimeout(() => {
      setAlertSent(null);
    }, 3000);
  };

  const handleSaveRoute = (name: string, notes?: string) => {
    if (!name) {
      alert("Please enter a name for this route");
      return;
    }

    // Calculate safety score based on nearby safe points
    const safetyScore = Math.min(10, Math.floor(safePoints.length * 1.5));
    
    // Get current lighting conditions - simplified example
    const hour = new Date().getHours();
    const lightingCondition = hour >= 6 && hour < 18 ? "Good lighting" : "Limited lighting";
    
    // Time of day category
    let timeOfDay;
    if (hour >= 5 && hour < 12) timeOfDay = "Morning";
    else if (hour >= 12 && hour < 17) timeOfDay = "Afternoon";
    else if (hour >= 17 && hour < 21) timeOfDay = "Evening";
    else timeOfDay = "Night";

    const newRoute = travelRecommendationService.saveRoute({
      name,
      from: fromAddress,
      to: toAddress,
      safetyScore,
      lightingCondition,
      timeOfDay,
      notes
    });

    setSavedRoutes(travelRecommendationService.getSavedRoutes());
    setSaveRouteModal(false);
    alert("Route saved successfully!");
  };

  const handleSelectRoute = (route: TravelRoute) => {
    setFromAddress(route.from);
    setToAddress(route.to);
    calculateRoute();
  };

  const handleToggleFavorite = (id: string) => {
    const updatedRoute = travelRecommendationService.toggleFavorite(id);
    if (updatedRoute) {
      setSavedRoutes(travelRecommendationService.getSavedRoutes());
    }
  };

  const handleDeleteRoute = (id: string) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      const deleted = travelRecommendationService.deleteRoute(id);
      if (deleted) {
        setSavedRoutes(travelRecommendationService.getSavedRoutes());
      }
    }
  };

  // Add this useEffect to load saved routes when component mounts
  useEffect(() => {
    const loadSavedRoutes = () => {
      const routes = travelRecommendationService.getSavedRoutes();
      setSavedRoutes(routes);
    };
    
    loadSavedRoutes();
  }, [travelRecommendationService]);

  // Map options based on dark mode
  const mapOptions: MapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    styles: darkMode ? [
      { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] },
      { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#212a37" }] },
      { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] },
    ] : [],
  };

  return (
    <div className={`relative min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} transition-colors duration-300`}>
      
      {/* Animated Sidebar */}
      <aside 
        className={`fixed top-0 left-0 h-full w-72 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-2xl transform ${sidebarOpen ? "translate-x-0" : "-translate-x-72"} transition-all duration-300 ease-in-out z-50 overflow-hidden rounded-r-xl`}
      >
        <div className="p-6 text-xl font-bold flex items-center">
          <Shield className={`h-7 w-7 mr-3 ${darkMode ? "text-pink-400" : "text-pink-600"}`} />
          <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent font-extrabold text-2xl tracking-tight">
            SafeHer
          </span>
        </div>
        
        {/* Decorative Element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-200 to-transparent opacity-20 rounded-bl-full -z-10"></div>
        
        <nav className="flex flex-col space-y-2 p-4">
          <button className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 transform hover:translate-x-2 ${darkMode ? "bg-pink-900/40 text-pink-100 hover:bg-pink-800/60" : "bg-pink-100 text-pink-800 hover:bg-pink-200"}`}>
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
            <ChevronRight className="h-4 w-4 ml-auto" />
          </button>
          
          {[
            { icon: <Phone className="h-5 w-5" />, label: "Emergency Contacts", path: "/emergency-contacts" },
            { icon: <Share className="h-5 w-5" />, label: "Secure Sharing", path: "/secure-sharing" },
            { icon: <AlertTriangle className="h-5 w-5" />, label: "Danger Zones", path: "/danger-zones" },
            { icon: <Users className="h-5 w-5" />, label: "Be a Nearby Responder", path: "/responder" },
            { icon: <Settings className="h-5 w-5" />, label: "Settings", path: "/settings" }
          ].map((item, index) => (
            <Link 
              key={index}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 transform hover:translate-x-2 ${darkMode ? "hover:bg-gray-700/70" : "hover:bg-gray-100"}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {item.icon}
              <span>{item.label}</span>
              <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>
        
        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm text-gray-500 dark:text-gray-400">Dark Mode</span>
            <button 
              onClick={(e) => { e.stopPropagation(); toggleDarkMode(); }}
              className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${darkMode ? "bg-pink-600" : "bg-gray-300"}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transform transition-transform duration-300 ${darkMode ? "translate-x-6" : "translate-x-0"}`}></div>
            </button>
          </div>
          
          <button 
            onClick={handleSignOut} 
            className={`flex items-center space-x-2 w-full p-3 text-red-600 rounded-lg transition-all duration-200 ${darkMode ? "hover:bg-red-900/30" : "hover:bg-red-100"}`}
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay with blur effect when sidebar is open */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Navbar with Glass Effect */}
      <header className={`sticky top-0 z-30 ${darkMode ? "bg-gray-800/90" : "bg-white/90"} backdrop-blur-md border-b ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm`}>
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <div className="flex items-center">
            <button 
              className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"} transition-colors duration-200`}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold ml-4 flex items-center">
              <Shield className={`h-5 w-5 mr-2 ${darkMode ? "text-pink-400" : "text-pink-600"}`} />
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                SafeHer
              </span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Current Time with animated border */}
            <div className={`hidden md:flex items-center text-sm px-3 py-1.5 border ${darkMode ? "border-gray-600" : "border-gray-300"} rounded-full`}>
              <Clock className="h-4 w-4 mr-2" />
              <span>{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            
            {/* Help Button with Tooltip */}
            <div className="relative group">
              <button className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"} transition-colors duration-200`}>
                <HelpCircle className="h-6 w-6" />
              </button>
              <div className="absolute right-0 mt-2 w-48 px-4 py-2 bg-black text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                Get help with navigation and safety features
              </div>
            </div>
            
            {/* User dropdown with animation */}
            <div className="relative">
              <button 
                className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"} transition-colors duration-200 flex items-center`}
                onClick={() => setUserDropdown(!userDropdown)}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mr-2 shadow-md">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="hidden md:inline font-medium">User</span>
              </button>
              
              {userDropdown && (
                <div className={`absolute right-0 mt-3 w-64 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-xl rounded-xl overflow-hidden z-50 animate-fadeIn`}>
                  <div className={`p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mr-3 shadow-md">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-lg">User</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    <Link 
                      to="/notification-settings" 
                      className={`block w-full p-3 text-left rounded-lg ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors duration-200`}
                    >
                      <div className="flex items-center">
                        <Bell className="h-5 w-5 mr-2" />
                        Notification Preferences
                      </div>
                    </Link>
                    <Link 
                      to="/privacy-settings" 
                      className={`block w-full p-3 text-left rounded-lg ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors duration-200`}
                    >
                      <div className="flex items-center">
                        <Shield className="h-5 w-5 mr-2" />
                        Privacy Settings
                      </div>
                    </Link>
                    <button className={`flex items-center w-full p-3 mt-2 text-left rounded-lg text-red-600 ${darkMode ? "hover:bg-red-900/30" : "hover:bg-red-100"} transition-colors duration-200`}>
                      <LogOut className="h-5 w-5 mr-2" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Route Deviation Alert */}
        {deviationAlert && (
          <div className={`fixed top-24 left-1/2 transform -translate-x-1/2 ${darkMode ? "bg-red-900/80" : "bg-red-100"} border-l-4 border-red-500 p-4 mb-6 rounded-lg shadow-xl animate-pulse z-50 w-5/6 max-w-2xl`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AlertTriangle className={`h-6 w-6 ${darkMode ? "text-red-400" : "text-red-600"}`} />
              </div>
              <div className="ml-3">
                <p className="font-bold text-lg">Route Deviation Detected!</p>
                <p className="text-sm">You have strayed from your planned route. Return to the route or tap "I'm Safe" to dismiss.</p>
              </div>
              <button 
                onClick={() => setDeviationAlert(false)}
                className="ml-auto bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                I'm Safe
              </button>
            </div>
          </div>
        )}

        {/* Notification Banner */}
        {showNotification && (
          <div className={`relative ${darkMode ? "bg-green-900/50" : "bg-green-100"} border-l-4 border-green-500 p-4 mb-6 rounded-lg shadow-md animate-slideDown`}>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Shield className={`h-6 w-6 ${darkMode ? "text-green-400" : "text-green-600"}`} />
              </div>
              <div className="ml-3">
                <p className="font-medium">Safe Mode Active</p>
                <p className="text-sm">Your location is being monitored. Stay safe!</p>
              </div>
              <button 
                onClick={() => setShowNotification(false)}
                className="ml-auto"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8">
          {/* Map Section with Enhanced UI */}
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]`}>
            <div className={`p-4 flex justify-between items-center border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
              <h2 className="text-lg font-semibold flex items-center">
                <MapPin className={`h-5 w-5 mr-2 ${darkMode ? "text-pink-400" : "text-pink-600"}`} />
                Route Navigation
              </h2>
              <div className="flex space-x-2">
                {routeDeviation === "outside" && (
                  <span className="px-3 py-1 text-xs rounded-full bg-red-500 text-white animate-pulse">
                    Off Route!
                  </span>
                )}
                {routeDeviation === "inside" && (
                  <span className="px-3 py-1 text-xs rounded-full bg-green-500 text-white">
                    On Route
                  </span>
                )}
                {distance && duration && (
                  <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {distance} • {duration}
                  </span>
                )}
              </div>
            </div>
            <div className={`h-[60vh] ${darkMode ? "bg-gray-700" : "bg-gray-200"} relative overflow-hidden rounded-lg`}>
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={mapCenter}
                  zoom={DEFAULT_ZOOM}
                  onLoad={onMapLoad}
                  options={mapOptions}
                >
                  {userLocation && (
                    <Marker
                      position={userLocation}
                      icon={{
                        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        scaledSize: new google.maps.Size(40, 40)
                      }}
                    />
                  )}

                  {safePoints.map((point, index) => (
                    <Marker
                      key={index}
                      position={point.location}
                      icon={{
                        url: point.type === 'police' 
                          ? 'http://maps.google.com/mapfiles/ms/icons/police.png' 
                          : point.type === 'hospital'
                            ? 'http://maps.google.com/mapfiles/ms/icons/hospitals.png'
                            : 'http://maps.google.com/mapfiles/ms/icons/bus.png',
                        scaledSize: new google.maps.Size(32, 32)
                      }}
                      onClick={() => setSelectedLocation(index)}
                    />
                  ))}

                  {selectedLocation !== null && (
                    <InfoWindow
                      position={safePoints[selectedLocation].location}
                      onCloseClick={() => setSelectedLocation(null)}
                    >
                      <div className="p-2">
                        <h3 className="font-medium">{safePoints[selectedLocation].name}</h3>
                        <p className="text-sm capitalize">{safePoints[selectedLocation].type.replace('_', ' ')}</p>
                        <button
                          className="mt-1 text-xs bg-blue-500 text-white px-2 py-1 rounded"
                          onClick={() => {
                            // Navigate to this safe point
                            if (directionsServiceRef.current && userLocation) {
                              directionsServiceRef.current.route(
                                {
                                  origin: userLocation,
                                  destination: safePoints[selectedLocation].location,
                                  travelMode: google.maps.TravelMode.WALKING
                                },
                                (result, status) => {
                                  if (status === google.maps.DirectionsStatus.OK) {
                                    setDirectionsResponse(result);
                                    setSelectedLocation(null);
                                  }
                                }
                              );
                            }
                          }}
                        >
                          Navigate Here
                        </button>
                      </div>
                    </InfoWindow>
                  )}

                  {directionsResponse && (
                    <DirectionsRenderer
                      directions={directionsResponse}
                      options={{
                        suppressMarkers: true,
                        polylineOptions: {
                          strokeColor: '#6366F1',
                          strokeWeight: 6,
                          strokeOpacity: 0.7
                        }
                      }}
                    />
                  )}
                </GoogleMap>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full border-4 border-pink-200 border-t-pink-600 animate-spin"></div>
                </div>
              )}

              {routeDisplayed === "loading" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-20">
                  <div className="w-12 h-12 rounded-full border-4 border-pink-200 border-t-pink-600 animate-spin"></div>
                </div>
              )}
            </div>
            
            {/* Route actions */}
            {routeDisplayed === true && (
              <div className="p-4 flex justify-between">
                <button
                  onClick={() => {
                    setDirectionsResponse(null);
                    setDistance("");
                    setDuration("");
                    setRouteDisplayed(false);
                    setRoutePoints([]);
                  }}
                  className={`px-3 py-1 text-sm rounded-lg ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"} transition-colors`}
                >
                  Clear Route
                </button>
                
                <button
                  onClick={() => setSaveRouteModal(true)}
                  className="px-3 py-1 text-sm rounded-lg bg-green-100 text-green-800 hover:bg-green-200 transition-colors"
                >
                  Save as Safe Route
                </button>
              </div>
            )}
          </div>

          {/* Input Section with Floating Labels and Animations */}
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-2xl`}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group">
                <div className={`absolute top-0 left-0 w-full h-full ${darkMode ? "bg-gray-700" : "bg-gray-100"} rounded-lg -z-10 transform group-focus-within:scale-105 transition-transform duration-300`}></div>
                <input
                  type="text"
                  id="from"
                  className={`w-full p-4 pb-2 pt-6 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-700 focus:bg-gray-700" : "border-gray-300 bg-white focus:bg-white"} focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300`}
                  placeholder=" "
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                />
                <label 
                  htmlFor="from"
                  className={`absolute text-sm left-4 transition-all duration-200 ${
                    fromAddress ? "top-2 text-pink-600 text-xs" : "top-4 text-gray-500"
                  } peer-focus:top-2 peer-focus:text-pink-600 peer-focus:text-xs`}
                >
                  From Address
                </label>
                <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              
              <div className="relative group">
                <div className={`absolute top-0 left-0 w-full h-full ${darkMode ? "bg-gray-700" : "bg-gray-100"} rounded-lg -z-10 transform group-focus-within:scale-105 transition-transform duration-300`}></div>
                <input
                  type="text"
                  id="to"
                  className={`w-full p-4 pb-2 pt-6 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-700 focus:bg-gray-700" : "border-gray-300 bg-white focus:bg-white"} focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300`}
                  placeholder=" "
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                />
                <label 
                  htmlFor="to"
                  className={`absolute text-sm left-4 transition-all duration-200 ${
                    toAddress ? "top-2 text-pink-600 text-xs" : "top-4 text-gray-500"
                  } peer-focus:top-2 peer-focus:text-pink-600 peer-focus:text-xs`}
                >
                  To Destination
                </label>
                <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <button
                onClick={calculateRoute}
                className={`${darkMode ? "bg-gradient-to-r from-pink-600 to-purple-700" : "bg-gradient-to-r from-pink-500 to-purple-600"} text-white font-medium py-3 px-6 rounded-xl flex items-center shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-pink-500/25`}
              >
                <Navigation className="h-5 w-5 mr-2" />
                Show Safe Route
              </button>
            </div>
          </div>
          
          {/* Saved Routes Panel */}
          {savedRoutes.length > 0 && (
            <SavedRoutesPanel
              routes={savedRoutes}
              darkMode={darkMode}
              onSelectRoute={handleSelectRoute}
              onFavoriteToggle={handleToggleFavorite}
              onDeleteRoute={handleDeleteRoute}
            />
          )}
          
          {/* Emergency Contacts Section */}
          <ContactsList
            contacts={contacts}
            onAdd={addContact}
            onDelete={deleteContact}
            darkMode={darkMode}
          />
          
          {/* SOS Button */}
          <div className="fixed bottom-6 right-6 z-30">
            <button
              id="sos-button"
              onClick={handleSOS}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-full ${darkMode ? "bg-red-600" : "bg-red-500"} text-white font-bold flex items-center justify-center shadow-lg transform transition-all duration-300 hover:scale-110 animate-pulse hover:animate-none`}
              style={{ boxShadow: "0 0 0 rgba(255, 99, 71, 0.4), 0 0 20px rgba(255, 99, 71, 0.4)" }}
            >
              <AlertCircle className="h-8 w-8 md:h-10 md:w-10" />
              <span className="sr-only">Emergency SOS</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Save Route Modal */}
      <SaveRouteModal
        isOpen={saveRouteModal}
        onClose={() => setSaveRouteModal(false)}
        onSave={handleSaveRoute}
        darkMode={darkMode}
        fromAddress={fromAddress}
        toAddress={toAddress}
      />
    </div>
  );
};

export default Dashboard;