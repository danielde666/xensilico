import { useEffect, useState } from 'react';

export default function TeamPage() {
  const [team, setTeam] = useState([]);

  useEffect(() => {
    fetch('/api/team')
      .then((res) => res.json())
      .then((data) => setTeam(data));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">Meet the Team</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {team.map((member, i) => (
          <div key={i} className="bg-zinc-900 p-6 rounded-lg text-center shadow-lg">
            <img
              src={member.photo}
              alt={member.name}
              className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-white mb-4"
            />
            <h2 className="text-xl font-semibold">{member.name}</h2>
            <p className="text-gray-400">{member.role}</p>
            <p className="text-sm text-gray-500">{member.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
