import React from "react";
import { useNavigate } from "react-router-dom";
import { Menu, User, LogOut, ShieldAlert } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Clear auth data (implement auth logic)
    localStorage.removeItem("authToken");
    navigate("/sign-in");
  };

  return (
    <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navbar with Slider Menu */}
      <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md">
        <button className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700">
          <Menu className="h-6 w-6" />
        </button>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <button className="p-2 rounded-full hover:bg-gray-300 dark:hover:bg-gray-700">
          <User className="h-6 w-6" />
        </button>
      </header>

      {/* Map Section */}
      <div className="h-[60vh] w-full">
        <MapContainer center={[51.505, -0.09]} zoom={13} className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[51.505, -0.09]}>
            <Popup> Your Location </Popup>
          </Marker>
        </MapContainer>
      </div>

      {/* Buttons Section */}
      <div className="flex justify-around p-4">
        {/* SOS Button */}
        <button className="bg-red-600 text-white p-4 rounded-full shadow-lg flex items-center space-x-2">
          <ShieldAlert className="h-6 w-6" />
          <span>SOS</span>
        </button>

        {/* Sign Out Button */}
        <button
          onClick={handleSignOut}
          className="bg-gray-700 text-white p-4 rounded-full shadow-lg flex items-center space-x-2"
        >
          <LogOut className="h-6 w-6" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Dashboard;