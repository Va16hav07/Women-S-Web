import { useState } from 'react';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  MapPin, 
  Bell, 
  Users, 
  Phone,
  Clock,
  ArrowLeft,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface PrivacyOption {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: JSX.Element;
  category: 'location' | 'profile' | 'notifications' | 'emergency';
}

const PrivacySettings = () => {
  const [privacyOptions, setPrivacyOptions] = useState<PrivacyOption[]>([
    {
      id: 'location-tracking',
      title: 'Location Tracking',
      description: 'Allow trusted contacts to view your real-time location',
      enabled: true,
      icon: <MapPin className="h-5 w-5" />,
      category: 'location'
    },
    {
      id: 'profile-visibility',
      title: 'Profile Visibility',
      description: 'Control who can view your profile information',
      enabled: false,
      icon: <Eye className="h-5 w-5" />,
      category: 'profile'
    },
    {
      id: 'emergency-alerts',
      title: 'Emergency Alerts',
      description: 'Send automatic alerts to emergency contacts when triggered',
      enabled: true,
      icon: <Bell className="h-5 w-5" />,
      category: 'emergency'
    },
    {
      id: 'trusted-contacts',
      title: 'Trusted Contacts Visibility',
      description: 'Show your status to trusted contacts only',
      enabled: true,
      icon: <Users className="h-5 w-5" />,
      category: 'profile'
    },
    {
      id: 'emergency-number',
      title: 'Emergency Number Privacy',
      description: 'Hide emergency contact numbers from other users',
      enabled: true,
      icon: <Phone className="h-5 w-5" />,
      category: 'emergency'
    },
    {
      id: 'activity-history',
      title: 'Activity History',
      description: 'Store and show your travel history to trusted contacts',
      enabled: false,
      icon: <Clock className="h-5 w-5" />,
      category: 'location'
    }
  ]);

  const [darkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleOption = (id: string) => {
    setPrivacyOptions(options =>
      options.map(option =>
        option.id === id ? { ...option, enabled: !option.enabled } : option
      )
    );
  };

  const getOptionsForCategory = (category: string) => {
    return privacyOptions.filter(option => option.category === category);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link 
            to="/dashboard" 
            className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-200'} transition-colors duration-200 mr-4`}
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Shield className={`h-6 w-6 mr-2 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />
              Privacy Settings
            </h1>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage your privacy and safety preferences
            </p>
          </div>
        </div>

        {/* Privacy Categories */}
        {['location', 'profile', 'emergency', 'notifications'].map((category) => {
          const categoryOptions = getOptionsForCategory(category);
          if (categoryOptions.length === 0) return null;

          return (
            <div 
              key={category}
              className={`mb-8 p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <h2 className="text-lg font-semibold capitalize mb-4 flex items-center">
                <Lock className={`h-5 w-5 mr-2 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />
                {category} Privacy
              </h2>
              <div className="space-y-4">
                {categoryOptions.map((option) => (
                  <div 
                    key={option.id}
                    className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} flex items-center justify-between transition-all duration-200 hover:shadow-md`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                        {option.icon}
                      </div>
                      <div>
                        <h3 className="font-medium">{option.title}</h3>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {option.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleOption(option.id)}
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        option.enabled 
                          ? (darkMode ? 'bg-pink-600' : 'bg-pink-500') 
                          : (darkMode ? 'bg-gray-600' : 'bg-gray-300')
                      }`}
                    >
                      <span 
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          option.enabled ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button
            className={`px-6 py-3 rounded-xl ${
              darkMode 
                ? 'bg-gradient-to-r from-pink-600 to-purple-700' 
                : 'bg-gradient-to-r from-pink-500 to-purple-600'
            } text-white font-medium shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-pink-500/25 flex items-center`}
          >
            <Shield className="h-5 w-5 mr-2" />
            Save Privacy Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
