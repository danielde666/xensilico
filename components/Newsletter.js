import React, { useState } from 'react';

export default function NewsletterSignup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    company: '',
    jobTitle: '',
    hospitalsServed: [],
    pathologies: [],
    newsletterConsent: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formHidden, setFormHidden] = useState(false);

  const steps = [
    {
      id: 'email',
      title: "What's your email address?",
      fields: ['email']
    },
    {
      id: 'fullName',
      title: "What's your full name?",
      fields: ['fullName']
    },
    {
      id: 'company',
      title: "What company or organization do you work for?",
      fields: ['company']
    },
    {
      id: 'jobTitle',
      title: "What's your job title?",
      fields: ['jobTitle']
    },
    {
      id: 'hospitals',
      title: "Which hospitals do you serve?",
      fields: ['hospitalsServed']
    },
    {
      id: 'pathologies',
      title: "What pathologies are you interested in?",
      fields: ['pathologies']
    },
    {
      id: 'consent',
      title: "Stay updated with our newsletter?",
      fields: ['newsletterConsent']
    }
  ];

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

  const handleConsentChange = () => {
    setFormData(prev => ({
      ...prev,
      newsletterConsent: !prev.newsletterConsent
    }));
  };

  const canProceed = () => {
    const currentStepData = steps[currentStep];
    return currentStepData.fields.every(field => {
      if (field === 'hospitalsServed') {
        return formData.hospitalsServed.length > 0;
      }
      if (field === 'pathologies') {
        return formData.pathologies.length > 0;
      }
      if (field === 'newsletterConsent') {
        return formData.newsletterConsent === true;
      }
      if (field === 'jobTitle') {
        return formData[field] && formData[field].trim() !== '';
      }
      return formData[field] && formData[field].trim() !== '';
    });
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }
    
    try {
      const res = await fetch('/api/submit-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setSubmitted(true);
        setFormData({
          email: '',
          fullName: '',
          company: '',
          jobTitle: '',
          hospitalsServed: [],
          pathologies: [],
          newsletterConsent: false
        });
        setIsLoading(false);
        setFormHidden(true);
      } else {
        const data = await res.json();
        setError(data.error || 'Submission failed. Try again.');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setIsLoading(false);
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case 'email':
        return (
          <div>
            <input
              type="email"
              placeholder="your email address"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="signupinput px-4 py-2 rounded-full focus:outline-none transition"
              required
            />
            {formData.email && (
              <div className="mt-1 ml-4">
                <span className="text-xs text-gray-400">Email address</span>
              </div>
            )}
          </div>
        );
      
      case 'fullName':
        return (
          <div>
            <input
              type="text"
              placeholder="Full name"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              className="signupinput px-4 py-2 rounded-full focus:outline-none transition"
              required
            />
            {formData.fullName && (
              <div className="mt-1 ml-4">
                <span className="text-xs text-gray-400">Full name</span>
              </div>
            )}
          </div>
        );
      
      case 'company':
        return (
          <div>
            <input
              type="text"
              placeholder="Company or organization"
              value={formData.company}
              onChange={(e) => handleInputChange('company', e.target.value)}
              className="signupinput px-4 py-2 rounded-full focus:outline-none transition"
            />
            {formData.company && (
              <div className="mt-1 ml-4">
                <span className="text-xs text-gray-400">Company or organization</span>
              </div>
            )}
          </div>
        );
      
      case 'jobTitle':
        return (
          <div>
            <input
              type="text"
              placeholder="Job title"
              value={formData.jobTitle}
              onChange={(e) => handleInputChange('jobTitle', e.target.value)}
              className="signupinput px-4 py-2 rounded-full focus:outline-none transition"
              required
            />
            {formData.jobTitle && (
              <div className="mt-1 ml-4">
                <span className="text-xs text-gray-400">Job title</span>
              </div>
            )}
          </div>
        );
      
      case 'hospitals':
        return (
          <div className="space-y-3">
            {hospitalOptions.map((hospital) => (
              <label key={hospital} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.hospitalsServed.includes(hospital)}
                  onChange={() => handleHospitalChange(hospital)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 border-2 rounded transition-all duration-200 ${
                  formData.hospitalsServed.includes(hospital)
                    ? 'hidden'
                    : 'hidden'
                }`}>
                </div>
                <span className={`rounded-lg transition-all duration-200 cursor-pointer ${
                  formData.hospitalsServed.includes(hospital)
                    ? 'bg-transparent text-green-400'
                    : 'bg-transparent text-gray-300 hover:text-white'
                }`}>
                  {hospital}
                </span>
              </label>
            ))}
          </div>
        );
      
      case 'pathologies':
        return (
          <div className="space-y-3">
            {pathologyOptions.map((pathology) => (
              <label key={pathology} className="flex items-center space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.pathologies.includes(pathology)}
                  onChange={() => handlePathologyChange(pathology)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 border-2 rounded transition-all duration-200 ${
                  formData.pathologies.includes(pathology)
                    ? 'hidden'
                    : 'hidden'
                }`}>
                </div>
                <span className={`rounded-lg transition-all duration-200 cursor-pointer ${
                  formData.pathologies.includes(pathology)
                    ? 'bg-transparent text-green-400'
                    : 'bg-transparent  text-gray-300 hover:text-white'
                }`}>
                  {pathology}
                </span>
              </label>
            ))}
          </div>
        );
      
      case 'consent':
        return (
          <div className="space-y-6">
            {/* Review Section */}
            <div className="bg-transparent space-y-3">
              <h4 className="text-sm font-medium text-white mb-3">Review your information:</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Email:</span>
                  <span className="text-white">{formData.email}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Name:</span>
                  <span className="text-white">{formData.fullName}</span>
                </div>
                
                {formData.company && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Company:</span>
                    <span className="text-white">{formData.company}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Job Title:</span>
                  <span className="text-white">{formData.jobTitle}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Hospitals:</span>
                  <span className="text-white text-right max-w-xs">
                    {formData.hospitalsServed.length > 0 
                      ? formData.hospitalsServed.join(', ')
                      : 'None selected'
                    }
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Pathologies:</span>
                  <span className="text-white text-right max-w-xs">
                    {formData.pathologies.length > 0 
                      ? formData.pathologies.join(', ')
                      : 'None selected'
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* Consent Checkbox */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.newsletterConsent}
                onChange={handleConsentChange}
                className="sr-only"
              />
              <span className={`px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                formData.newsletterConsent
                  ? 'bg-transparent text-green-400'
                  : 'bg-transparent text-gray-300 hover:text-white'
              }`}>
                I agree to receive marketing communications from your company.
              </span>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (formHidden) return null;

  return (
    <div className="max-w-2xl mx-auto">
      {!submitted && !isLoading ? (
        <div className="form-container">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2 hidden">
              <span className="text-sm text-gray-300">Step {currentStep + 1} of {steps.length}</span>
              <span className="text-sm text-gray-300">{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-600 rounded-full h-1">
              <div 
                className="bg-white h-1 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Step title */}
          <h3 className="text-2xl font-semibold text-white mb-6 text-center hidden">
            {steps[currentStep].title}
          </h3>

          {/* Step content */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}
            
            {/* Navigation buttons */}
            <div className="flex justify-between pt-4">
              {currentStep > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 text-gray-300 hover:text-white transition-colors duration-200"
                >
                  ← 
                </button>
              )}
              
              {currentStep < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className={`ml-auto px-6 py-2 transition-colors duration-200 ${
                    canProceed()
                      ? 'bg-transparent text-white hover:border-white'
                      : 'hidden'
                  }`}
                >
                   →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!canProceed()}
                  className={`ml-auto px-6 py-2 transition-colors duration-200 ${
                    canProceed()
                      ? 'bg-transparent text-white hover:border-white'
                      : 'hidden'
                  }`}
                >
                  Subscribe
                </button>
              )}
            </div>
          </form>
        </div>
      ) : isLoading ? (
        <div className="flex justify-center items-center">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDuration: '0.6s' }}></div>
        </div>
      ) : null}
      
      {submitted && (
        <div className="text-center">
          <p className="text-green-400 text-lg font-medium">Thank you for subscribing!</p>
          <p className="text-gray-300 mt-2">We'll keep you updated with the latest news and insights.</p>
        </div>
      )}
      
      {error && (
        <div className="text-center">
          <p className="text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
