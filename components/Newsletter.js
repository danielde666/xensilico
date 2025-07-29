// NewsletterSignup.js
import React, { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubmitted(true);
      // Here you'd typically send to your backend or API
      setTimeout(() => {
        setSubmitted(false);
        setEmail('');
      }, 3000);
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
    </div>
  );
}
