import React from 'react';
import Image from 'next/image';

export default function WelcomeScreen({ onEnter }) {
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
          Join our community of healthcare professionals and researchers
        </p>
        
        {/* Enter Button */}
        <button
          onClick={onEnter}
          className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300 transform hover:scale-105"
        >
          Click to Enter
        </button>
      </div>
    </div>
  );
}
