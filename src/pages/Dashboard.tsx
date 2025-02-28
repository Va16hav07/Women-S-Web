import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Menu, User, LogOut, ShieldAlert, Home, Info, Phone, 
  Bell, Users, MapPin, Settings, Battery, Wifi, Clock
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon issue
// This is needed because of how Leaflet handles assets in React
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

// Component to handle location updates
const LocationMarker = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const map = useMap();

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16 });
    
    map.on('locationfound', (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
      map.flyTo(e.latlng, map.getZoom());
    });

    return () => {
      map.off('locationfound');
    };
  }, [map]);

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  );
};

// Mock data for trusted contacts
const trustedContacts = [
  { id: 1, name: "Mom", phone: "+1 (555) 123-4567" },
  { id: 2, name: "Dad", phone: "+1 (555) 987-6543" },
  { id: 3, name: "Sister", phone: "+1 (555) 456-7890" }
];

// Mock data for recent alerts
const recentAlerts = [
  { id: 1, type: "SOS", date: "2025-05-15 14:30", status: "Resolved" },
  { id: 2, type: "Location Share", date: "2025-05-14 19:45", status: "Completed" }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  // const [batteryLevel, setBatteryLevel] = useState(85);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("authToken");
    navigate("/sign-in");
  };

  const handleSOS = () => {
    // In a real app, this would trigger emergency protocols
    alert("SOS alert sent to your emergency contacts and nearby authorities!");
  };

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg transform ${sidebarOpen ? "translate-x-0" : "-translate-x-64"} transition-transform duration-300 z-50`}>
        <div className="p-5 text-xl font-bold flex items-center">
          <ShieldAlert className="h-6 w-6 mr-2 text-purple-600" />
          SafeGuardian
        </div>
        <nav className="flex flex-col space-y-2 p-4">
          <button className="flex items-center space-x-2 p-2 bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-100 rounded">
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </button>
          <button className="flex items-center space-x-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
            <Users className="h-5 w-5" />
            <span>Trusted Contacts</span>
          </button>
          <button className="flex items-center space-x-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
            <MapPin className="h-5 w-5" />
            <span>Safe Locations</span>
          </button>
          <button className="flex items-center space-x-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
            <Bell className="h-5 w-5" />
            <span>Alerts History</span>
          </button>
          <button className="flex items-center space-x-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
          <button className="flex items-center space-x-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
            <Info className="h-5 w-5" />
            <span>Help & Resources</span>
          </button>
          <button className="flex items-center space-x-2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded">
            <Phone className="h-5 w-5" />
            <span>Emergency Numbers</span>
          </button>
        </nav>
        <div className="absolute bottom-0 left-0 w-full p-4 border-t border-gray-200 dark:border-gray-700">
          <button 
            onClick={handleSignOut} 
            className="flex items-center space-x-2 w-full p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
          >
            <LogOut className="h-5 w-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay when sidebar is open on mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Navbar */}
      <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
        <div className="flex items-center">
          <button 
            className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700" 
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold ml-4">Dashboard</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Status indicators */}
          <div className="hidden md:flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            <div className="flex items-center">
              <Battery className="h-4 w-4 mr-1" />
              {/* <span>{batteryLevel}%</span> */}
            </div>
            <div className="flex items-center">
              <Wifi className="h-4 w-4 mr-1" />
              <span>Connected</span>
            </div>
          </div>
          
          {/* User dropdown */}
          <div className="relative">
            <button 
              className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 flex items-center" 
              onClick={() => setUserDropdown(!userDropdown)}
            >
              <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center mr-2">
                <User className="h-5 w-5 text-purple-700" />
              </div>
              <span className="hidden md:inline">Sarah Johnson</span>
            </button>
            
            {userDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-md z-50">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="font-medium">Sarah Johnson</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">sarah.j@example.com</p>
                </div>
                <button className="block w-full p-3 text-left hover:bg-gray-200 dark:hover:bg-gray-700">Profile Settings</button>
                <button className="block w-full p-3 text-left hover:bg-gray-200 dark:hover:bg-gray-700">Privacy Settings</button>
                <button onClick={handleSignOut} className="block w-full p-3 text-left text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30">
                  <LogOut className="h-5 w-5 inline mr-2" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="pt-4 px-4 md:px-6 lg:px-8">
        {/* Status Banner */}
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div className="ml-3">
              <p className="font-medium">Safe Status Active</p>
              <p className="text-sm">Your location is being shared with your trusted contacts.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section - Takes 2/3 of the space on large screens */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold">Live Location</h2>
            </div>
            <div className="h-[50vh]">
              <MapContainer 
                center={[51.505, -0.09]} 
                zoom={13} 
                className="h-full w-full"
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker />
              </MapContainer>
            </div>
          </div>

          {/* Right sidebar with contacts and alerts */}
          <div className="space-y-6">
            {/* Trusted Contacts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Trusted Contacts</h2>
                <button className="text-purple-600 text-sm">Manage</button>
              </div>
              <div className="p-4 space-y-3">
                {trustedContacts.map(contact => (
                  <div key={contact.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{contact.phone}</p>
                      </div>
                    </div>
                    <button className="text-purple-600">
                      <Phone className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button className="w-full mt-2 p-2 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                  + Add Contact
                </button>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold">Recent Alerts</h2>
              </div>
              <div className="p-4">
                {recentAlerts.map(alert => (
                  <div key={alert.id} className="mb-3 pb-3 border-b border-gray-200 dark:border-gray-700 last:border-0 last:mb-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{alert.type}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{alert.date}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        alert.status === "Resolved" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-blue-100 text-blue-800"
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                  </div>
                ))}
                <button className="w-full mt-2 text-sm text-purple-600 hover:text-purple-800">
                  View All Alerts
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mt-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* SOS Button */}
            <button 
              onClick={handleSOS}
              className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center h-24"
            >
              <ShieldAlert className="h-8 w-8 mb-2" />
              <span className="font-bold">SOS</span>
            </button>
            
            {/* Share Location */}
            <button className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center h-24">
              <MapPin className="h-8 w-8 mb-2" />
              <span className="font-bold">Share Location</span>
            </button>
            
            {/* Call Emergency */}
            <button className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center h-24">
              <Phone className="h-8 w-8 mb-2" />
              <span className="font-bold">Call Emergency</span>
            </button>
            
            {/* Safe Check-in */}
            <button className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-lg shadow-lg flex flex-col items-center justify-center h-24">
              <Bell className="h-8 w-8 mb-2" />
              <span className="font-bold">Safe Check-in</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 text-center p-4 shadow-md">
        <p>&copy; {new Date().getFullYear()} SafeGuardian. All rights reserved.</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Emergency: 911 | Helpline: 1-800-799-7233
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;