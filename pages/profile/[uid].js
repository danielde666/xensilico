import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Head from 'next/head';

export default function UserProfile() {
  const router = useRouter();
  const { uid } = router.query;
  const [userProfile, setUserProfile] = useState(null);
  const [userUploads, setUserUploads] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (uid) {
      fetchUserData();
    }
  }, [uid]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const [profileRes, uploadsRes] = await Promise.all([
        fetch(`/api/profile/get?uid=${uid}`),
        fetch(`/api/data/get?uid=${uid}`)
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setUserProfile(profileData.profile);
      } else {
        setError('Profile not found');
      }

      if (uploadsRes.ok) {
        const uploadsData = await uploadsRes.json();
        setUserUploads(uploadsData.uploads || []);
      }
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (error || !userProfile) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Profile Not Found</div>
          <button
            onClick={() => router.push('/team')}
            className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-200"
          >
            Back to Team
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{userProfile.fullName} - Xensilico</title>
        <meta name="description" content={`Profile of ${userProfile.fullName} at Xensilico`} />
      </Head>
      
      <div className="min-h-screen bg-black text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push('/team')}
              className="mb-4 text-gray-300 hover:text-white transition-colors"
            >
              ← Back to Team
            </button>
            <h1 className="text-4xl font-bold">Profile</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Information */}
            <div className="bg-gray-800/50 rounded-lg p-8">
              <div className="flex items-center space-x-6 mb-8">
                {userProfile.profileImageUrl ? (
                  <Image
                    src={userProfile.profileImageUrl}
                    alt={userProfile.fullName}
                    width={120}
                    height={120}
                    unoptimized={true}
                    className="rounded-full object-cover border-4 border-white"
                  />
                ) : (
                  <div className="w-30 h-30 bg-gray-600 rounded-full flex items-center justify-center border-4 border-white">
                    <span className="text-4xl text-gray-300">
                      {userProfile.fullName?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
                <div>
                  <h2 className="text-3xl font-semibold">{userProfile.fullName}</h2>
                  <p className="text-gray-300 text-lg">{userProfile.jobTitle}</p>
                  {userProfile.company && (
                    <p className="text-gray-400">{userProfile.company}</p>
                  )}
                  <p className="text-gray-500 text-sm mt-1">{userProfile.email}</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-white font-medium mb-3">Hospitals Served</h3>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.hospitalsServed?.map((hospital, index) => (
                      <span key={index} className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                        {hospital}
                      </span>
                    )) || <span className="text-gray-400">None specified</span>}
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-3">Areas of Interest</h3>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.pathologies?.map((pathology, index) => (
                      <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                        {pathology}
                      </span>
                    )) || <span className="text-gray-400">None specified</span>}
                  </div>
                </div>

                <div>
                  <h3 className="text-white font-medium mb-3">Member Since</h3>
                  <p className="text-gray-300">
                    {new Date(userProfile.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Data Uploads */}
            <div className="bg-gray-800/50 rounded-lg p-8">
              <h3 className="text-2xl font-semibold mb-6">Uploaded Data</h3>
              
              {userUploads.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {userUploads.map((upload, index) => (
                    <div key={upload.id || index} className="relative group">
                      <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                        {upload.fileUrl ? (
                          <Image
                            src={upload.fileUrl}
                            alt={upload.fileName}
                            width={200}
                            height={200}
                            unoptimized={true}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-300 text-2xl">📄</span>
                          </div>
                        )}
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2 rounded-b-lg">
                        <p className="text-white text-xs font-medium truncate">
                          {upload.fileName}
                        </p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-gray-300 text-xs">
                            {(upload.fileSize / 1024 / 1024).toFixed(1)} MB
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            upload.status === 'pending' 
                              ? 'bg-yellow-600 text-yellow-100' 
                              : 'bg-green-600 text-green-100'
                          }`}>
                            {upload.status === 'pending' ? 'Pending' : 'Processed'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl text-gray-500 mb-4">📁</div>
                  <p className="text-gray-400">No data uploaded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
