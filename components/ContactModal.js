
import { useState } from 'react';

export default function ContactModal() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition"
      >
        Book a Call
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white text-black p-8 rounded-2xl max-w-md w-full relative">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-black hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
              <textarea
                placeholder="Message"
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
                rows={4}
              />
              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
