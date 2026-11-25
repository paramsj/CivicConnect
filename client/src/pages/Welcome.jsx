// src/pages/Welcome.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import {
  CheckCircleIcon,
  PlusCircleIcon,
  EyeIcon,
  MapPinIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const Welcome = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  const steps = [
    {
      icon: PlusCircleIcon,
      title: "Report Your First Issue",
      description: "Found a pothole or broken streetlight? Report it to get started!",
      action: () => navigate('/report-issue'),
      buttonText: "Report Issue"
    },
    {
      icon: MapPinIcon,
      title: "Explore Your Neighborhood",
      description: "See what issues your neighbors are reporting in your area.",
      action: () => navigate('/nearby-issues'),
      buttonText: "View Nearby"
    },
    {
      icon: TrophyIcon,
      title: "Build Your Civic Score",
      description: "Earn points by reporting issues and helping your community.",
      action: () => navigate('/leaderboard'),
      buttonText: "See Leaderboard"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to CivicConnect, {user?.name?.split(' ')[0]}! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your account has been created successfully. You're now part of a community working together to make our city better.
          </p>
        </div>

        {/* Getting Started Steps */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
            Here's how to get started:
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <button
                  onClick={step.action}
                  className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:from-teal-700 hover:to-blue-700 transition-colors"
                >
                  {step.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Account Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium text-gray-800">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium text-gray-800">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Civic Score</p>
              <p className="font-medium text-gray-800">{user?.civicScore} (Starting fresh!)</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Member Since</p>
              <p className="font-medium text-gray-800">{new Date(user?.joinedDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Skip to Dashboard */}
        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Skip tour and go to dashboard →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
