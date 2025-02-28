import { useState, useEffect } from "react";
import { User, Mail, Lock, Save, Shield, HelpCircle, LogOut, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const ProfileSettings = () => {
  const [name, setName] = useState("Emma Wilson");
  const [email, setEmail] = useState("emma.w@example.com");
  const [password, setPassword] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [darkMode, setDarkMode] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleSignOut = () => {
    // Add actual sign out logic here
    console.log("Signing out...");
    window.location.href = "/login";
  };

  const handleSave = () => {
    // Add save logic here
    alert("Profile settings saved!");
  };

  return (
    <div className={`relative min-h-screen ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"} transition-colors duration-300`}>
      {/* Sidebar - Same as Dashboard */}
      <aside 
        className={`fixed top-0 left-0 h-full w-72 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-2xl transform ${sidebarOpen ? "translate-x-0" : "-translate-x-72"} transition-all duration-300 ease-in-out z-50 overflow-hidden rounded-r-xl`}
      >
        {/* Copy the entire sidebar content from Dashboard.tsx */}
        {/* ...existing sidebar code... */}
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Header - Same as Dashboard */}
      <header className={`sticky top-0 z-30 ${darkMode ? "bg-gray-800/90" : "bg-white/90"} backdrop-blur-md border-b ${darkMode ? "border-gray-700" : "border-gray-200"} shadow-sm`}>
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <div className="flex items-center">
            {/* Removed the Menu button/sidebar opening icon */}
            <h1 className="text-xl font-bold flex items-center">
              <Shield className={`h-5 w-5 mr-2 ${darkMode ? "text-pink-400" : "text-pink-600"}`} />
              <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                SafeHer
              </span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className={`hidden md:flex items-center text-sm px-3 py-1.5 border ${darkMode ? "border-gray-600" : "border-gray-300"} rounded-full`}>
              <Clock className="h-4 w-4 mr-2" />
              <span>{currentTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
            
            <div className="relative group">
              <button className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"} transition-colors duration-200`}>
                <HelpCircle className="h-6 w-6" />
              </button>
            </div>
            
            <div className="relative">
              <button 
                className={`p-2 rounded-full ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-200"} transition-colors duration-200 flex items-center`}
                onClick={() => setUserDropdown(!userDropdown)}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mr-2 shadow-md">
                  <User className="h-5 w-5 text-white" />
                </div>
                <span className="hidden md:inline font-medium">Emma Wilson</span>
              </button>
              
              {/* User Dropdown */}
              {userDropdown && (
                <div className={`absolute right-0 mt-2 w-48 rounded-xl ${darkMode ? "bg-gray-800" : "bg-white"} shadow-lg py-1 border ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <button onClick={handleSignOut} className={`block w-full text-left px-4 py-2 text-sm ${darkMode ? "hover:bg-gray-700 text-red-400" : "hover:bg-gray-100 text-red-600"}`}>
                    <LogOut className="h-4 w-4 inline mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
        <div className="space-y-6">
          <div className="relative group">
            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              className="w-full p-4 pl-12 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              className="w-full p-4 pl-12 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="password"
              className="w-full p-4 pl-12 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all duration-300"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white font-medium py-3 px-6 rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-pink-500/25"
          >
            <Save className="h-5 w-5 mr-2 inline" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
