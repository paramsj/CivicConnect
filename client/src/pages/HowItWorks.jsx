// src/pages/HowItWorks.jsx
import React from 'react';
import Header from '../components/common/Header';
import { useNavigate } from 'react-router-dom';
import {
  UserPlusIcon,
  PlusCircleIcon,
  EyeIcon,
  CheckCircleIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  ArrowRightIcon,
  PlayCircleIcon
} from '@heroicons/react/24/outline';

const HowItWorks = () => {
  const navigate = useNavigate();

  const steps = [
    {
      step: 1,
      icon: UserPlusIcon,
      title: "Sign Up",
      description: "Create your account with basic information to get started with CivicConnect.",
      details: "Register with your email, phone number, and verify your identity to become part of our civic community.",
      color: "from-blue-500 to-blue-600"
    },
    {
      step: 2,
      icon: PlusCircleIcon,
      title: "Report Issues",
      description: "Submit civic issues with photos, location details, and priority level.",
      details: "Use our intuitive form to report potholes, streetlight issues, waste management problems, and more with GPS location tagging.",
      color: "from-green-500 to-green-600"
    },
    {
      step: 3,
      icon: EyeIcon,
      title: "Track Progress",
      description: "Monitor your reported issues and receive real-time updates on resolution status.",
      details: "Get notifications via email and app when your issue is acknowledged, assigned, and resolved by municipal authorities.",
      color: "from-purple-500 to-purple-600"
    },
    {
      step: 4,
      icon: CheckCircleIcon,
      title: "Issue Resolved",
      description: "Receive confirmation when your civic issue has been successfully addressed.",
      details: "Rate the resolution quality and provide feedback to help improve municipal services for everyone.",
      color: "from-teal-500 to-teal-600"
    }
  ];

  const features = [
    {
      icon: BellIcon,
      title: "Real-time Notifications",
      description: "Get instant updates on your reported issues via email, SMS, and push notifications."
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Community Engagement",
      description: "See what others are reporting in your area and support important community issues."
    },
    {
      icon: EyeIcon,
      title: "Transparency Dashboard",
      description: "View municipal performance metrics and track how efficiently issues are being resolved."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
        <Header />
      {/* Header */}
       <div className="bg-gradient-to-r from-teal-700 to-sky-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">How CivicConnect Works</h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              A simple, transparent process to report and resolve civic issues in your community
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Process Steps */}
        <section className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Simple 4-Step Process</h2>
            <p className="text-lg text-gray-600">Follow these easy steps to make a difference in your community</p>
          </div>

          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-green-200 via-purple-200 to-teal-200 transform -translate-y-1/2"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={step.step} className="relative">
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 text-center hover:shadow-xl transition-shadow duration-300">
                    {/* Step Number */}
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="w-8 h-8 bg-white border-4 border-gray-200 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-600">{step.step}</span>
                      </div>
                    </div>

                    {/* Icon */}
                    <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center mx-auto mb-4 mt-4`}>
                      <step.icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.details}</p>
                  </div>

                  {/* Arrow for mobile */}
                  {index < steps.length - 1 && (
                    <div className="md:hidden flex justify-center mt-4 mb-4">
                      <ArrowRightIcon className="w-6 h-6 text-gray-400 transform rotate-90" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Features */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose CivicConnect?</h2>
            <p className="text-lg text-gray-600">Powerful features that make civic engagement effortless</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Demo Video Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8 md:p-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">See It In Action</h2>
              <p className="text-lg text-gray-600 mb-8">Watch our quick demo to see how easy it is to report and track civic issues</p>
              
              <div className="relative max-w-2xl mx-auto">
                <div className="aspect-video bg-gray-200 rounded-xl flex items-center justify-center">
                  <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                    <PlayCircleIcon className="w-10 h-10 text-teal-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Join thousands of citizens already using CivicConnect to make their communities better
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/report-issue')}
                className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Report Your First Issue
              </button>
              <button 
                onClick={() => navigate('/')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors"
              >
                View Dashboard
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HowItWorks;
