// src/pages/ContactUs.jsx
import React, { useState } from 'react';
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  BuildingOfficeIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import Header from '../components/common/Header';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: '',
    message: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactMethods = [
    {
      icon: PhoneIcon,
      title: "Phone Support",
      description: "Call us for immediate assistance",
      contact: "+1 (555) 311-CITY",
      hours: "24/7 for emergencies, 9 AM - 6 PM for general inquiries",
      color: "from-green-500 to-green-600"
    },
    {
      icon: EnvelopeIcon,
      title: "Email Support",
      description: "Send us detailed inquiries",
      contact: "support@civicconnect.gov",
      hours: "Response within 24 hours",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: "Live Chat",
      description: "Chat with our support team",
      contact: "Available on website",
      hours: "9 AM - 9 PM, Monday to Saturday",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: MapPinIcon,
      title: "Visit Us",
      description: "Come to our office",
      contact: "123 Municipal Street, City Center",
      hours: "9 AM - 5 PM, Monday to Friday",
      color: "from-teal-500 to-teal-600"
    }
  ];

  const departments = [
    {
      name: "General Inquiries",
      phone: "+1 (555) 311-0001",
      email: "info@civicconnect.gov",
      description: "General questions and information"
    },
    {
      name: "Technical Support",
      phone: "+1 (555) 311-0002", 
      email: "tech@civicconnect.gov",
      description: "App issues and technical problems"
    },
    {
      name: "Emergency Services",
      phone: "+1 (555) 311-0911",
      email: "emergency@civicconnect.gov",
      description: "Urgent civic emergencies only"
    },
    {
      name: "Complaint Resolution",
      phone: "+1 (555) 311-0003",
      email: "complaints@civicconnect.gov",
      description: "Follow up on reported issues"
    }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        category: '',
        message: '',
        priority: 'medium'
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
        <Header />
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 to-sky-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              We're here to help! Reach out to us through any of the channels below
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Contact Methods */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className={`w-12 h-12 bg-gradient-to-br ${method.color} rounded-lg flex items-center justify-center mb-4`}>
                  <method.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{method.title}</h3>
                <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                <p className="font-medium text-gray-800 mb-2">{method.contact}</p>
                <p className="text-xs text-gray-500">{method.hours}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form and Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Send us a Message</h2>
            
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Message Sent!</h3>
                <p className="text-gray-600">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-teal-600 hover:text-teal-800 font-medium"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    >
                      <option value="">Select a category</option>
                      <option value="general">General Inquiry</option>
                      <option value="technical">Technical Support</option>
                      <option value="complaint">Complaint Follow-up</option>
                      <option value="suggestion">Suggestion</option>
                      <option value="emergency">Emergency</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject *</label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Brief description of your inquiry"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <div className="flex space-x-4">
                    {['low', 'medium', 'high'].map((priority) => (
                      <label key={priority} className="flex items-center">
                        <input
                          type="radio"
                          name="priority"
                          value={priority}
                          checked={formData.priority === priority}
                          onChange={handleInputChange}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{priority}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                    placeholder="Please provide detailed information about your inquiry..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-teal-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-teal-700 hover:to-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Office Hours */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <ClockIcon className="w-6 h-6 text-teal-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">Office Hours</h3>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Monday - Friday:</span>
                  <span className="font-medium">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Saturday:</span>
                  <span className="font-medium">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday:</span>
                  <span className="font-medium">Closed</span>
                </div>
                <div className="flex justify-between border-t pt-2 mt-3">
                  <span>Emergency Line:</span>
                  <span className="font-medium text-red-600">24/7 Available</span>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <BuildingOfficeIcon className="w-6 h-6 text-teal-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">Visit Our Office</h3>
              </div>
              <div className="text-gray-600">
                <p className="mb-2">CivicConnect Municipal Office</p>
                <p className="mb-2">123 Municipal Street</p>
                <p className="mb-4">City Center, State 12345</p>
                <p className="text-sm">Parking available on-site</p>
                <p className="text-sm">Wheelchair accessible</p>
              </div>
            </div>

            {/* Emergency Notice */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-center mb-3">
                <ExclamationTriangleIcon className="w-6 h-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-red-800">Emergency Situations</h3>
              </div>
              <p className="text-red-700 text-sm mb-3">
                For immediate emergencies requiring urgent municipal response, please call our 24/7 emergency line:
              </p>
              <p className="text-xl font-bold text-red-800">+1 (555) 311-0911</p>
            </div>
          </div>
        </div>

        {/* Department Contacts */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Department Contacts</h2>
            <p className="text-lg text-gray-600">Direct contact information for specific departments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departments.map((dept, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{dept.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{dept.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <PhoneIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">{dept.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <EnvelopeIcon className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">{dept.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ContactUs;
