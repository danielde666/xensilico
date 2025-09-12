import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function ProfileDisplayStep({ user, uploadedData, onComplete, onEditProfile, onUploadMoreData }) {
  const [userProfile, setUserProfile] = useState(null);
  const [userUploads, setUserUploads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUserProfile();
    fetchUserUploads();
  }, [user.uid]);

  const fetchUserProfile = async () => {
    try {
      const res = await fetch(`/api/profile/get?uid=${user.uid}`);
      if (res.ok) {
        const data = await res.json();
        setUserProfile(data.profile);
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
    }
  };

  const fetchUserUploads = async () => {
    try {
      const res = await fetch(`/api/data/get?uid=${user.uid}`);
      if (res.ok) {
        const data = await res.json();
        setUserUploads(data.uploads || []);
      }
    } catch (err) {
      console.error('Error fetching uploads:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const allUploads = [...uploadedData, ...userUploads];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 bg-white rounded-full animate-pulse" style={{ animationDuration: '0.6s' }}></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-white mb-4 text-center">
          Your Profile
        </h2>
        <p className="text-gray-300 text-center">
          Welcome to Xensilico! Here's your profile overview.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Information */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <div className="flex items-center space-x-4 mb-6">
            {userProfile?.profileImageUrl ? (
              <Image
                src={userProfile.profileImageUrl}
                alt="Profile"
                width={80}
                height={80}
                className="rounded-full object-cover border-2 border-white"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-2xl text-gray-300">
                  {userProfile?.fullName?.charAt(0) || '?'}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-xl font-semibold text-white">
                {userProfile?.fullName || 'Unknown User'}
              </h3>
              <p className="text-gray-300">{userProfile?.jobTitle || ''}</p>
              <p className="text-gray-400 text-sm">{userProfile?.company || ''}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-white font-medium mb-2">Hospitals Served</h4>
              <div className="flex flex-wrap gap-2">
                {userProfile?.hospitalsServed?.map((hospital, index) => (
                  <span key={index} className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                    {hospital}
                  </span>
                )) || <span className="text-gray-400">None selected</span>}
              </div>
            </div>

            <div>
              <h4 className="text-white font-medium mb-2">Areas of Interest</h4>
              <div className="flex flex-wrap gap-2">
                {userProfile?.pathologies?.map((pathology, index) => (
                  <span key={index} className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                    {pathology}
                  </span>
                )) || <span className="text-gray-400">None selected</span>}
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-600">
            <button
              onClick={onEditProfile}
              className="w-full bg-transparent border-2 border-white text-white px-4 py-2 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-200"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Data Uploads */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-white">Pending Data</h3>
            <button
              onClick={onUploadMoreData}
              className="bg-transparent border-2 border-white text-white px-4 py-2 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-200 text-sm"
            >
              Upload More
            </button>
          </div>

          {allUploads.length > 0 ? (
            <div className="space-y-4">
              {allUploads.slice(0, 6).map((upload, index) => (
                <div key={upload.id || index} className="flex items-center space-x-4 p-3 bg-gray-700/50 rounded-lg">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center">
                    <span className="text-gray-300">📄</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {upload.fileName}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {upload.status === 'pending' ? 'Pending Processing' : upload.status}
                    </p>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    upload.status === 'pending' 
                      ? 'bg-yellow-600 text-yellow-100' 
                      : 'bg-green-600 text-green-100'
                  }`}>
                    {upload.status === 'pending' ? 'Pending' : 'Processed'}
                  </div>
                </div>
              ))}
              {allUploads.length > 6 && (
                <p className="text-gray-400 text-sm text-center">
                  +{allUploads.length - 6} more files
                </p>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl text-gray-500 mb-4">📁</div>
              <p className="text-gray-400 mb-4">No data uploaded yet</p>
              <button
                onClick={onUploadMoreData}
                className="bg-transparent border-2 border-gray-600 text-gray-300 px-4 py-2 rounded-full hover:border-white hover:text-white transition-all duration-200"
              >
                Upload Your First Files
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Complete Button */}
      <div className="text-center mt-8">
        <button
          onClick={onComplete}
          className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-200 font-semibold"
        >
          Complete Setup →
        </button>
      </div>
    </div>
  );
}
