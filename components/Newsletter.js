import React, { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
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
        setTimeout(() => setSubmitted(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || 'Submission failed. Try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6">
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 rounded-full bg-black signupform focus:ring-2 focus:ring-blue-400">
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signupinput flex-1  px-4 py-2 rounded-full focus:outline-none  transition"
          required
        />
        <button
          type="submit"
          className="bg-black-600 hover:bg-black-700 text-white px-6 py-2 rounded-full transition"
        >
          join the waitlist
        </button>
      </form>
      {submitted && (
        <p className="text-green-600 mt-4 text-center">Thank you for subscribing!</p>
      )}
      {error && (
        <p className="text-red-600 mt-4 text-center">{error}</p>
      )}
    </div>
  );
}
