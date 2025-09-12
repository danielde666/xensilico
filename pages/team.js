import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function TeamPage() {
  const [team, setTeam] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch both team members and community users
    Promise.all([
      fetch('/api/team').then(res => res.json()),
      fetch('/api/team/users').then(res => res.json())
    ])
    .then(([teamData, usersData]) => {
      setTeam(teamData);
      setUsers(usersData.users || []);
      setLoading(false);
    })
    .catch(err => {
      console.error('Error fetching data:', err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-10">Meet the Team</h1>
      
      {/* Core Team */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-8 text-center">Core Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {team.map((member, i) => (
            <div key={i} className="bg-zinc-900 p-6 rounded-lg text-center shadow-lg">
              <Image
                src={member.photo}
                alt={member.name}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full mx-auto object-cover border-2 border-white mb-4"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-400">{member.role}</p>
              <p className="text-sm text-gray-500">{member.email}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Community Members */}
      {users.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-8 text-center">Community Members</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {users.map((user) => (
              <div key={user.id} className="bg-zinc-800 p-4 rounded-lg text-center shadow-lg">
                {user.profileImageUrl ? (
                  <Image
                    src={user.profileImageUrl}
                    alt={user.fullName}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-white mb-3"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full mx-auto bg-zinc-700 flex items-center justify-center border-2 border-white mb-3">
                    <span className="text-2xl text-gray-300">
                      {user.fullName?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
                <h3 className="text-lg font-semibold">{user.fullName}</h3>
                <p className="text-gray-400 text-sm">{user.jobTitle}</p>
                {user.company && (
                  <p className="text-gray-500 text-xs">{user.company}</p>
                )}
                <div className="mt-2">
                  {user.hospitalsServed?.slice(0, 2).map((hospital, idx) => (
                    <span key={idx} className="inline-block bg-green-600 text-white text-xs px-2 py-1 rounded-full mr-1 mb-1">
                      {hospital}
                    </span>
                  ))}
                  {user.hospitalsServed?.length > 2 && (
                    <span className="text-gray-400 text-xs">+{user.hospitalsServed.length - 2} more</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
