import React, { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    
    // SEND TO API (NEW)
    try {
      const res = await fetch('/api/submit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setSubmitted(true);
        setEmail('');
        setIsLoading(false); // Hide loading dot on success
        // Keep form faded out - don't reset loading state
      } else {
        const data = await res.json();
        setError(data.error || 'Submission failed. Try again.');
        setIsLoading(false); // Only reset loading on error
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setIsLoading(false); // Only reset loading on error
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      {!isLoading ? (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 rounded-full bg-black signupform focus:ring-2 focus:ring-blue-400 newsletter-form">
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="signupinput flex-1 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            required
          />
          <button
            type="submit"
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-full transition-colors duration-200"
          >
            join the waitlist
          </button>
        </form>
      ) : (
        <div className="flex justify-center items-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDuration: '0.6s' }}></div>
        </div>
      )}
      {submitted && (
        <p className="text-green-600 mt-4 text-center">Thank you for subscribing!</p>
      )}
      {error && (
        <p className="text-red-600 mt-4 text-center">{error}</p>
      )}
    </div>
  );
}
