// src/pages/PublicLanding.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircleIcon,
  EyeIcon,
  MapPinIcon,
  UsersIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowRightIcon,
  PlayCircleIcon,
  ClockIcon,
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon,
  EnvelopeIcon,
  PhoneIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const PublicLanding = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const navigationItems = [
    { label: 'How it Works', href: '/how-it-works' },
    { label: 'Services', href: '/services' },
    { label: 'Help & Support', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'About', href: '/about' }
  ];

  const features = [
    {
      icon: PlusCircleIcon,
      title: "Report Issues",
      description: "Easily report civic problems with photos and GPS location tracking",
      color: "from-green-500 to-green-600",
      benefits: ["📍 GPS location auto-detection", "📱 Photo upload support", "⚡ Real-time submission"]
    },
    {
      icon: EyeIcon,
      title: "Track Progress",
      description: "Follow your reports and see real-time updates from municipal authorities",
      color: "from-blue-500 to-blue-600",
      benefits: ["📊 Status dashboard", "🔔 Push notifications", "📈 Progress timeline"]
    },
    {
      icon: MapPinIcon,
      title: "Community Map",
      description: "View issues in your neighborhood on interactive maps with filtering",
      color: "from-purple-500 to-purple-600",
      benefits: ["🗺️ Interactive map view", "🔍 Smart filtering", "📍 Nearby issues"]
    },
    {
      icon: UsersIcon,
      title: "Civic Engagement",
      description: "Connect with neighbors, build civic score, and make a real difference",
      color: "from-teal-500 to-teal-600",
      benefits: ["🏆 Civic score system", "👥 Community forums", "🌟 Achievement badges"]
    }
  ];

  const stats = [
    { number: "50,000+", label: "Issues Resolved", description: "Successfully resolved civic issues" },
    { number: "25+", label: "Cities Served", description: "Active municipalities using our platform" },
    { number: "100,000+", label: "Active Citizens", description: "Engaged community members" },
    { number: "95%", label: "Satisfaction Rate", description: "Citizens satisfied with resolution process" }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      location: "Downtown Resident",
      text: "I reported a pothole on Monday and it was fixed by Thursday! This platform really works.",
      rating: 5,
      issue: "Pothole Repair",
      avatar: "🧑‍💼"
    },
    {
      name: "Mike Chen",
      location: "Community Volunteer",
      text: "Love seeing how engaged our community has become. My civic score motivates me to help more.",
      rating: 5,
      issue: "Street Cleaning",
      avatar: "👨‍🔬"
    },
    {
      name: "Emily Rodriguez",
      location: "Local Business Owner",
      text: "Finally, a way to get the city's attention on issues that matter to our neighborhood.",
      rating: 5,
      issue: "Streetlight Repair",
      avatar: "👩‍💼"
    }
  ];

  const faqItems = [
    {
      question: "How do I report a civic issue?",
      answer: "Simply sign up, click 'Report Issue', add photos and location details, and submit. You'll get a tracking number to follow progress."
    },
    {
      question: "Is CivicConnect really free?",
      answer: "Yes! CivicConnect is completely free for citizens. Our platform is funded by municipal partnerships to serve the community."
    },
    {
      question: "How long does it take to resolve issues?",
      answer: "Resolution times vary by issue type and severity. Critical issues are typically addressed within 24-48 hours, while routine matters may take 3-7 business days."
    },
    {
      question: "Can I see issues reported by my neighbors?",
      answer: "Absolutely! You can view all public issues in your area on our community map and even support reports that affect you too."
    }
  ];

  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Consistent with Original Design */}
      <header className="bg-gradient-to-r from-teal-700 to-sky-600 text-white sticky top-0 z-50 shadow-lg">
        <div className="max-w-screen mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-4">
              <div className="text-3xl bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                🏛️
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold tracking-tight">CivicConnect</h1>
                <p className="text-sm opacity-90">Your Voice, Our Community</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => navigate(item.href)}
                  className="text-sm font-medium hover:text-teal-200 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-white/10"
                >
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              {/* Current Time */}
              <div className="hidden lg:flex items-center space-x-2 bg-white/15 px-3 py-2 rounded-full backdrop-blur-sm">
                <ClockIcon className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {currentTime.toLocaleString()}
                </span>
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => navigate('/login')}
                  className="hidden sm:block text-sm font-medium hover:text-teal-200 transition-colors px-3 py-2 rounded-md hover:bg-white/10"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate('/signup')}
                  className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg font-medium transition-colors backdrop-blur-sm border border-white/30"
                >
                  Get Started
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-white/10"
              >
                {isMenuOpen ? (
                  <XMarkIcon className="w-6 h-6" />
                ) : (
                  <Bars3Icon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/20">
              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-2 mb-4">
                {navigationItems.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      navigate(item.href);
                      setIsMenuOpen(false);
                    }}
                    className="text-sm font-medium hover:text-teal-200 transition-colors px-3 py-2 rounded-md hover:bg-white/10 text-left"
                  >
                    {item.label}
                  </button>
                ))}
              </nav>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col space-y-2 px-3">
                <button 
                  onClick={() => {
                    navigate('/login');
                    setIsMenuOpen(false);
                  }}
                  className="bg-white/20 text-white px-4 py-2 rounded-lg font-medium text-center"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => {
                    navigate('/signup');
                    setIsMenuOpen(false);
                  }}
                  className="bg-white text-teal-600 px-4 py-2 rounded-lg font-medium text-center"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-teal-50">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Make Your Community
            <br />
            <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              Better Together
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Report civic issues, track progress, and engage with your community. 
            Join thousands of citizens already making a difference in their neighborhoods.
          </p>

          {/* Primary CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button 
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-teal-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-teal-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Join CivicConnect Free</span>
              <ArrowRightIcon className="w-5 h-5" />
            </button>
            <button 
              onClick={() => navigate('/how-it-works')}
              className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-teal-500 hover:text-teal-600 transition-colors flex items-center justify-center space-x-2"
            >
              <PlayCircleIcon className="w-5 h-5" />
              <span>See How It Works</span>
            </button>
          </div>

          {/* Demo Video/Screenshot */}
          <div className="relative max-w-4xl mx-auto group">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
              <div className="text-center p-8">
                <PlayCircleIcon className="w-20 h-20 text-teal-600 mx-auto mb-4 group-hover:scale-110 transition-transform cursor-pointer" />
                <p className="text-gray-600 font-medium">Platform Demo Video</p>
                <p className="text-sm text-gray-500 mt-2">See CivicConnect in action (2:30)</p>
              </div>
            </div>
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-2xl cursor-pointer flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-teal-600 text-white px-6 py-3 rounded-lg font-medium">
                ▶ Watch Demo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Trusted by Communities Nationwide</h2>
            <p className="text-lg text-gray-600">Real impact, real results</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-teal-600 mb-2 group-hover:scale-110 transition-transform">
                  {stat.number}
                </div>
                <div className="text-gray-800 font-semibold mb-1">{stat.label}</div>
                <div className="text-sm text-gray-500">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Everything You Need for Civic Engagement
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform makes it easy to report issues, track progress, and connect with your community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-2">
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="text-sm text-gray-500 space-y-1">
                  {feature.benefits.map((benefit, idx) => (
                    <li key={idx}>{benefit}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Simple 3-Step Process</h2>
            <p className="text-lg text-gray-600">Get started in minutes, make impact immediately</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { step: "1", title: "Sign Up & Verify", description: "Create your free account with email verification", icon: "👋" },
              { step: "2", title: "Report Issues", description: "Snap a photo, add location, and submit your report", icon: "📱" },
              { step: "3", title: "Track Progress", description: "Get updates and see your community improve", icon: "📈" }
            ].map((item, index) => (
              <div key={index} className="text-center relative">
                <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl">
                  {item.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-12 border-t-2 border-dashed border-gray-300"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Community Says</h2>
            <p className="text-lg text-gray-600">Real stories from citizens making a difference</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                <div className="flex items-center space-x-4">
                  <div className="text-3xl">{testimonial.avatar}</div>
                  <div>
                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                    <p className="text-xs text-teal-600 font-medium">✓ Resolved: {testimonial.issue}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Everything you need to know to get started</p>
          </div>

          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-800">{faq.question}</span>
                  <ChevronDownIcon className={`w-5 h-5 text-gray-500 transition-transform ${
                    expandedFaq === index ? 'rotate-180' : ''
                  }`} />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-4 text-gray-600 border-t border-gray-100 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-teal-100 mb-8">
            Join CivicConnect today and start making your community better
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button 
              onClick={() => navigate('/signup')}
              className="bg-white text-teal-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors transform hover:scale-105 shadow-lg"
            >
              Create Your Account Now
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white hover:text-teal-600 transition-colors"
            >
              I Already Have an Account
            </button>
          </div>
          <p className="text-sm text-teal-200">
            ✓ Free to join • ✓ No credit card required • ✓ Start making impact immediately
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl">🏛️</span>
                <span className="text-xl font-bold">CivicConnect</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering communities through technology and civic engagement.
              </p>
              <div className="flex space-x-4">
                <button className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  📘
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Twitter</span>
                  🐦
                </button>
                <button className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  💼
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-3 text-gray-400">
                <li><button onClick={() => navigate('/how-it-works')} className="hover:text-white transition-colors">How it Works</button></li>
                <li><button onClick={() => navigate('/services')} className="hover:text-white transition-colors">Services</button></li>
                <li><button onClick={() => navigate('/about')} className="hover:text-white transition-colors">About Us</button></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><button onClick={() => navigate('/help')} className="hover:text-white transition-colors">Help Center</button></li>
                <li><button onClick={() => navigate('/contact')} className="hover:text-white transition-colors">Contact Us</button></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Get Started</h3>
              <button 
                onClick={() => navigate('/signup')}
                className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 transition-colors w-full mb-3"
              >
                Join Now
              </button>
              <p className="text-sm text-gray-400">
                Start making a difference in your community today.
              </p>
            </div>
          </div>
          
          {/* Contact Info */}
          <div className="border-t border-gray-700 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="flex items-center space-x-3">
                <EnvelopeIcon className="w-5 h-5 text-teal-400" />
                <span className="text-gray-400">support@civicconnect.gov</span>
              </div>
              <div className="flex items-center space-x-3">
                <PhoneIcon className="w-5 h-5 text-teal-400" />
                <span className="text-gray-400">+1 (555) 311-CIVIC</span>
              </div>
              <div className="flex items-center space-x-3">
                <BuildingOfficeIcon className="w-5 h-5 text-teal-400" />
                <span className="text-gray-400">123 Municipal St, City Center</span>
              </div>
            </div>
            
            <div className="text-center text-gray-400">
              <p>&copy; 2025 CivicConnect. All rights reserved. | Making communities better, one report at a time.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLanding;
