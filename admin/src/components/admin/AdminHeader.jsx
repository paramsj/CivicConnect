// src/components/admin/AdminHeader.jsx
import React, { useState } from 'react';
import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  ChevronDownIcon,
  CogIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

const AdminHeader = ({ sidebarOpen, toggleSidebar }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New report submitted', time: '2 min ago', unread: true },
    { id: 2, title: 'Report marked as resolved', time: '1 hour ago', unread: true },
    { id: 3, title: 'System maintenance scheduled', time: '2 hours ago', unread: false },
  ]);
  
  const currentTime = new Date().toLocaleString();
  const unreadCount = notifications.filter(n => n.unread).length;

  const adminUser = {
    name: "Admin User",
    role: "System Administrator",
    email: "admin@civicconnect.gov",
    avatar: "👨‍💼"
  };

  return (
    <header className="bg-gradient-to-r from-teal-700 to-sky-600 text-white sticky top-0 z-50 shadow-lg">
      <div className="min-w-screen mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 ">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="text-2xl bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                🏛️
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold">CivicConnect Admin</h1>
                <p className="text-xs text-gray-300">Municipal Management System</p>
              </div>
            </div>
          </div>

          {/* Center - Search */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search reports, users, or analytics..."
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Current Time */}
            <div className="hidden lg:flex items-center space-x-2 bg-white/10 px-3 py-2 rounded-lg backdrop-blur-sm">
              <ClockIcon className="w-4 h-4" />
              <span className="text-sm font-medium">{currentTime}</span>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button className="relative p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm">
                <BellIcon className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-3 bg-white/10 px-3 py-2 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <div className="text-2xl">{adminUser.avatar}</div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold">{adminUser.name}</p>
                  <p className="text-xs text-gray-300">{adminUser.role}</p>
                </div>
                <ChevronDownIcon className="w-4 h-4" />
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 text-gray-700 z-50 border border-gray-200">
                  <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                    <p className="text-sm font-medium text-gray-800">{adminUser.name}</p>
                    <p className="text-xs text-gray-500">{adminUser.email}</p>
                  </div>
                  
                  <div className="py-2">
                    <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100">
                      <UserCircleIcon className="w-4 h-4 mr-3" />
                      Profile Settings
                    </button>
                    <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100">
                      <CogIcon className="w-4 h-4 mr-3" />
                      System Settings
                    </button>
                  </div>
                  
                  <div className="border-t border-gray-100 py-2">
                    <button className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
