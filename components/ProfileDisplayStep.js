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
        console.log('Fetched profile data:', data.profile);
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

  // Combine uploads and remove duplicates based on fileUrl
  const combinedUploads = [...uploadedData, ...userUploads];
  const allUploads = combinedUploads.filter((upload, index, self) => 
    index === self.findIndex(u => u.fileUrl === upload.fileUrl)
  );

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
                unoptimized={true}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {allUploads.slice(0, 6).map((upload, index) => (
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
              {allUploads.length > 6 && (
                <div className="aspect-square bg-gray-600/30 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-500">
                  <div className="text-center">
                    <span className="text-gray-400 text-2xl">📁</span>
                    <p className="text-gray-400 text-sm mt-2">
                      +{allUploads.length - 6} more
                    </p>
                  </div>
                </div>
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
