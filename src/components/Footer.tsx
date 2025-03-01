import { act } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  const location = useLocation();

  // Hide Footer on Dashboard pages
  if (location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/profile-settings')||location.pathname.startsWith('/emergency-contacts')||location.pathname.startsWith('/secure-sharing')||location.pathname.startsWith('/danger-zones')||location.pathname.startsWith('/notification-settings')||location.pathname.startsWith('/settings')) {
    return null;
  }

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 pt-12 pb-8 transition-colors duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-8 w-8 text-pink-600" />
              <span className="font-bold text-xl">SafeGuardian</span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Empowering women with technology for a safer tomorrow. Our mission is to provide innovative safety solutions that give peace of mind.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-500 hover:text-pink-600 transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-600 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/features" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-600 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-600 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/technology" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-600 transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-600 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-600 transition-colors">
                  Safety Tips
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-600 transition-colors">
                  Emergency Contacts
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-600 transition-colors">
                  User Guide
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-600 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-600 transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-pink-600 mt-0.5" />
                <span className="text-gray-600 dark:text-gray-400">
                  123 Safety Street, Secure City, SC 12345
                </span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-pink-600" />
                <span className="text-gray-600 dark:text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-pink-600" />
                <span className="text-gray-600 dark:text-gray-400">info@safeguardian.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-500 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} SafeGuardian. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
