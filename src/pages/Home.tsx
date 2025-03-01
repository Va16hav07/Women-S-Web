import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, MapPin, Bell, Phone, Users, Video, ChevronRight } from 'lucide-react';
import Button from '../components/Button';
import AnimatedSection from '../components/AnimatedSection';
import FeatureCard from '../components/FeatureCard';

const Home: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -right-10 -top-10 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -left-10 top-1/3 w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full opacity-20 blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Empowering Women with <span className="text-pink-600">Safety Technology</span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8">
                  Our innovative alert system uses AI and location tracking to provide real-time protection and peace of mind for women everywhere.
                </p>
              </motion.div>
            </div>
            
            <div className="lg:w-1/2 mt-12 lg:mt-0">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-xl overflow-hidden shadow-2xl">
                  <img 
                    src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                    alt="Woman using safety app" 
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
                    <div className="p-6">
                      <p className="text-white text-lg font-medium">
                        Real-time protection at your fingertips
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Floating elements */}
                <motion.div 
                  className="absolute -top-6 -right-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 flex items-center"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                  <Bell className="h-5 w-5 text-pink-600 mr-2" />
                  <span className="text-sm font-medium">SOS Alert Sent</span>
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3 flex items-center"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
                >
                  <MapPin className="h-5 w-5 text-indigo-600 mr-2" />
                  <span className="text-sm font-medium">Location Tracking</span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Preview Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Safety Features</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Our comprehensive safety system provides multiple layers of protection to keep you safe in any situation.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Bell size={24} />}
              title="SOS Button"
              description="One-tap emergency alert that notifies your contacts and nearby responders with your exact location."
              delay={0.1}
            />
            <FeatureCard
              icon={<Shield size={24} />}
              title="AI Danger Detection"
              description="Advanced algorithms that detect unusual situations and potential threats before they escalate."
              delay={0.2}
            />
            <FeatureCard
              icon={<MapPin size={24} />}
              title="Safe Route Suggestions"
              description="Get recommendations for the safest routes based on real-time data and historical safety records."
              delay={0.3}
            />
            <FeatureCard
              icon={<Users size={24} />}
              title="Nearby Responders"
              description="Connect with verified safety volunteers and authorities in your vicinity for quick assistance."
              delay={0.4}
            />
            <FeatureCard
              icon={<Phone size={24} />}
              title="Emergency Calling"
              description="Automatically call emergency services with your location data when an SOS is triggered."
              delay={0.5}
            />
            <FeatureCard
              icon={<Video size={24} />}
              title="Auto Video Recording"
              description="Discreetly record video evidence when an emergency is detected or manually activated."
              delay={0.6}
            />
          </div>

          <div className="text-center mt-12">
            <Link to="/features">
              <Button variant="outline" icon={<ChevronRight size={20} />}>
                Explore All Features
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Women Worldwide</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Hear from women who have experienced the peace of mind our safety system provides.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection delay={0.1} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80" 
                  alt="Sarah Johnson" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Sarah Johnson</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">College Student</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                "As a student who often walks back to my dorm late at night, this app has given me incredible peace of mind. The safe route feature is a game-changer!"
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1573497620053-ea5300f94f21?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80" 
                  alt="Maya Patel" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Maya Patel</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Working Professional</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                "I had to use the SOS feature once when I felt unsafe, and the response was immediate. My emergency contacts were notified instantly, and I felt protected."
              </p>
            </AnimatedSection>

            <AnimatedSection delay={0.3} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
              <div className="flex items-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&q=80" 
                  alt="Jennifer Lee" 
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold">Jennifer Lee</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Frequent Traveler</p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                "As someone who travels solo frequently, this app has become my essential companion. The AI danger detection has alerted me to potentially risky situations multiple times."
              </p>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;