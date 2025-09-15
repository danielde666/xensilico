import React, { useState, useRef } from 'react';
import Image from 'next/image';

export default function EditProfileStep({ user, onProfileComplete, onBack }) {
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    jobTitle: '',
    hospitalsServed: [],
    pathologies: [],
    profileImage: null,
    profileImageUrl: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);

  const hospitalOptions = [
    "Massachusetts General Hospital",
    "Brigham and Women's Hospital", 
    "Beth Israel Deaconess Medical Center",
    "Boston Medical Center",
    "Tufts Medical Center",
    "Dana-Farber Cancer Institute",
    "Children's Hospital Boston",
    "Other"
  ];

  const pathologyOptions = [
    "Cardiovascular",
    "Oncology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Emergency Medicine",
    "Intensive Care",
    "Surgery",
    "Radiology",
    "Pathology",
    "Other"
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleHospitalChange = (hospital) => {
    setFormData(prev => ({
      ...prev,
      hospitalsServed: prev.hospitalsServed.includes(hospital)
        ? prev.hospitalsServed.filter(h => h !== hospital)
        : [...prev.hospitalsServed, hospital]
    }));
  };

  const handlePathologyChange = (pathology) => {
    setFormData(prev => ({
      ...prev,
      pathologies: prev.pathologies.includes(pathology)
        ? prev.pathologies.filter(p => p !== pathology)
        : [...prev.pathologies, pathology]
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file must be smaller than 5MB.');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        profileImage: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleImageRemove = () => {
    setFormData(prev => ({
      ...prev,
      profileImage: null,
      profileImageUrl: ''
    }));
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const canProceed = () => {
    return formData.fullName.trim() !== '' && 
           formData.jobTitle.trim() !== '' &&
           formData.hospitalsServed.length > 0 &&
           formData.pathologies.length > 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!canProceed()) {
      setError('Please fill in all required fields.');
      setIsLoading(false);
      return;
    }
    
    try {
      // Use local file upload system
      const formDataToSend = new FormData();
      formDataToSend.append('uid', user.uid);
      formDataToSend.append('fullName', formData.fullName);
      formDataToSend.append('company', formData.company);
      formDataToSend.append('jobTitle', formData.jobTitle);
      formDataToSend.append('hospitalsServed', JSON.stringify(formData.hospitalsServed));
      formDataToSend.append('pathologies', JSON.stringify(formData.pathologies));
      
      if (formData.profileImage) {
        formDataToSend.append('profileImage', formData.profileImage);
      }
      
      const res = await fetch('/api/profile/update', {
        method: 'POST',
        body: formDataToSend,
      });
      
      if (res.ok) {
        const data = await res.json();
        onProfileComplete(data.user);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Profile update failed. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-white mb-4 text-center">
          Complete Your Profile
        </h2>
        <p className="text-gray-300 text-center">
          Tell us about yourself and your professional background
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Image Upload */}
        <div className="text-center">
          <div className="mb-4">
            {imagePreview ? (
              <div className="relative inline-block">
                <Image
                  src={imagePreview}
                  alt="Profile preview"
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-white"
                />
                <button
                  type="button"
                  onClick={handleImageRemove}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-30 h-30 border-2 border-dashed border-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="profileImage"
          />
          <label
            htmlFor="profileImage"
            className="bg-transparent border-2 border-gray-600 text-gray-300 px-4 py-2 rounded-full cursor-pointer hover:border-white hover:text-white transition-colors"
          >
            {formData.profileImage ? 'Change Profile Image' : 'Upload Profile Image'}
          </label>
          <p className="text-xs text-gray-400 mt-2">Optional - JPG, PNG up to 5MB</p>
        </div>

        {/* Full Name */}
        <div>
          <input
            type="text"
            placeholder="Full name *"
            value={formData.fullName}
            onChange={(e) => handleInputChange('fullName', e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-transparent border-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
            required
          />
        </div>

        {/* Company */}
        <div>
          <input
            type="text"
            placeholder="Company or organization"
            value={formData.company}
            onChange={(e) => handleInputChange('company', e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-transparent border-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
          />
        </div>

        {/* Job Title */}
        <div>
          <input
            type="text"
            placeholder="Job title *"
            value={formData.jobTitle}
            onChange={(e) => handleInputChange('jobTitle', e.target.value)}
            className="w-full px-4 py-3 rounded-full bg-transparent border-2 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-white transition-colors"
            required
          />
        </div>

        {/* Hospitals */}
        <div>
          <h3 className="text-white font-medium mb-3">Which hospitals do you serve? *</h3>
          <div className="grid grid-cols-1 gap-2">
            {hospitalOptions.map((hospital) => (
              <label key={hospital} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.hospitalsServed.includes(hospital)}
                  onChange={() => handleHospitalChange(hospital)}
                  className="sr-only"
                />
                <span className={`px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                  formData.hospitalsServed.includes(hospital)
                    ? 'bg-green-600 text-white'
                    : 'bg-transparent border border-gray-600 text-gray-300 hover:border-white hover:text-white'
                }`}>
                  {hospital}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Pathologies */}
        <div>
          <h3 className="text-white font-medium mb-3">What pathologies are you interested in? *</h3>
          <div className="grid grid-cols-2 gap-2">
            {pathologyOptions.map((pathology) => (
              <label key={pathology} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.pathologies.includes(pathology)}
                  onChange={() => handlePathologyChange(pathology)}
                  className="sr-only"
                />
                <span className={`px-3 py-2 rounded-lg transition-all duration-200 cursor-pointer text-sm ${
                  formData.pathologies.includes(pathology)
                    ? 'bg-green-600 text-white'
                    : 'bg-transparent border border-gray-600 text-gray-300 hover:border-white hover:text-white'
                }`}>
                  {pathology}
                </span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <div className="text-red-400 text-sm text-center bg-red-900/20 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="flex justify-between items-center pt-4">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="px-6 py-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              ← Back
            </button>
          )}
          
          <button
            type="submit"
            disabled={!canProceed() || isLoading}
            className="ml-auto bg-transparent border-2 border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving Profile...' : 'Save Profile →'}
          </button>
        </div>
      </form>
    </div>
  );
}
