// src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...', fullScreen = true }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-12 h-12', 
    large: 'w-16 h-16'
  };

  const Spinner = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className={`${sizeClasses[size]} border-4 border-gray-200 border-t-teal-600 rounded-full animate-spin`}></div>
      {message && (
        <p className="text-gray-600 font-medium animate-pulse">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return <Spinner />;
};

export default LoadingSpinner;
