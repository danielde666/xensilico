import React from 'react';
import Image from 'next/image';

export default function WelcomeScreen({ onLogin, onSignUp }) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center">
        {/* Xensilico Logo */}
        <div className="mb-8">
          <Image
            src="/logo.svg"
            alt="Xensilico"
            width={200}
            height={200}
            className="mx-auto"
            priority
          />
        </div>
        
      
        
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          AI ADVISORY BOARD
        </p>
        
        {/* Login and Sign Up Buttons */}
        <div className="space-y-4">
          <button
            onClick={onLogin}
            className="block w-full max-w-xs mx-auto bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
          >
            LOGIN
          </button>
          
          <button
            onClick={onSignUp}
            className="block w-full max-w-xs mx-auto bg-white text-gray-900 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
          >
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
}
