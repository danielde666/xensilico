// components/Header.js
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 right-12 z-50 w-full px-6 py-4 flex justify-end">
        <button
          onClick={() => setMenuOpen(true)}
          className="text-white text-2xl font-bold hover:text-gray-300 transition"
        >
            <img
                src='../aiwrap-white.svg'
                alt='Ai Wrap'
                className="w-24 h-24 mx-auto object-contain"
            />
        </button>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-xl z-50 flex flex-col items-center justify-center text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 text-white text-xl hover:text-gray-300"
            >
              ✕
            </button>
            <nav className="space-y-6 text-2xl">
            <img
                src='../aiwrap-white.svg'
                alt='Ai Wrap'
                className="w-24 h-24 mx-auto object-contain"
            />
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
