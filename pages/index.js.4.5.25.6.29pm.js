
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-12 space-y-24">
      <section className="text-center max-w-4xl mx-auto space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold"
        >
          We Wrap Companies
        </motion.h1>
        <p className="text-xl md:text-2xl text-gray-300">
          Your core. Wrapped in future.
        </p>
        <div className="flex justify-center gap-4 pt-6">
          <button className="px-6 py-2 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition">
            Book Consultation
          </button>
          <button className="px-6 py-2 border border-white text-white rounded-xl hover:bg-white hover:text-black transition">
            Explore Services
          </button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10">
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-700">
          <h2 className="text-2xl font-semibold mb-4">External Wrap</h2>
          <ul className="list-disc pl-5 text-gray-300 space-y-1">
            <li>Rebranding</li>
            <li>Web & Mobile</li>
            <li>Campaign Systems</li>
          </ul>
        </div>
        <div className="bg-neutral-900 p-6 rounded-2xl border border-neutral-700">
          <h2 className="text-2xl font-semibold mb-4">Internal Wrap</h2>
          <ul className="list-disc pl-5 text-gray-300 space-y-1">
            <li>Intranet & Dashboards</li>
            <li>Calendar Sync</li>
            <li>AI-enhanced Tools</li>
          </ul>
        </div>
      </section>

      <section className="text-center space-y-6">
        <h2 className="text-3xl font-semibold">Currently Working With</h2>
        <p className="text-gray-400">A world-class spinal surgeon redefining private practice</p>
        <p className="italic text-gray-500">Website launching soon...</p>
      </section>

      <section className="text-center space-y-4">
        <h3 className="text-2xl font-medium">Ready to wrap?</h3>
        <button className="px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition">
          Book a Call
        </button>
      </section>
    </main>
  );
}
