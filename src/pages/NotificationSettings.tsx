import { useState } from 'react';
import { 
  Bell,
  BellOff,
  BellRing,
  Shield,
  AlertCircle,
  Smartphone,
  Map,
  Clock,
  Users,
  ArrowLeft,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface NotificationOption {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: JSX.Element;
  category: 'alerts' | 'reminders' | 'updates' | 'system';
  priority?: 'high' | 'medium' | 'low';
}

const NotificationSettings = () => {
  const [notificationOptions, setNotificationOptions] = useState<NotificationOption[]>([
    {
      id: 'sos-alerts',
      title: 'SOS Alerts',
      description: 'Receive alerts when someone in your trusted circle triggers an SOS',
      enabled: true,
      icon: <AlertCircle className="h-5 w-5" />,
      category: 'alerts',
      priority: 'high'
    },
    {
      id: 'danger-zone',
      title: 'Danger Zone Warnings',
      description: 'Get notified when entering areas with safety concerns',
      enabled: true,
      icon: <AlertTriangle className="h-5 w-5" />,
      category: 'alerts',
      priority: 'high'
    },
    {
      id: 'safe-arrival',
      title: 'Safe Arrival Notifications',
      description: 'Notify your trusted contacts when you arrive safely',
      enabled: true,
      icon: <CheckCircle className="h-5 w-5" />,
      category: 'alerts',
      priority: 'medium'
    },
    {
      id: 'safety-timer',
      title: 'Safety Timer Reminders',
      description: 'Receive reminders to check in when your safety timer is active',
      enabled: true,
      icon: <Clock className="h-5 w-5" />,
      category: 'reminders',
      priority: 'medium'
    },
    {
      id: 'nearby-help',
      title: 'Nearby Help Requests',
      description: 'Get notified when someone nearby needs assistance',
      enabled: false,
      icon: <Map className="h-5 w-5" />,
      category: 'alerts',
      priority: 'medium'
    },
    {
      id: 'app-updates',
      title: 'App Updates',
      description: 'Stay informed about new safety features and app updates',
      enabled: true,
      icon: <Smartphone className="h-5 w-5" />,
      category: 'updates',
      priority: 'low'
    },
    {
      id: 'community',
      title: 'Community Alerts',
      description: 'Receive information about safety issues in your community',
      enabled: true,
      icon: <Users className="h-5 w-5" />,
      category: 'system',
      priority: 'low'
    },
  ]);

  const [darkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(true);

  const toggleOption = (id: string) => {
    setNotificationOptions(options =>
      options.map(option =>
        option.id === id ? { ...option, enabled: !option.enabled } : option
      )
    );
  };

  const getOptionsForCategory = (category: string) => {
    return notificationOptions.filter(option => option.category === category);
  };

  const getPriorityColor = (priority: string | undefined, enabled: boolean) => {
    if (!enabled) return darkMode ? 'bg-gray-600' : 'bg-gray-300';
    
    switch (priority) {
      case 'high':
        return darkMode ? 'bg-red-500' : 'bg-red-500';
      case 'medium':
        return darkMode ? 'bg-amber-500' : 'bg-amber-500';
      case 'low':
        return darkMode ? 'bg-green-500' : 'bg-green-500';
      default:
        return darkMode ? 'bg-pink-600' : 'bg-pink-500';
    }
  };

  const toggleAll = (category: string, value: boolean) => {
    setNotificationOptions(options =>
      options.map(option =>
        option.category === category ? { ...option, enabled: value } : option
      )
    );
  };

  // Handle saving notification settings
  const saveSettings = () => {
    // Simulate saving - in a real app, this would save to a backend
    const notification = document.getElementById('save-notification');
    if (notification) {
      notification.classList.remove('translate-y-20', 'opacity-0');
      notification.classList.add('translate-y-0', 'opacity-100');
      
      setTimeout(() => {
        notification.classList.remove('translate-y-0', 'opacity-100');
        notification.classList.add('translate-y-20', 'opacity-0');
      }, 3000);
    }
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
              <Bell className={`h-6 w-6 mr-2 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />
              Notification Settings
            </h1>
            <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Manage how and when you receive notifications
            </p>
          </div>
        </div>

        {/* Delivery Methods Section */}
        <div className={`mb-8 p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Smartphone className={`h-5 w-5 mr-2 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />
            Notification Delivery Methods
          </h2>
          
          <div className="space-y-4">
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} flex items-center justify-between`}>
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                  <Bell className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Push Notifications</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Receive notifications on your device
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPushNotifications(!pushNotifications)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  pushNotifications 
                    ? (darkMode ? 'bg-pink-600' : 'bg-pink-500') 
                    : (darkMode ? 'bg-gray-600' : 'bg-gray-300')
                }`}
              >
                <span 
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    pushNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} flex items-center justify-between`}>
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">Email Notifications</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Receive notifications via email
                  </p>
                </div>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  emailNotifications 
                    ? (darkMode ? 'bg-pink-600' : 'bg-pink-500') 
                    : (darkMode ? 'bg-gray-600' : 'bg-gray-300')
                }`}
              >
                <span 
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    emailNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            
            <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} flex items-center justify-between`}>
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-600' : 'bg-white'} shadow-sm`}>
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium">SMS Notifications</h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Receive notifications via text message
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSmsNotifications(!smsNotifications)}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  smsNotifications 
                    ? (darkMode ? 'bg-pink-600' : 'bg-pink-500') 
                    : (darkMode ? 'bg-gray-600' : 'bg-gray-300')
                }`}
              >
                <span 
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    smsNotifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notification Categories */}
        {['alerts', 'reminders', 'updates', 'system'].map((category) => {
          const categoryOptions = getOptionsForCategory(category);
          if (categoryOptions.length === 0) return null;

          return (
            <div 
              key={category}
              className={`mb-8 p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold capitalize flex items-center">
                  {category === 'alerts' && <Bell className={`h-5 w-5 mr-2 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />}
                  {category === 'reminders' && <Clock className={`h-5 w-5 mr-2 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />}
                  {category === 'updates' && <RefreshCw className={`h-5 w-5 mr-2 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />}
                  {category === 'system' && <Shield className={`h-5 w-5 mr-2 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />}
                  {category} Notifications
                </h2>
                
                <div className="flex items-center space-x-2">
                  <button 
                    className={`text-xs py-1 px-3 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                    onClick={() => toggleAll(category, true)}
                  >
                    Enable All
                  </button>
                  <button 
                    className={`text-xs py-1 px-3 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
                    onClick={() => toggleAll(category, false)}
                  >
                    Disable All
                  </button>
                </div>
              </div>
              
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
                        <div className="flex items-center">
                          <h3 className="font-medium">{option.title}</h3>
                          {option.priority && (
                            <div 
                              className={`ml-2 w-2 h-2 rounded-full ${getPriorityColor(option.priority, option.enabled)}`}
                              title={`${option.priority} priority`}
                            ></div>
                          )}
                        </div>
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

        {/* Quiet Hours Section */}
        <div className={`mb-8 p-6 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <BellOff className={`h-5 w-5 mr-2 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`} />
            Quiet Hours
          </h2>
          
          <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-medium">Enable Quiet Hours</h3>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Only receive high priority notifications during these hours
                </p>
              </div>
              <button
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  darkMode ? 'bg-pink-600' : 'bg-pink-500'
                }`}
              >
                <span 
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-5`}
                />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  Start Time
                </label>
                <select className={`block w-full rounded-md py-2 px-3 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } shadow-sm focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50`}>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{`${i.toString().padStart(2, '0')}:00`}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
                  End Time
                </label>
                <select className={`block w-full rounded-md py-2 px-3 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                } shadow-sm focus:border-pink-500 focus:ring focus:ring-pink-500 focus:ring-opacity-50`}>
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{`${i.toString().padStart(2, '0')}:00`}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <button
            onClick={saveSettings}
            className={`px-6 py-3 rounded-xl ${
              darkMode 
                ? 'bg-gradient-to-r from-pink-600 to-purple-700' 
                : 'bg-gradient-to-r from-pink-500 to-purple-600'
            } text-white font-medium shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-pink-500/25 flex items-center`}
          >
            <Bell className="h-5 w-5 mr-2" />
            Save Notification Settings
          </button>
        </div>
      </div>
      
      {/* Save Notification Toast */}
      <div 
        id="save-notification" 
        className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 translate-y-20 opacity-0 transition-all duration-300 px-6 py-3 rounded-xl ${
          darkMode ? 'bg-green-700' : 'bg-green-500'
        } text-white shadow-lg flex items-center space-x-2`}
      >
        <CheckCircle className="h-5 w-5" />
        <span>Notification settings saved successfully!</span>
      </div>
    </div>
  );
};

// Add missing imports
const Mail = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const MessageSquare = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const RefreshCw = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M21 2v6h-6"/>
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8"/>
    <path d="M3 22v-6h6"/>
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16"/>
  </svg>
);

export default NotificationSettings;
