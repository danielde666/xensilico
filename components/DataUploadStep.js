import React, { useState, useRef } from 'react';
import Image from 'next/image';

export default function DataUploadStep({ user, onDataUploaded, onBack }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (files) => {
    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        setError(`${file.name} is not a valid image file.`);
        return false;
      }
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        setError(`${file.name} is too large. Maximum size is 50MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setUploadedFiles(prev => [...prev, ...validFiles]);
      setError('');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one image.');
      setIsLoading(false);
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('uid', user.uid);
      
      uploadedFiles.forEach((file, index) => {
        formData.append(`images`, file);
      });
      
      const formDataToSend = new FormData();
      formDataToSend.append('uid', user.uid);
      
      uploadedFiles.forEach((file, index) => {
        formDataToSend.append(`images`, file);
      });
      
      const res = await fetch('/api/data/upload', {
        method: 'POST',
        body: formDataToSend,
      });
      
      if (res.ok) {
        const data = await res.json();
        onDataUploaded(data.uploads);
      } else {
        const errorData = await res.json();
        setError(errorData.error || 'Upload failed. Please try again.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  const skipUpload = () => {
    onDataUploaded([]);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-semibold text-white mb-4 text-center">
          Upload Your Data
        </h2>
        <p className="text-gray-300 text-center">
          Upload images for analysis and processing
        </p>
      </div>

      <div className="space-y-6">
        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            isDragging 
              ? 'border-white bg-white/10' 
              : 'border-gray-600 hover:border-gray-400'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="space-y-4">
            <div className="text-6xl text-gray-400">📁</div>
            <div>
              <p className="text-white text-lg mb-2">
                Drag and drop images here, or
              </p>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-200"
              >
                Browse Files
              </button>
            </div>
            <p className="text-gray-400 text-sm">
              Supports JPG, PNG, GIF up to 50MB each
            </p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />
        </div>

        {/* Uploaded Files Preview */}
        {uploadedFiles.length > 0 && (
          <div className="bg-gray-800/50 rounded-lg p-6">
            <h3 className="text-white font-medium mb-4">
              Selected Files ({uploadedFiles.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedFiles.map((file, index) => (
                <div key={index} className="relative">
                  <div className="aspect-square bg-gray-700 rounded-lg overflow-hidden">
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                  <p className="text-xs text-gray-300 mt-1 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    {(file.size / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-400 text-sm text-center bg-red-900/20 px-4 py-2 rounded-lg">
            {error}
          </div>
        )}
        
        {/* Navigation */}
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
          
          <div className="ml-auto space-x-4">
            <button
              type="button"
              onClick={skipUpload}
              className="px-6 py-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              Skip for Now
            </button>
            
            <button
              onClick={handleSubmit}
              disabled={uploadedFiles.length === 0 || isLoading}
              className="bg-transparent border-2 border-white text-white px-6 py-2 rounded-full hover:bg-white hover:text-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Uploading...' : `Upload ${uploadedFiles.length} Files →`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
