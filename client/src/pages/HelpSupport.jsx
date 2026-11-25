// src/pages/HelpSupport.jsx
import React, { useState } from 'react';
import Header from '../components/common/Header';
import {
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  ExclamationCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlayCircleIcon,
  DocumentTextIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

const HelpSupport = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const helpCategories = [
    { id: 'all', name: 'All Topics', count: 45 },
    { id: 'getting-started', name: 'Getting Started', count: 12 },
    { id: 'reporting', name: 'Reporting Issues', count: 15 },
    { id: 'tracking', name: 'Tracking & Updates', count: 8 },
    { id: 'account', name: 'Account & Profile', count: 7 },
    { id: 'technical', name: 'Technical Issues', count: 3 }
  ];

  const faqs = [
    {
      id: 1,
      category: 'getting-started',
      question: 'How do I create an account on CivicConnect?',
      answer: 'To create an account, click the "Sign Up" button on the homepage, provide your email, phone number, and create a secure password. You\'ll receive a verification email to activate your account.'
    },
    {
      id: 2,
      category: 'reporting',
      question: 'What types of issues can I report?',
      answer: 'You can report various civic issues including potholes, streetlight outages, garbage collection problems, drainage issues, traffic signal malfunctions, illegal parking, and other municipal concerns.'
    },
    {
      id: 3,
      category: 'reporting',
      question: 'How do I add photos to my report?',
      answer: 'When creating a report, click the "Add Photos" button in the form. You can upload up to 5 photos from your device. Photos help authorities better understand and resolve the issue.'
    },
    {
      id: 4,
      category: 'tracking',
      question: 'How can I track the status of my reported issue?',
      answer: 'Go to "My Reports" in your dashboard to see all your submitted issues. Each report shows its current status: Submitted, In Progress, or Resolved. You\'ll also receive email notifications for status updates.'
    },
    {
      id: 5,
      category: 'tracking',
      question: 'How long does it typically take to resolve an issue?',
      answer: 'Resolution times vary by issue type and severity. Critical issues are addressed within 24-48 hours, while non-urgent matters may take 3-7 business days. You can see average resolution times on our dashboard.'
    },
    {
      id: 6,
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Click on your profile icon in the top right corner and select "Profile Settings." You can update your name, email, phone number, and notification preferences.'
    },
    {
      id: 7,
      category: 'account',
      question: 'I forgot my password. How can I reset it?',
      answer: 'On the login page, click "Forgot Password" and enter your email. You\'ll receive a password reset link. Click the link and follow the instructions to create a new password.'
    },
    {
      id: 8,
      category: 'technical',
      question: 'The app is not working properly. What should I do?',
      answer: 'Try refreshing your browser or restarting the app. If problems persist, clear your browser cache or update the app to the latest version. Contact our technical support if issues continue.'
    }
  ];

  const videoTutorials = [
    {
      title: 'Getting Started with CivicConnect',
      duration: '3:24',
      thumbnail: '/api/placeholder/300/200',
      description: 'Learn how to create an account and navigate the platform'
    },
    {
      title: 'How to Report a Civic Issue',
      duration: '4:12',
      thumbnail: '/api/placeholder/300/200',
      description: 'Step-by-step guide to reporting and tracking issues'
    },
    {
      title: 'Understanding Your Dashboard',
      duration: '2:45',
      thumbnail: '/api/placeholder/300/200',
      description: 'Tour of the dashboard features and analytics'
    }
  ];

  const supportOptions = [
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Chat',
      description: 'Chat with our support team',
      availability: 'Available 9 AM - 9 PM',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: PhoneIcon,
      title: 'Phone Support',
      description: 'Call us for immediate help',
      availability: '24/7 for emergencies',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: DocumentTextIcon,
      title: 'Submit Ticket',
      description: 'Email detailed questions',
      availability: 'Response within 24 hours',
      color: 'from-purple-500 to-purple-600'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (faqId) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <div className="min-h-screen bg-gray-50">
        <Header />
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 to-sky-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Help & Support</h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto mb-8">
              Find answers to common questions and get the help you need
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for help articles, tutorials, or FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-0 text-gray-800 placeholder-gray-500 focus:ring-4 focus:ring-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Support Options */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Get Immediate Help</h2>
            <p className="text-lg text-gray-600">Choose the support option that works best for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supportOptions.map((option, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center hover:shadow-xl transition-shadow">
                <div className={`w-16 h-16 bg-gradient-to-br ${option.color} rounded-xl flex items-center justify-center mx-auto mb-4`}>
                  <option.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-3">{option.description}</p>
                <p className="text-sm text-gray-500 font-medium">{option.availability}</p>
                <button className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-lg transition-colors">
                  Get Help
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Video Tutorials */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Video Tutorials</h2>
            <p className="text-lg text-gray-600">Learn visually with our step-by-step video guides</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videoTutorials.map((video, index) => (
              <div key={index} className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="relative">
                  <div className="aspect-video bg-gray-200 flex items-center justify-center">
                    <PlayCircleIcon className="w-16 h-16 text-teal-600 hover:text-teal-700 cursor-pointer" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{video.title}</h3>
                  <p className="text-gray-600 text-sm">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Quick answers to common questions</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Category Filter */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
                <div className="space-y-2">
                  {helpCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-teal-100 text-teal-800 font-medium'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>{category.name}</span>
                      <span className="float-right text-sm text-gray-400">({category.count})</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* FAQ List */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-xl shadow-lg border border-gray-100">
                {filteredFaqs.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <QuestionMarkCircleIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No FAQs found matching your search criteria.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredFaqs.map((faq, index) => (
                      <div key={faq.id} className="p-6">
                        <button
                          onClick={() => toggleFaq(faq.id)}
                          className="w-full flex items-center justify-between text-left"
                        >
                          <h3 className="text-lg font-medium text-gray-800 pr-4">
                            {faq.question}
                          </h3>
                          {expandedFaq === faq.id ? (
                            <ChevronUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          ) : (
                            <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </button>
                        
                        {expandedFaq === faq.id && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Still Need Help */}
        <section className="mt-16 text-center">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Still Need Help?</h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Can't find what you're looking for? Our support team is here to help
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                Contact Support
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors">
                Submit a Ticket
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpSupport;
