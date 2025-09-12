import React, { useState } from 'react';

export default function AuthStep({ onAuthSuccess, onBack }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError(''); // Clear error when user starts typing
  };

  const validateForm = () => {
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        onAuthSuccess(data.user);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Account creation failed. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-white mb-4 text-center">
          Create Your Account
        </h2>
        <p className="text-gray-300 text-center">
          Enter your email and password to get started
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-transparent border-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
            required
          />
        </div>
        
        <div>
          <input
            type="password"
            placeholder="Password (min. 6 characters)"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-transparent border-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
            required
          />
        </div>
        
        <div>
          <input
            type="password"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-transparent border-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
            required
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm text-center bg-red-900/20 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="flex justify-between items-center pt-4">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              ← Back
            </button>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="ml-auto bg-transparent border-2 border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account →'}
          </button>
        </div>
      </form>
    </div>
  );
}
