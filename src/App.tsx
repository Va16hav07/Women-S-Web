import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { auth } from './pages/firebase'; // 🔥 Import Firebase Auth
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Features from "./pages/Features";
import HowItWorks from "./pages/HowItWorks";
import Contact from "./pages/Contact";
import Login from "./pages/signin";  
import Signup from "./pages/signup"; 
import Dashboard from "./pages/Dashboard";
import ScrollToTop from "./components/ScrollToTop";
import Logout from "./pages/logout";
import { User } from "firebase/auth";

import DangerZones from './pages/DangerZones';
import PrivacySettings from './pages/PrivacySettings';
import NotificationSettings from './pages/NotificationSettings';
import EmergencyContacts from './pages/EmergencyContacts';


const App = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [user, setUser] = useState<User | null>(null); // 🔥 Stores logged-in user

  // 🔥 Track Firebase Authentication State
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Cleanup subscription
  }, []);

  // 🔥 Load Theme from Local Storage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  // 🔥 Protected Route Wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return user ? children : <Navigate to="/sign-in" />;
  };

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        <ScrollToTop />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/features" element={<Features />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/sign-in" element={<Login />} />  {/* ✅ Fixed route */}
              <Route path="/sign-up" element={<Signup />} />  {/* ✅ Fixed route */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/danger-zones" element={<DangerZones />} />
              <Route path="/privacy-settings" element={<PrivacySettings />} />
              <Route path="/notification-settings" element={<NotificationSettings />} />
              <Route path="/emergency-contacts" element={<EmergencyContacts />} />
            </Routes>
          </AnimatePresence>
        </main>

        {/* 🔥 Show Logout Button if User is Logged In */}
        {user && (
          <div className="text-center py-4">
            <h2 className="text-lg font-semibold">Welcome, {user.email}</h2>
            <Logout />
          </div>
        )}

        <Footer />
      </div>
    </Router>
  );
};

export default App;