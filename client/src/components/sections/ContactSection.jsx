// components/sections/ContactSection.jsx
import React from 'react';
import {
  BuildingOfficeIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const ContactSection = () => {
  const contacts = [
    {
      icon: BuildingOfficeIcon,
      title: 'City Hall',
      details: '123 Municipal Street, City Center',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      icon: PhoneIcon,
      title: 'Emergency Hotline',
      details: '+1 (555) 311-CITY',
      color: 'text-green-600 bg-green-50'
    },
    {
      icon: EnvelopeIcon,
      title: 'Email Support',
      details: 'support@cityname.gov',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      icon: GlobeAltIcon,
      title: 'Website',
      details: 'www.cityname.gov',
      color: 'text-teal-600 bg-teal-50'
    }
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Municipal Contact Information
          </h2>
          <p className="text-gray-600 text-lg">
            Get in touch with us through various channels
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contacts.map((contact, index) => {
            const Icon = contact.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 ${contact.color} rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">
                  {contact.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {contact.details}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
