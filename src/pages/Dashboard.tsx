import React, { useState, useEffect, MouseEvent } from "react";
import {
  Menu, User, LogOut, AlertCircle, Home, Phone, Clock,
  Bell, Users, MapPin, Settings, HelpCircle, Share, Shield,
  AlertTriangle, Navigation, ChevronRight, Heart, X,
  Plus, Trash2, Send, CheckCircle
} from "lucide-react";

// Add this type definition at the top of the file
type Priority = "high" | "medium" | "low";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [routeDisplayed, setRouteDisplayed] = useState<boolean | "loading">(false);
  const [showNotification, setShowNotification] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [contacts, setContacts] = useState<Array<{
    id: number;
    name: string;
    phone: string;
    priority: Priority;
  }>>([
    { id: 1, name: "Sarah Johnson", phone: "555-123-4567", priority: "high" },
    { id: 2, name: "Lisa Taylor", phone: "555-987-6543", priority: "medium" },
  ]);
  const [newContact, setNewContact] = useState<{
    name: string;
    phone: string;
    priority: Priority;
  }>({ name: "", phone: "", priority: "medium" });
  const [showAddContact, setShowAddContact] = useState(false);
  const [alertSent, setAlertSent] = useState<number | null>(null);
  
  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    
    return () => clearInterval(timer);
  }, []);

  // Simulate loading route
  const handleRouteDisplay = () => {
    if (fromAddress.trim() === "" || toAddress.trim() === "") {
      alert("Please enter both 'From' and 'To' addresses");
      return;
    }
    
    // Set loading state
    setRouteDisplayed("loading");
    
    // Simulate API call
    setTimeout(() => {
      setRouteDisplayed(true);
    }, 1500);
  };

  const handleSOS = () => {
    // Animation and feedback for emergency trigger
    const sosButton = document.getElementById("sos-button");
    sosButton?.classList.add("scale-150");
    setTimeout(() => {
      sosButton?.classList.remove("scale-150");
      alert("SOS alert sent to your emergency contacts and nearby authorities!");
    }, 300);
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

  const addContact = () => {
    if (newContact.name.trim() === "" || newContact.phone.trim() === "") {
      alert("Please enter both name and phone number");
      return;
    }
    
    const newId = contacts.length > 0 ? Math.max(...contacts.map(c => c.id)) + 1 : 1;
    setContacts([...contacts, { ...newContact, id: newId }]);
    setNewContact({ name: "", phone: "", priority: "medium" });
    setShowAddContact(false);
  };

  const deleteContact = (id: number) => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  const sendAlert = (id: number) => {
    setAlertSent(id);
    setTimeout(() => {
      setAlertSent(null);
    }, 3000);
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
            { icon: <Phone className="h-5 w-5" />, label: "Emergency Contacts" },
            { icon: <Clock className="h-5 w-5" />, label: "Safety Timer" },
            { icon: <Share className="h-5 w-5" />, label: "Secure Sharing" },
            { icon: <AlertTriangle className="h-5 w-5" />, label: "Danger Zones" },
            { icon: <Users className="h-5 w-5" />, label: "Be a Nearby Responder" },
            { icon: <Settings className="h-5 w-5" />, label: "Settings" }
          ].map((item, index) => (
            <button 
              key={index}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 transform hover:translate-x-2 ${darkMode ? "hover:bg-gray-700/70" : "hover:bg-gray-100"}`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {item.icon}
              <span>{item.label}</span>
              <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
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
                <span className="hidden md:inline font-medium">Emma Wilson</span>
              </button>
              
              {userDropdown && (
                <div className={`absolute right-0 mt-3 w-64 ${darkMode ? "bg-gray-800" : "bg-white"} shadow-xl rounded-xl overflow-hidden z-50 animate-fadeIn`}>
                  <div className={`p-4 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center mr-3 shadow-md">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-lg">Emma Wilson</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">emma.w@example.com</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-2">
                    {["Profile Settings", "Privacy Settings", "Notification Preferences"].map((item, index) => (
                      <button 
                        key={index} 
                        className={`block w-full p-3 text-left rounded-lg ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"} transition-colors duration-200`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        {item}
                      </button>
                    ))}
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
        {/* Notification Banner with Animation */}
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
                <button className={`px-3 py-1 text-xs rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>Satellite</button>
                <button className={`px-3 py-1 text-xs rounded-full ${darkMode ? "bg-pink-800" : "bg-pink-100"} ${darkMode ? "text-pink-100" : "text-pink-700"}`}>Traffic</button>
              </div>
            </div>
            <div className={`h-[60vh] ${darkMode ? "bg-gray-700" : "bg-gray-200"} flex items-center justify-center overflow-hidden relative`}>
              {/* Map Placeholder with Animation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div 
                  className={`w-full h-full ${routeDisplayed === "loading" ? "animate-pulse" : ""}`}
                  style={{
                    background: `url('https://via.placeholder.com/600x400') center/cover`,
                    filter: darkMode ? "grayscale(50%) brightness(0.7)" : "none",
                    transition: "filter 0.5s ease"
                  }}
                >
                </div>
                
                {/* Map Overlay Elements */}
                {routeDisplayed === true && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4/5 h-1 bg-pink-500/70 rounded-full animate-fadeIn" style={{ filter: "drop-shadow(0 0 8px rgba(236, 72, 153, 0.6))" }}></div>
                  </div>
                )}
                
                {/* Loading Indicator */}
                {routeDisplayed === "loading" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="w-12 h-12 rounded-full border-4 border-pink-200 border-t-pink-600 animate-spin"></div>
                  </div>
                )}
                
                {/* Map Info Overlay */}
                <div className="absolute bottom-4 right-4">
                  <div className={`${darkMode ? "bg-gray-800/90" : "bg-white/90"} backdrop-blur-sm p-3 rounded-lg shadow-lg`}>
                    <p className="text-sm font-medium">{routeDisplayed === true ? "Route Active" : "Ready for Navigation"}</p>
                    <p className="text-xs text-gray-500">
                      {routeDisplayed === true 
                        ? `${fromAddress} → ${toAddress}` 
                        : "Enter addresses below"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
                onClick={handleRouteDisplay}
                className={`${darkMode ? "bg-gradient-to-r from-pink-600 to-purple-700" : "bg-gradient-to-r from-pink-500 to-purple-600"} text-white font-medium py-3 px-6 rounded-xl flex items-center shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-pink-500/25`}
              >
                <Navigation className="h-5 w-5 mr-2" />
                Show Safe Route
              </button>
            </div>
          </div>
          
          {/* Emergency Contacts Section */}
          <div className={`${darkMode ? "bg-gray-800" : "bg-white"} rounded-2xl shadow-xl p-6 transform transition-all duration-300 hover:shadow-2xl`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center">
                <Phone className={`h-5 w-5 mr-2 ${darkMode ? "text-pink-400" : "text-pink-600"}`} />
                Emergency Contacts
              </h2>
              <button
                onClick={() => setShowAddContact(!showAddContact)}
                className={`${darkMode ? "bg-pink-600 hover:bg-pink-700" : "bg-pink-500 hover:bg-pink-600"} text-white p-2 rounded-full shadow-md transform transition-all duration-300 hover:scale-110 flex items-center justify-center`}
              >
                {showAddContact ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
              </button>
            </div>
            
            {/* Add Contact Form with Animation */}
            {showAddContact && (
              <div className={`mb-6 p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-pink-50"} animate-fadeIn`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Contact Name"
                      className={`w-full p-3 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-600 focus:bg-gray-600" : "border-pink-200 bg-white"} focus:ring-2 focus:ring-pink-500 focus:border-pink-500`}
                      value={newContact.name}
                      onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Phone Number"
                      className={`w-full p-3 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-600 focus:bg-gray-600" : "border-pink-200 bg-white"} focus:ring-2 focus:ring-pink-500 focus:border-pink-500`}
                      value={newContact.phone}
                      onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <select
                      className={`flex-1 p-3 rounded-lg border ${darkMode ? "border-gray-600 bg-gray-600" : "border-pink-200 bg-white"}`}
                      value={newContact.priority}
                      onChange={(e) => setNewContact({...newContact, priority: e.target.value as Priority})}
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="low">Low Priority</option>
                    </select>
                    <button
                      onClick={addContact}
                      className={`px-4 py-2 ${darkMode ? "bg-gradient-to-r from-pink-600 to-purple-700" : "bg-gradient-to-r from-pink-500 to-purple-600"} text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300`}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {/* Contact List with Enhanced UI */}
            <div className={`overflow-hidden rounded-xl ${contacts.length === 0 ? "border-2 border-dashed border-gray-300 dark:border-gray-700 p-8 flex flex-col items-center justify-center" : ""}`}>
              {contacts.length === 0 ? (
                <div className="text-center">
                  <Phone className={`h-12 w-12 mx-auto mb-4 ${darkMode ? "text-gray-600" : "text-gray-400"}`} />
                  <p className="text-gray-500 dark:text-gray-400 mb-4">No emergency contacts added yet</p>
                  <button
                    onClick={() => setShowAddContact(true)}
                    className={`px-4 py-2 ${darkMode ? "bg-pink-600 hover:bg-pink-700" : "bg-pink-500 hover:bg-pink-600"} text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300`}
                  >
                    Add Your First Contact
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {contacts.map((contact, index) => (
                    <div 
                      key={contact.id}
                      className={`p-4 rounded-xl ${darkMode ? "bg-gray-700" : "bg-white"} border ${darkMode ? "border-gray-600" : "border-gray-200"} shadow-sm transform transition-all duration-300 hover:shadow-md hover:scale-[1.01] ${
                        contact.priority === 'high' 
                          ? 'border-l-4 border-l-red-500' 
                          : contact.priority === 'medium'
                            ? 'border-l-4 border-l-yellow-500'
                            : 'border-l-4 border-l-green-500'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className={`w-10 h-10 rounded-full ${
                            contact.priority === 'high' 
                              ? 'bg-red-100 dark:bg-red-900/30' 
                              : contact.priority === 'medium'
                                ? 'bg-yellow-100 dark:bg-yellow-900/30'
                                : 'bg-green-100 dark:bg-green-900/30'
                          } flex items-center justify-center mr-3`}>
                            <Phone className={`h-5 w-5 ${
                              contact.priority === 'high' 
                                ? 'text-red-600 dark:text-red-400' 
                                : contact.priority === 'medium'
                                  ? 'text-yellow-600 dark:text-yellow-400'
                                  : 'text-green-600 dark:text-green-400'
                            }`} />
                          </div>
                          <div>
                            <p className="font-medium">{contact.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{contact.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {alertSent === contact.id ? (
                            <div className="flex items-center text-green-500 animate-pulse">
                              <CheckCircle className="h-5 w-5 mr-1" />
                              <span className="text-sm">Alert sent!</span>
                            </div>
                          ) : (
                            <>
                              <button
                                onClick={() => sendAlert(contact.id)}
                                className={`p-2 rounded-lg ${darkMode ? "bg-pink-900/40 text-pink-100 hover:bg-pink-800/60" : "bg-pink-100 text-pink-800 hover:bg-pink-200"} transition-all duration-200`}
                              >
                                <Send className="h-4 w-4" />
                              </button>
                                                            <button
                                                              onClick={() => deleteContact(contact.id)}
                                                              className={`p-2 rounded-lg ${darkMode ? "bg-red-900/40 text-red-100 hover:bg-red-800/60" : "bg-red-100 text-red-800 hover:bg-red-200"} transition-all duration-200`}
                                                            >
                                                              <Trash2 className="h-4 w-4" />
                                                            </button>
                                                          </>
                                                        )}
                                                      </div>
                                                    </div>
                                                  </div>
                                                ))}
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                        
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
                                  </div>
                                );
                              };
                              
                              export default Dashboard;