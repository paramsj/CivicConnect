// src/components/common/Header.jsx
import React, { useState } from 'react';
import {
  ClockIcon,
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useApp } from '../../contexts/AppContext';

const Header = () => {
  const { currentTime, user, logout } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigationItems = [
    { label: 'Home', href: '/' },
    { label: 'How it Works', href: '/how-it-works' },
    { label: 'Services', href: '/services' },
    { label: 'Help & Support', href: '/help' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'About', href: '/about' }
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    // Optionally navigate to login page
    window.location.href = '/';
  };

  return (
    <header className="bg-gradient-to-r from-teal-700 to-sky-600 text-white sticky top-0 z-50 shadow-lg">
      <div className="min-w-screen mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="text-3xl bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              🏛️
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold tracking-tight">CivicConnect</h1>
              <p className="text-sm opacity-90">Municipal Management System</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm font-medium hover:text-teal-200 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-white/10"
              >
                {item.label}
              </a>
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

            {/* Notifications */}
            <button className="relative p-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors backdrop-blur-sm">
              <BellIcon className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 bg-white/15 px-3 py-2 rounded-full hover:bg-white/25 transition-colors backdrop-blur-sm"
              >
                <UserCircleIcon className="w-8 h-8" />
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-semibold">{user?.name}</p>
                  <p className="text-xs opacity-80">{user?.role}</p>
                </div>
                <ChevronDownIcon className="w-4 h-4" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 text-gray-700 z-50">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  {/* 
                  <a href="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</a>
                  <a href="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</a>
                  */}
                  <a href="/reports" className="block px-4 py-2 hover:bg-gray-100">My Reports</a>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                  >
                    Sign Out
                  </button>
                </div>
              )}
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
            <nav className="flex flex-col space-y-2">
              {navigationItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium hover:text-teal-200 transition-colors px-3 py-2 rounded-md hover:bg-white/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
