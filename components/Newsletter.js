import React, { useState } from 'react';
import WelcomeScreen from './WelcomeScreen';
import AuthStep from './AuthStep';
import EditProfileStep from './EditProfileStep';
import DataUploadStep from './DataUploadStep';
import ProfileDisplayStep from './ProfileDisplayStep';

export default function NewsletterSignup() {
  const [currentStep, setCurrentStep] = useState('welcome');
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [uploadedData, setUploadedData] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Flow handlers
  const handleWelcomeEnter = () => {
    setCurrentStep('auth');
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setCurrentStep('profile');
  };

  const handleProfileComplete = (profileData) => {
    setUserProfile(profileData);
    setCurrentStep('upload');
  };

  const handleDataUploaded = (uploads) => {
    setUploadedData(uploads);
    setCurrentStep('display');
  };

  const handleComplete = () => {
    // User has completed the full onboarding flow
    setCurrentStep('complete');
  };

  const handleEditProfile = () => {
    setCurrentStep('profile');
  };

  const handleUploadMoreData = () => {
    setCurrentStep('upload');
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'auth':
        setCurrentStep('welcome');
        break;
      case 'profile':
        setCurrentStep('auth');
        break;
      case 'upload':
        setCurrentStep('profile');
        break;
      case 'display':
        setCurrentStep('upload');
        break;
      default:
        break;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return <WelcomeScreen onEnter={handleWelcomeEnter} />;
      
      case 'auth':
        return (
          <AuthStep 
            onAuthSuccess={handleAuthSuccess}
            onBack={handleBack}
          />
        );
      
      case 'profile':
        return (
          <EditProfileStep 
            user={user}
            onProfileComplete={handleProfileComplete}
            onBack={handleBack}
          />
        );
      
      case 'upload':
        return (
          <DataUploadStep 
            user={user}
            onDataUploaded={handleDataUploaded}
            onBack={handleBack}
          />
        );
      
      case 'display':
        return (
          <ProfileDisplayStep 
            user={user}
            uploadedData={uploadedData}
            onComplete={handleComplete}
            onEditProfile={handleEditProfile}
            onUploadMoreData={handleUploadMoreData}
          />
        );
      
      case 'complete':
        return (
          <div className="text-center">
            <div className="mb-8">
              <div className="text-6xl text-green-400 mb-4">✓</div>
              <h2 className="text-3xl font-semibold text-white mb-4">
                Welcome to Xensilico!
              </h2>
              <p className="text-gray-300">
                Your account has been created successfully. You're now ready to explore our platform.
              </p>
            </div>
          </div>
        );
      
      default:
        return <WelcomeScreen onEnter={handleWelcomeEnter} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="container mx-auto px-4 py-8">
        {renderCurrentStep()}
        
        {error && (
          <div className="fixed bottom-4 right-4 bg-red-900/90 text-red-100 px-4 py-2 rounded-lg shadow-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
