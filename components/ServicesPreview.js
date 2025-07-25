const features = [
    { title: 'AI Brand Systems', icon: '🧠' },
    { title: 'Internal Tools', icon: '🗂️' },
    { title: 'Design + Dev', icon: '💻' },
    { title: 'Marketing Ops', icon: '📈' },
    { title: 'Calendar & Directory', icon: '🗓️' }
  ];
  
  export default function ServicesPreview() {
    return (
      <section className="py-20 px-6 bg-gray-950 text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">Our Wrap Toolkit</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-zinc-900 p-6 rounded-lg shadow-lg hover:shadow-xl transition text-center">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-xl font-semibold">{f.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  