import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, Shield, Sun, Moon } from 'lucide-react';

interface NavbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ theme, toggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsOpen(false);
  }, [location]);

  // Hide Navbar on the Dashboard page
if (location.pathname.startsWith('/dashboard') || location.pathname.toLowerCase().startsWith("/profile-settings")||location.pathname.toLowerCase().startsWith("/emergency-contacts")||location.pathname.startsWith('/secure-sharing')||location.pathname.startsWith('/danger-zones')||location.pathname.startsWith('/notification-settings')||location.pathname.startsWith('/settings')) {
    return null;
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/features' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={`w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-pink-600" />
            <span className="font-bold text-xl">SafeGuardian</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`transition-colors duration-300 hover:text-pink-600 ${
                  location.pathname === link.path
                    ? 'text-pink-600 font-medium'
                    : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Right Side - Theme Toggle & Auth Buttons */}
          <div className="flex items-center space-x-4">
            {/* Sign In & Sign Up Buttons */}
            <Link to="/sign-in">
              <button className="border border-pink-600 text-pink-600 px-4 py-2 rounded-lg hover:bg-pink-100 transition">
                Sign In
              </button>
            </Link>

            <Link to="/sign-up">
              <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition">
                Sign Up
              </button>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden bg-white dark:bg-gray-900 shadow-lg"
        >
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`py-2 transition-colors duration-300 hover:text-pink-600 ${
                    location.pathname === link.path
                      ? 'text-pink-600 font-medium'
                      : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Sign In & Sign Up for Mobile */}
              <Link to="/sign-in">
                <button className="border border-pink-600 text-pink-600 w-full px-4 py-2 rounded-lg hover:bg-pink-100 transition">
                  Sign In
                </button>
              </Link>

              <Link to="/sign-up">
                <button className="bg-pink-600 text-white w-full px-4 py-2 rounded-lg hover:bg-pink-700 transition">
                  Sign Up
                </button>
              </Link>
            </nav>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default Navbar;
