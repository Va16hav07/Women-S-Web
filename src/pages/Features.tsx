import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, MapPin, Users, Phone, Video, Clock, Lock, Headphones, MessageSquare, AlertTriangle, Smartphone } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import FeatureCard from '../components/FeatureCard';

const Features: React.FC = () => {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-pink-600 to-indigo-600 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Comprehensive Safety Features
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl opacity-90 mb-8"
            >
              Discover how our innovative technology works together to keep you safe in any situation.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Primary Features */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Primary Safety Features</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our core features are designed to provide immediate assistance in emergency situations.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Bell size={24} />}
              title="SOS Button"
              description="One-tap emergency alert that notifies your contacts and nearby responders with your exact location. Accessible from the home screen or via voice command."
              delay={0.1}
            />
            <FeatureCard
              icon={<Shield size={24} />}
              title="AI Danger Detection"
              description="Advanced algorithms analyze your surroundings, movement patterns, and audio to detect unusual situations and potential threats before they escalate."
              delay={0.2}
            />
            <FeatureCard
              icon={<MapPin size={24} />}
              title="Safe Route Suggestions"
              description="Get recommendations for the safest routes based on real-time data, crime statistics, lighting conditions, and historical safety records."
              delay={0.3}
            />
            <FeatureCard
              icon={<Users size={24} />}
              title="Nearby Responders"
              description="Connect with verified safety volunteers, security personnel, and authorities in your vicinity for quick assistance during emergencies."
              delay={0.4}
            />
            <FeatureCard
              icon={<Phone size={24} />}
              title="Emergency Calling"
              description="Automatically call emergency services with your location data when an SOS is triggered, even if you're unable to speak or interact with your phone."
              delay={0.5}
            />
            <FeatureCard
              icon={<Video size={24} />}
              title="Auto Video Recording"
              description="Discreetly record video evidence when an emergency is detected or manually activated, with automatic cloud backup for security and evidence."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <AnimatedSection className="lg:w-1/2">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                  alt="Woman using safety app" 
                  className="rounded-xl shadow-xl"
                />
                
                {/* Floating UI elements */}
                <motion.div 
                  className="absolute top-4 right-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-3"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Bell className="h-6 w-6 text-red-600" />
                </motion.div>
                
                <motion.div 
                  className="absolute bottom-4 left-4 bg-white dark:bg-gray-900 rounded-lg shadow-lg p-3 flex items-center"
                  animate={{ y: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                >
                  <MapPin className="h-5 w-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium">Location Shared</span>
                </motion.div>
              </div>
            </AnimatedSection>
            
            <AnimatedSection direction="left" className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">SOS Alert System</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Our SOS system is designed for speed and reliability when you need it most. With just one tap, you can:
              </p>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center mt-1 mr-3">
                    <Bell className="h-3 w-3 text-pink-600" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Alert your emergency contacts with your precise location</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center mt-1 mr-3">
                    <MapPin className="h-3 w-3 text-pink-600" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Share your real-time location with trusted contacts and authorities</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center mt-1 mr-3">
                    <Video className="h-3 w-3 text-pink-600" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Automatically begin recording audio and video as evidence</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center mt-1 mr-3">
                    <Phone className="h-3 w-3 text-pink-600" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Connect with emergency services with your information pre-shared</p>
                </li>
              </ul>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Secondary Features */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Additional Safety Features</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Beyond emergencies, our system provides comprehensive safety tools for everyday use.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Clock size={24} />}
              title="Safety Timer"
              description="Set a timer for activities like walking home or meeting someone new. If not deactivated in time, alerts are automatically sent to your contacts."
              delay={0.1}
            />
            <FeatureCard
              icon={<Lock size={24} />}
              title="Secure Sharing"
              description="Share your journey details and real-time location with trusted contacts for specific durations without triggering emergency alerts."
              delay={0.2}
            />
            <FeatureCard
              icon={<Headphones size={24} />}
              title="Audio Monitoring"
              description="AI-powered system that can detect distress in your voice or suspicious sounds in your environment, even when the app is running in the background."
              delay={0.3}
            />
            <FeatureCard
              icon={<MessageSquare size={24} />}
              title="Safety Check-ins"
              description="Scheduled check-ins that prompt you to confirm your safety. Failure to respond triggers escalating alerts to your emergency contacts."
              delay={0.4}
            />
            <FeatureCard
              icon={<AlertTriangle size={24} />}
              title="Danger Zone Alerts"
              description="Receive notifications when entering areas with higher safety risks based on real-time data and historical incident reports."
              delay={0.5}
            />
            <FeatureCard
              icon={<Smartphone size={24} />}
              title="Offline Mode"
              description="Core safety features that work even without internet connection, ensuring you're protected in areas with poor connectivity."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Feature Comparison</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              See how our comprehensive safety system compares to basic safety apps.
            </p>
          </AnimatedSection>

          <div className="overflow-x-auto">
            <table className="w-full bg-white dark:bg-gray-900 rounded-xl shadow-md">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800">
                  <th className="px-6 py-4 text-left text-gray-700 dark:text-gray-300">Feature</th>
                  <th className="px-6 py-4 text-center text-gray-700 dark:text-gray-300">SafeGuardian</th>
                  <th className="px-6 py-4 text-center text-gray-700 dark:text-gray-300">Basic Safety Apps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">SOS Alert</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">AI Danger Detection</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                  <td className="px-6 py-4 text-center text-red-600">✗</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Safe Route Suggestions</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                  <td className="px-6 py-4 text-center text-red-600">✗</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Nearby Responders Network</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                  <td className="px-6 py-4 text-center text-red-600">✗</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Auto Video Recording</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                  <td className="px-6 py-4 text-center text-red-600">✗</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Voice-Activated SOS</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                  <td className="px-6 py-4 text-center text-red-600">✗</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Offline Functionality</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                  <td className="px-6 py-4 text-center text-red-600">✗</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-gray-700 dark:text-gray-300">Safety Check-ins</td>
                  <td className="px-6 py-4 text-center text-green-600">✓</td>
                  <td className="px-6 py-4 text-center text-yellow-600">Limited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;