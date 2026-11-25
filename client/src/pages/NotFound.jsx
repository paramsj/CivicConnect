// src/pages/NotFound.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-8">
          <ExclamationTriangleIcon className="w-10 h-10 text-red-600" />
        </div>

        {/* Error Code */}
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        
        {/* Error Message */}
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Sorry, we couldn't find the page you're looking for. 
          The page might have been moved, deleted, or the URL might be incorrect.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <button
            onClick={handleGoHome}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 transition-colors duration-200"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Go to Homepage
          </button>

          <button
            onClick={handleGoBack}
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors duration-200"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Need help? Try these popular pages:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-sm text-teal-600 hover:text-teal-800 underline"
            >
              Dashboard
            </button>
            <span className="text-gray-300">•</span>
            <button 
              onClick={() => navigate('/report-issue')}
              className="text-sm text-teal-600 hover:text-teal-800 underline"
            >
              Report Issue
            </button>
            <span className="text-gray-300">•</span>
            <button 
              onClick={() => navigate('/help')}
              className="text-sm text-teal-600 hover:text-teal-800 underline"
            >
              Help Center
            </button>
            <span className="text-gray-300">•</span>
            <button 
              onClick={() => navigate('/contact')}
              className="text-sm text-teal-600 hover:text-teal-800 underline"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
