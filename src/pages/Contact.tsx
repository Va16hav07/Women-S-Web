import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import Button from '../components/Button';

// Define message type
interface ChatMessage {
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [showChatbot, setShowChatbot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! How can I help you today with SafeGuardian?',
      timestamp: new Date()
    }
  ]);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

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

  const handleChatInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatInput(e.target.value);
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
  
    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput,
      timestamp: new Date(),
    };
  
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput('');
    setIsLoading(true);
  
    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage: chatInput }),
      });
  
      const data = await response.json();
      
      // ✅ Update to match backend response
      if (data?.botReply) {
        const aiMessage: ChatMessage = {
          role: 'assistant',
          content: data.botReply,  // ✅ Extract correct key
          timestamp: new Date(),
        };
  
        setChatMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error('No response from AI');
      }
    } catch (error) {
      console.error('Error:', error);
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'No response from AI.', timestamp: new Date() },
      ]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      sendMessage();
    }
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
                +91 7815841526
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
                Polaris School of Technology
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

      {/* Chatbot - Improved UI */}
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
            className="absolute bottom-20 right-0 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Chatbot Header */}
            <div className="bg-gradient-to-r from-pink-600 to-indigo-600 text-white p-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <MessageSquare size={18} />
                  </div>
                  <h3 className="font-medium">SafeGuardian AI Assistant</h3>
                </div>
                <button 
                  onClick={toggleChatbot} 
                  className="text-white hover:text-gray-200 p-1 rounded-full hover:bg-white/20 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Chatbot Messages */}
            <div 
              ref={chatContainerRef} 
              className="p-4 h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
            >
              {/* Welcome Message with Icon */}
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mr-3">
                  <MessageSquare size={20} className="text-pink-600" />
                </div>
                <div className="text-sm font-medium">
                  How can I assist you today with SafeGuardian?
                </div>
              </div>
              
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-4 ${msg.role === 'user' ? 'flex flex-row-reverse' : 'flex'}`}
                >
                  {/* Avatar for user or assistant */}
                  <div className={`flex-shrink-0 ${msg.role === 'user' ? 'ml-3' : 'mr-3'}`}>
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center
                      ${msg.role === 'user' 
                        ? 'bg-indigo-100 dark:bg-indigo-900/30' 
                        : 'bg-pink-100 dark:bg-pink-900/30'}`}
                    >
                      {msg.role === 'user' 
                        ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        : <MessageSquare size={16} className="text-pink-600" />
                      }
                    </div>
                  </div>
                  
                  {/* Message bubble */}
                  <div 
                    className={`rounded-lg px-4 py-2 max-w-[75%] shadow-sm
                      ${msg.role === 'user' 
                        ? 'bg-indigo-50 dark:bg-indigo-900/20 text-right' 
                        : 'bg-white dark:bg-gray-700'
                      } border ${msg.role === 'user' 
                        ? 'border-indigo-100 dark:border-indigo-800/30' 
                        : 'border-gray-100 dark:border-gray-600'}`
                    }
                  >
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block text-right">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex mb-4">
                  <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mr-3">
                    <MessageSquare size={16} className="text-pink-600" />
                  </div>
                  <div className="bg-white dark:bg-gray-700 px-4 py-3 rounded-lg border border-gray-100 dark:border-gray-600">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-pink-600 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-pink-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-pink-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Chatbot Input */}
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center rounded-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-2">
                <input
                  type="text"
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={handleChatInputChange}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-grow px-3 py-2 bg-transparent border-none focus:ring-0 focus:outline-none text-sm"
                />
                <button 
                  onClick={sendMessage}
                  disabled={isLoading || !chatInput.trim()}
                  className={`p-2 rounded-full ${isLoading ? 'text-gray-400' : 'text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20'} transition-colors`}
                >
                  <Send size={18} />
                </button>
              </div>
              <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
                Powered by OpenAI • AI responses may not be 100% accurate
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Contact;