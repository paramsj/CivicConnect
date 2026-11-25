// src/pages/Services.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
// import {Header} from '../components/common/Header';
import {
  WrenchScrewdriverIcon,
  LightBulbIcon,
  TrashIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  TruckIcon,
  ExclamationTriangleIcon,
  PhoneIcon,
  ClockIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';
import Header from '../components/common/Header';

const Services = () => {
  const navigate = useNavigate();

  const mainServices = [
    {
      icon: WrenchScrewdriverIcon,
      title: "Infrastructure Maintenance",
      description: "Report and track road repairs, pothole fixes, and general infrastructure maintenance issues.",
      features: ["Road Repairs", "Pothole Reporting", "Bridge Maintenance", "Sidewalk Issues"],
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: LightBulbIcon,
      title: "Utilities Management",
      description: "Handle streetlight outages, electrical issues, and water supply problems efficiently.",
      features: ["Streetlight Repairs", "Power Outages", "Water Supply Issues", "Gas Line Problems"],
      color: "from-yellow-500 to-orange-500",
      bgColor: "bg-yellow-50"
    },
    {
      icon: TrashIcon,
      title: "Waste Management",
      description: "Manage garbage collection, recycling programs, and waste disposal complaints.",
      features: ["Garbage Collection", "Recycling Programs", "Illegal Dumping", "Waste Disposal"],
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: TruckIcon,
      title: "Traffic & Transportation",
      description: "Address traffic signal issues, parking violations, and transportation concerns.",
      features: ["Traffic Signals", "Parking Issues", "Road Signs", "Public Transport"],
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50"
    },
    {
      icon: BuildingOffice2Icon,
      title: "Public Buildings",
      description: "Maintain parks, community centers, libraries, and other public facilities.",
      features: ["Parks Maintenance", "Community Centers", "Public Libraries", "Recreational Facilities"],
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: ExclamationTriangleIcon,
      title: "Emergency Services",
      description: "Handle urgent civic issues that require immediate attention and response.",
      features: ["Emergency Repairs", "Safety Hazards", "Natural Disasters", "Public Safety"],
      color: "from-red-600 to-pink-600",
      bgColor: "bg-red-50"
    }
  ];

  const additionalServices = [
    {
      icon: PhoneIcon,
      title: "24/7 Support",
      description: "Round-the-clock customer support for urgent civic issues and general inquiries."
    },
    {
      icon: ClockIcon,
      title: "Real-time Tracking",
      description: "Track the progress of your reported issues with live updates and status notifications."
    },
    {
      icon: UserGroupIcon,
      title: "Community Forums",
      description: "Engage with your neighbors and local authorities through our community discussion platform."
    },
    {
      icon: ChartBarIcon,
      title: "Performance Analytics",
      description: "Access detailed reports and analytics on municipal performance and issue resolution."
    },
    {
      icon: ShieldCheckIcon,
      title: "Data Security",
      description: "Your personal information and reports are protected with enterprise-grade security."
    },
    {
      icon: MapPinIcon,
      title: "Location Services",
      description: "Precise GPS location tracking ensures issues are reported to the correct departments."
    }
  ];

  const serviceStats = [
    { number: "50,000+", label: "Issues Resolved" },
    { number: "95%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support Available" },
    { number: "15", label: "Service Categories" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
        <Header />
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 to-sky-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">Our Services</h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              Comprehensive civic services to keep your community running smoothly and efficiently
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {serviceStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-teal-600 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Services */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Core Service Categories</h2>
            <p className="text-lg text-gray-600">We cover all aspects of municipal services and civic management</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mainServices.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className={`${service.bgColor} p-6`}>
                  <div className={`w-16 h-16 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center mb-4`}>
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{service.title}</h3>
                </div>
                
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Additional Services */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Additional Features</h2>
            <p className="text-lg text-gray-600">Enhanced services to improve your civic engagement experience</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {additionalServices.map((service, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <service.icon className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Service Process */}
        <section className="mb-20">
          <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Service Commitment</h2>
              <p className="text-lg text-gray-600">We guarantee quality service delivery with measurable results</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Quick Response</h3>
                <p className="text-gray-600">Issues are acknowledged within 2 hours of submission</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Expert Resolution</h3>
                <p className="text-gray-600">Qualified professionals handle your civic concerns</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Follow-up</h3>
                <p className="text-gray-600">We ensure satisfaction and quality completion</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Need Our Services?</h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Report an issue or browse our dashboard to see how we're serving your community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/report-issue')}
                className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Report an Issue
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors"
              >
                Contact Support
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Services;
