import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';


export default function AdminTeam() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(data => {
        setTeam(data);
        setLoading(false);
      });
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...team];
    updated[index][field] = value;
    setTeam(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus('');

    const res = await fetch('/api/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(team)
    });

    const result = await res.json();
    setSaving(false);
    setStatus(result.message || '✅ Saved!');
  };


  const addMember = () => {
    setTeam([...team, { name: '', role: '', email: '', photo: '', description: '' }]);
  };
  
  const deleteMember = (index) => {
    const updated = [...team];
    updated.splice(index, 1);
    setTeam(updated);
  };
  

  if (loading || saving) {
    return (
    
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full spin" />

    </div>
    
    


    );
  }

  return (
    <div className="animate-fade-in transition-opacity duration-700 min-h-screen p-8 bg-black text-white space-y-8">
      <h1 className="text-3xl font-bold">Team Editor</h1>

      {status && (
        <div className="text-green-400 text-sm mb-4 animate-fade-in">
          {status}
        </div>
      )}

      {team.map((member, i) => (
        <div key={i} className="space-y-2 border-b border-gray-700 pb-6">
          <input
            type="text"
            value={member.name}
            onChange={(e) => handleChange(i, 'name', e.target.value)}
            placeholder="Name"
            className="w-full bg-zinc-900 p-2 rounded"
          />
          <input
            type="text"
            value={member.role}
            onChange={(e) => handleChange(i, 'role', e.target.value)}
            placeholder="Role"
            className="w-full bg-zinc-900 p-2 rounded"
          />
          <input
            type="email"
            value={member.email}
            onChange={(e) => handleChange(i, 'email', e.target.value)}
            placeholder="Email"
            className="w-full bg-zinc-900 p-2 rounded"
          />
          <input
            type="text"
            value={member.photo}
            onChange={(e) => handleChange(i, 'photo', e.target.value)}
            placeholder="Image URL"
            className="w-full bg-zinc-900 p-2 rounded"
          />
         <label className="block text-sm text-gray-400">Bio / Description</label>
        <ReactQuill
          value={member.description || ''}
          onChange={(val) => handleChange(i, 'description', val)}
          theme="snow"
          className="bg-white text-black rounded"
          style={{ minHeight: '120px' }}
        />
        <button onClick={() => deleteMember(i)} className="text-xs text-red-400">Remove</button>

        </div>
        
      ))}

      <button
        onClick={handleSave}
        className="bg-white text-black font-bold px-6 py-2 rounded-lg hover:bg-gray-200"
      >
        Save Changes
      </button>

      <button onClick={addMember} className="text-sm text-blue-400">+ Add Member</button>

    </div>
  );
}
