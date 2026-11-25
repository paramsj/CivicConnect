// src/pages/About.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BuildingOfficeIcon,
  UsersIcon,
  ChartBarIcon,
  HeartIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  GlobeAltIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import Header from '../components/common/Header';

const About = () => {
  const navigate = useNavigate();

  const stats = [
    { number: '50,000+', label: 'Issues Resolved', icon: ChartBarIcon },
    { number: '25+', label: 'Cities Served', icon: BuildingOfficeIcon },
    { number: '100,000+', label: 'Active Citizens', icon: UsersIcon },
    { number: '95%', label: 'Satisfaction Rate', icon: StarIcon }
  ];

  const values = [
    {
      icon: HeartIcon,
      title: 'Community First',
      description: 'We believe in putting community needs at the center of everything we do, ensuring every citizen has a voice in municipal governance.'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Transparency',
      description: 'Open governance through real-time tracking, public dashboards, and clear communication about issue resolution processes.'
    },
    {
      icon: LightBulbIcon,
      title: 'Innovation',
      description: 'Leveraging cutting-edge technology to create smarter, more efficient solutions for municipal challenges.'
    },
    {
      icon: GlobeAltIcon,
      title: 'Accessibility',
      description: 'Making civic engagement accessible to everyone, regardless of technical knowledge or physical ability.'
    }
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Chief Executive Officer',
      image: '/api/placeholder/300/400',
      description: 'Former city planner with 15+ years in municipal management.'
    },
    {
      name: 'Michael Chen',
      role: 'Chief Technology Officer',
      image: '/api/placeholder/300/400',
      description: 'Tech entrepreneur passionate about smart city solutions.'
    },
    {
      name: 'Dr. Emily Rodriguez',
      role: 'Head of Community Relations',
      image: '/api/placeholder/300/400',
      description: 'PhD in Public Administration, community engagement expert.'
    },
    {
      name: 'David Kim',
      role: 'Head of Operations',
      image: '/api/placeholder/300/400',
      description: 'Operations specialist with experience in large-scale implementations.'
    }
  ];

  const timeline = [
    {
      year: '2019',
      title: 'Company Founded',
      description: 'CivicConnect was founded with a mission to bridge the gap between citizens and local government.'
    },
    {
      year: '2020',
      title: 'First City Partnership',
      description: 'Successfully launched our platform in partnership with Metro City, resolving over 1,000 issues in the first month.'
    },
    {
      year: '2021',
      title: 'Multi-City Expansion',
      description: 'Expanded to serve 10 cities across the region, handling over 25,000 civic issues annually.'
    },
    {
      year: '2022',
      title: 'Award Recognition',
      description: 'Received the Smart City Innovation Award for outstanding contribution to municipal technology.'
    },
    {
      year: '2023',
      title: 'National Growth',
      description: 'Reached 25+ cities nationwide with over 100,000 active users and 95% satisfaction rate.'
    },
    {
      year: '2024',
      title: 'AI Integration',
      description: 'Launched AI-powered issue categorization and predictive analytics for proactive municipal management.'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
        <Header />
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 to-sky-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">About CivicConnect</h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              Empowering communities through technology, transparency, and citizen engagement
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Mission Statement */}
        <section className="mb-20 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg border border-gray-100">
            <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
              To create stronger, more responsive communities by providing citizens with direct access to municipal services, 
              transparent communication channels, and real-time tracking of civic issues. We believe technology should serve 
              people, making government more accessible and accountable to those it serves.
            </p>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Our Story */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600">
                <p>
                  CivicConnect was born from a simple observation: citizens wanted to report civic issues, 
                  but the process was often complicated, opaque, and frustrating. Municipal governments 
                  wanted to serve their communities better but lacked efficient tools to manage and track 
                  citizen requests.
                </p>
                <p>
                  Founded in 2019 by a team of urban planners, technologists, and community advocates, 
                  we set out to create a platform that would bridge this gap. Our solution combines 
                  user-friendly reporting tools with powerful backend systems that help municipal staff 
                  prioritize, assign, and resolve issues efficiently.
                </p>
                <p>
                  Today, CivicConnect serves over 25 cities nationwide, having facilitated the resolution 
                  of more than 50,000 civic issues. We're proud to maintain a 95% satisfaction rate while 
                  continuously innovating to serve our communities better.
                </p>
              </div>
            </div>
            <div>
              <div className="aspect-square bg-gradient-to-br from-teal-100 to-blue-100 rounded-2xl flex items-center justify-center">
                <BuildingOfficeIcon className="w-48 h-48 text-teal-600" />
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Values</h2>
            <p className="text-lg text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Journey</h2>
            <p className="text-lg text-gray-600">Key milestones in our growth and impact</p>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-teal-500 to-blue-500 h-full"></div>
            
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`w-full md:w-5/12 ${index % 2 === 0 ? 'md:pr-8' : 'md:pl-8'}`}>
                    <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                      <div className="text-2xl font-bold text-teal-600 mb-2">{item.year}</div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                  </div>
                  
                  <div className="hidden md:block w-2/12 flex-shrink-0">
                    <div className="w-4 h-4 bg-teal-500 rounded-full mx-auto border-4 border-white shadow-lg"></div>
                  </div>
                  
                  <div className="hidden md:block w-5/12"></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600">The people behind CivicConnect's success</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-teal-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm">{member.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
              Be part of the movement to make local government more responsive and transparent
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/report-issue')}
                className="bg-white text-teal-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Get Started
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-teal-600 transition-colors"
              >
                Partner With Us
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
