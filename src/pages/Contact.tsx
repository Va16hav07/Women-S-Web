import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import Button from '../components/Button';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [showChatbot, setShowChatbot] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Form submission logic would go here
    alert('Thank you for your message! We will get back to you soon.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

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
              Get in Touch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl opacity-90 mb-8"
            >
              We're here to answer your questions and provide support
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <AnimatedSection delay={0.1} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600">
                  <Mail size={24} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Us</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our friendly team is here to help
              </p>
              <a href="mailto:info@safeguardian.com" className="text-pink-600 hover:text-pink-700 transition-colors">
                info@safeguardian.com
              </a>
            </AnimatedSection>

            <AnimatedSection delay={0.2} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600">
                  <Phone size={24} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Call Us</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Mon-Fri from 8am to 5pm
              </p>
              <a href="tel:+15551234567" className="text-pink-600 hover:text-pink-700 transition-colors">
                +1 (555) 123-4567
              </a>
            </AnimatedSection>

            <AnimatedSection delay={0.3} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600">
                  <MapPin size={24} />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2">Visit Us</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Come say hello at our office
              </p>
              <p className="text-pink-600">
                123 Safety Street, Secure City, SC 12345
              </p>
            </AnimatedSection>
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Contact Form */}
            <AnimatedSection className="lg:w-1/2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    ></textarea>
                  </div>
                  <Button 
                    type="submit" 
                    variant="primary"
                    icon={<Send size={18} />}
                    className="w-full"
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            </AnimatedSection>

            {/* Map */}
            <AnimatedSection direction="left" className="lg:w-1/2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 h-full">
                <h2 className="text-2xl font-bold mb-6">Find us on the map</h2>
                <div className="rounded-lg overflow-hidden h-[400px] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400 text-center p-4">
                    Google Maps integration would be displayed here, showing our office location.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Find quick answers to common questions about our safety system.
            </p>
          </AnimatedSection>

          <div className="max-w-3xl mx-auto space-y-6">
            <AnimatedSection delay={0.1}>
              <details className="group bg-white dark:bg-gray-900 rounded-lg shadow-md">
                <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                  <span>How do I download the SafeGuardian app?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-0 text-gray-600 dark:text-gray-400">
                  <p>
                    The SafeGuardian app is available on both iOS and Android platforms. You can download it from the App Store or Google Play Store by searching for "SafeGuardian Women Safety."
                  </p>
                </div>
              </details>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              <details className="group bg-white dark:bg-gray-900 rounded-lg shadow-md">
                <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                  <span>Is there a subscription fee for using the service?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-0 text-gray-600 dark:text-gray-400">
                  <p>
                    We offer both free and premium subscription options. The basic safety features are available for free, while advanced features like AI danger detection and nearby responder network require a premium subscription. Visit our pricing page for more details.
                  </p>
                </div>
              </details>
            </AnimatedSection>

            <AnimatedSection delay={0.3}>
              <details className="group bg-white dark:bg-gray-900 rounded-lg shadow-md">
                <summary className="flex justify-between items-center font-medium cursor-pointer p-6">
                  <span>How can I become a safety responder?</span>
                  <span className="transition group-open:rotate-180">
                    <svg fill="none" height="24" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-0 text-gray-600 dark:text-gray-400">
                  <p>
                    To join our network of safety responders, you need to complete an application process that includes background verification, training, and certification. Please contact our responder team at responders@safeguardian.com for more information.
                  </p>
                </div>
              </details>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Chatbot */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChatbot}
          className="bg-pink-600 text-white p-4 rounded-full shadow-lg hover:bg-pink-700 transition-colors"
          aria-label="Open chat support"
        >
          <MessageSquare size={24} />
        </button>

        {showChatbot && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-20 right-0 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="bg-pink-600 text-white p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">SafeGuardian Support</h3>
                <button onClick={toggleChatbot} className="text-white hover:text-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-4 h-80 overflow-y-auto">
              <div className="mb-4">
                <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-lg inline-block max-w-xs">
                  <p className="text-sm">Hello! How can I help you today with SafeGuardian?</p>
                </div>
              </div>
              <div className="flex justify-end mb-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg inline-block max-w-xs">
                  <p className="text-sm">I have a question about the app.</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="bg-pink-100 dark:bg-pink-900/30 p-3 rounded-lg inline-block max-w-xs">
                  <p className="text-sm">Of course! What would you like to know about the SafeGuardian app?</p>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Type your message..."
                  className="flex-grow px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:ring-2 focus:ring-pink-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <button className="bg-pink-600 text-white px-4 py-2 rounded-r-md hover:bg-pink-700 transition-colors">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Contact;