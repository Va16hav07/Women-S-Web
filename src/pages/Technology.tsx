import React from 'react';
import { motion } from 'framer-motion';
import { LogIn, MapPin, Shield, Bell, Users, FileText, ChevronRight, ChevronDown } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import StepCard from '../components/StepCard';

const HowItWorks: React.FC = () => {
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
              How SafeGuardian Works
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl opacity-90 mb-8"
            >
              A comprehensive guide to our end-to-end safety system
            </motion.p>
          </div>
        </div>
      </section>

      {/* Step by Step Guide */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">The Safety Process</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Follow these steps to understand how our system protects you from start to finish.
            </p>
          </AnimatedSection>

          <div className="max-w-4xl mx-auto space-y-8">
            <StepCard
              number={1}
              icon={<LogIn size={20} />}
              title="User Registration & Setup"
              description="Create your account and set up your profile with emergency contacts, medical information, and personal details that might be helpful in an emergency situation."
              delay={0.1}
            />
            
            <div className="flex justify-center">
              <ChevronDown className="text-pink-600 h-8 w-8" />
            </div>
            
            <StepCard
              number={2}
              icon={<MapPin size={20} />}
              title="Live Location Tracking"
              description="Once activated, the app begins secure tracking of your location. This data is encrypted and only shared with your emergency contacts when needed."
              delay={0.2}
            />
            
            <div className="flex justify-center">
              <ChevronDown className="text-pink-600 h-8 w-8" />
            </div>
            
            <StepCard
              number={3}
              icon={<Shield size={20} />}
              title="AI-Based Danger Detection"
              description="Our advanced algorithms continuously monitor for unusual patterns, suspicious sounds, or sudden movements that might indicate danger."
              delay={0.3}
            />
            
            <div className="flex justify-center">
              <ChevronDown className="text-pink-600 h-8 w-8" />
            </div>
            
            <StepCard
              number={4}
              icon={<Bell size={20} />}
              title="Alert System Activation"
              description="When danger is detected or you manually trigger an SOS, the system immediately activates multiple alert channels to ensure help arrives quickly."
              delay={0.4}
            />
            
            <div className="flex justify-center">
              <ChevronDown className="text-pink-600 h-8 w-8" />
            </div>
            
            <StepCard
              number={5}
              icon={<Users size={20} />}
              title="Emergency Contact Notification"
              description="Your pre-selected emergency contacts receive instant alerts with your real-time location, situation details, and direct communication options."
              delay={0.5}
            />
            
            <div className="flex justify-center">
              <ChevronDown className="text-pink-600 h-8 w-8" />
            </div>
            
            <StepCard
              number={6}
              icon={<FileText size={20} />}
              title="Incident Reports & Follow-up"
              description="After each alert, the system generates detailed reports for authorities and provides follow-up resources and support options."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Flow Chart */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">System Flow</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Visual representation of how our safety system processes and responds to potential threats.
            </p>
          </AnimatedSection>

          <div className="max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute inset-0 z-0">
              {/* Connecting lines for the flowchart */}
              <svg className="w-full h-full" viewBox="0 0 1000 600" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M500 100 L500 150 L200 150 L200 200" 
                  stroke="currentColor" 
                  className="text-pink-300 dark:text-pink-800" 
                  strokeWidth="3" 
                  strokeDasharray="5 5"
                />
                <path 
                  d="M500 100 L500 150 L800 150 L800 200" 
                  stroke="currentColor" 
                  className="text-pink-300 dark:text-pink-800" 
                  strokeWidth="3" 
                  strokeDasharray="5 5"
                />
                <path 
                  d="M200 280 L200 330 L500 330 L500 380" 
                  stroke="currentColor" 
                  className="text-pink-300 dark:text-pink-800" 
                  strokeWidth="3" 
                  strokeDasharray="5 5"
                />
                <path 
                  d="M800 280 L800 330 L500 330 L500 380" 
                  stroke="currentColor" 
                  className="text-pink-300 dark:text-pink-800" 
                  strokeWidth="3" 
                  strokeDasharray="5 5"
                />
                <path 
                  d="M500 460 L500 510" 
                  stroke="currentColor" 
                  className="text-pink-300 dark:text-pink-800" 
                  strokeWidth="3" 
                  strokeDasharray="5 5"
                />
              </svg>
            </div>

            <div className="relative z-10">
              {/* Top node */}
              <AnimatedSection className="flex justify-center mb-12">
                <motion.div 
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-64 text-center"
                  whileHover={{ y: -5 }}
                >
                  <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 mb-4">
                    <LogIn size={24} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">User Activation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">App launch and authentication</p>
                </motion.div>
              </AnimatedSection>

              {/* Second level - two nodes */}
              <div className="flex flex-col md:flex-row justify-between mb-12 space-y-8 md:space-y-0">
                <AnimatedSection delay={0.1} className="md:w-5/12">
                  <motion.div 
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6"
                    whileHover={{ y: -5 }}
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 mb-4">
                      <MapPin size={24} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Location Services</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      GPS tracking and geofencing activate to monitor user location and establish safe zones.
                    </p>
                  </motion.div>
                </AnimatedSection>

                <AnimatedSection delay={0.2} className="md:w-5/12">
                  <motion.div 
                    className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6"
                    whileHover={{ y: -5 }}
                  >
                    <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 mb-4">
                      <Shield size={24} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Monitoring Systems</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      AI algorithms begin analyzing movement patterns, audio, and environmental factors.
                    </p>
                  </motion.div>
                </AnimatedSection>
              </div>

              {/* Third level - central node */}
              <AnimatedSection delay={0.3} className="flex justify-center mb-12">
                <motion.div 
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full md:w-2/3"
                  whileHover={{ y: -5 }}
                >
                  <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 mb-4">
                    <Bell size={24} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Threat Detection & Response</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    System evaluates potential threats through AI analysis or manual SOS activation. 
                    When a threat is confirmed, multiple response protocols are triggered simultaneously.
                  </p>
                </motion.div>
              </AnimatedSection>

              {/* Fourth level - bottom node */}
              <AnimatedSection delay={0.4} className="flex justify-center">
                <motion.div 
                  className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 w-full md:w-2/3"
                  whileHover={{ y: -5 }}
                >
                  <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 mb-4">
                    <Users size={24} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">Multi-Channel Alert Distribution</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Alerts sent to emergency contacts, nearby responders, and authorities with location data, 
                    situation details, and evidence collection initiated.
                  </p>
                </motion.div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Common questions about how our safety system works.
            </p>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatedSection delay={0.1}>
              <details className="group bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                  <span>How accurate is the location tracking?</span>
                  <ChevronRight className="h-5 w-5 text-pink-600 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-6 pt-0 text-gray-600 dark:text-gray-400">
                  <p>
                    Our system uses a combination of GPS, Wi-Fi positioning, and cellular triangulation to provide accuracy within 2-5 meters in most conditions. In areas with poor GPS signal, the system falls back to the most accurate method available and notifies emergency contacts of the potential accuracy range.
                  </p>
                </div>
              </details>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <details className="group bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                  <span>What happens if my phone battery dies during an emergency?</span>
                  <ChevronRight className="h-5 w-5 text-pink-600 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-6 pt-0 text-gray-600 dark:text-gray-400">
                  <p>
                    The system is designed to send a final alert with your last known location if it detects your battery is critically low. Additionally, the system periodically uploads location data to our secure servers, so emergency contacts can see your last recorded position even if your phone dies completely.
                  </p>
                </div>
              </details>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <details className="group bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                  <span>How does the AI detect potential danger?</span>
                  <ChevronRight className="h-5 w-5 text-pink-600 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-6 pt-0 text-gray-600 dark:text-gray-400">
                  <p>
                    Our AI system analyzes multiple factors including:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Unusual movement patterns (sudden running, falling)</li>
                    <li>Audio cues (raised voices, sounds of distress)</li>
                    <li>Deviation from normal routes or schedules</li>
                    <li>Entry into areas with higher safety risks</li>
                    <li>Unusual phone handling (shaking, dropping)</li>
                  </ul>
                  <p className="mt-2">
                    The AI is trained on millions of data points and continuously improves its accuracy through machine learning.
                  </p>
                </div>
              </details>
            </AnimatedSection>

            <AnimatedSection delay={0.4}>
              <details className="group bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                  <span>Who are the "nearby responders" and how are they verified?</span>
                  <ChevronRight className="h-5 w-5 text-pink-600 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-6 pt-0 text-gray-600 dark:text-gray-400">
                  <p>
                    Nearby responders include:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>Verified security personnel from partner organizations</li>
                    <li>Off-duty police officers who opt into the program</li>
                    <li>Trained safety volunteers who have passed background checks</li>
                    <li>Staff at partner businesses who have received safety training</li>
                  </ul>
                  <p className="mt-2">
                    All responders undergo thorough background checks, training, and must provide government ID verification before joining the network.
                  </p>
                </div>
              </details>
            </AnimatedSection>

            <AnimatedSection delay={0.5}>
              <details className="group bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                  <span>What happens if I accidentally trigger an SOS alert?</span>
                  <ChevronRight className="h-5 w-5 text-pink-600 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-6 pb-6 pt-0 text-gray-600 dark:text-gray-400">
                  <p>
                    If you accidentally trigger an alert, you have a 15-second window to cancel it before notifications are sent. If alerts have already been sent, you can quickly mark the alert as a false alarm through the app, which will immediately notify all contacts and responders that you are safe.
                  </p>
                </div>
              </details>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;