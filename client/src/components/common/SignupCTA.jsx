// src/components/common/SignupCTA.jsx - Reusable signup prompt
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, UserPlusIcon } from '@heroicons/react/24/outline';

const SignupCTA = ({ 
  title = "Ready to Get Started?", 
  description = "Join CivicConnect and start making a difference in your community",
  buttonText = "Sign Up Free"
}) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-8 text-white text-center">
      <UserPlusIcon className="w-12 h-12 mx-auto mb-4 text-teal-200" />
      <h3 className="text-2xl font-bold mb-4">{title}</h3>
      <p className="text-teal-100 mb-6 max-w-md mx-auto">{description}</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          onClick={() => navigate('/signup')}
          className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2"
        >
          <span>{buttonText}</span>
          <ArrowRightIcon className="w-5 h-5" />
        </button>
        <button 
          onClick={() => navigate('/login')}
          className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors"
        >
          Already a Member?
        </button>
      </div>
    </div>
  );
};

export default SignupCTA;
