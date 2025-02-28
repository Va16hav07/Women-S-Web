import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Shield, Phone, CheckCircle, Eye, EyeOff } from 'lucide-react';
import Button from '../components/Button';
import AnimatedSection from '../components/AnimatedSection';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle registration logic here
    console.log('Registration attempt', formData);
  };

  const passwordMatch = formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-10 -top-10 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -left-10 bottom-1/3 w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <AnimatedSection>
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Shield size={40} className="text-pink-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Your Account</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Join thousands of women who have taken control of their safety
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="mt-8 bg-white dark:bg-gray-800 py-8 px-6 shadow rounded-lg">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    First Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Jane"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Last Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="Doe"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email Address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Used only for emergency alerts and verification
                  </p>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500"
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Must be at least 8 characters with a number and special character
                  </p>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`block w-full pl-10 pr-10 py-2 border ${passwordMatch || !formData.confirmPassword ? 'border-gray-300 dark:border-gray-600' : 'border-red-500'} rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500`}
                      placeholder="••••••••"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="text-gray-400 hover:text-gray-500 focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {formData.confirmPassword && !passwordMatch && (
                    <p className="mt-1 text-xs text-red-500">
                      Passwords do not match
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center">
                <input
                  id="agree-terms"
                  name="agree-terms"
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  I agree to the{' '}
                  <Link to="/terms" className="font-medium text-pink-600 hover:text-pink-500">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="font-medium text-pink-600 hover:text-pink-500">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full flex justify-center"
                  icon={<CheckCircle size={20} />}
                  disabled={!passwordMatch || !agreeTerms}
                >
                  Create Account
                </Button>
              </div>
            </form>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-pink-600 hover:text-pink-500">
                Sign in
              </Link>
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <div className="mt-8 bg-white dark:bg-gray-800 p-6 shadow rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
              Why Sign Up?
            </h3>
            <div className="space-y-4">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-pink-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Access to real-time safety alerts and notifications
                </p>
              </div>
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-pink-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Connect with verified safety responders in your area
                </p>
              </div>
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-pink-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set up your emergency contacts network
                </p>
              </div>
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-pink-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Customize your safety preferences and alert thresholds
                </p>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </div>
  );
};

export default Register;