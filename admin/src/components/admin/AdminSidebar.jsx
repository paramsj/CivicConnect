// src/components/admin/AdminSidebar.jsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  ChartBarIcon,
  MapIcon,
  DocumentTextIcon,
  UsersIcon,
  CogIcon,
  BellIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const AdminSidebar = ({ isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: HomeIcon,
      current: location.pathname === '/admin' || location.pathname === '/admin/' || location.pathname === '/admin/dashboard' || location.pathname === '/' || location.pathname === '/dashboard'
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: ChartBarIcon,
      current: location.pathname === '/admin/analytics'
    },
    {
      name: 'Map View',
      href: '/admin/map-view',
      icon: MapIcon,
      current: location.pathname === '/admin/map-view'
    },
    {
      name: 'All Reports',
      href: '/admin/reports',
      icon: DocumentTextIcon,
      current: location.pathname === '/admin/reports',
      badge: '247'
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: UsersIcon,
      current: location.pathname === '/admin/users'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: CogIcon,
      current: location.pathname === '/admin/settings'
    }
  ];

  const quickActions = [
    {
      name: 'Critical Issues',
      count: '12',
      color: 'bg-red-500',
      icon: ExclamationTriangleIcon
    },
    {
      name: 'Pending Reviews',
      count: '34',
      color: 'bg-yellow-500',
      icon: BellIcon
    }
  ];

  return (
    <div className={`fixed left-0 top-16 bottom-0 bg-white shadow-xl transition-all duration-300 z-40 ${
      isOpen ? 'w-64' : 'w-16'
    }`}>
      <div className="flex flex-col h-full">
        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.href)}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  item.current
                    ? 'bg-slate-100 text-slate-900 border-r-2 border-slate-900'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className={`flex-shrink-0 w-5 h-5 ${isOpen ? 'mr-3' : 'mx-auto'}`} />
                {isOpen && (
                  <>
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto bg-gray-200 text-gray-800 text-xs font-medium px-2 py-1 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Actions */}
        {isOpen && (
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center p-2 bg-gray-50 rounded-lg"
                  >
                    <div className={`p-1 rounded ${action.color}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-gray-900">{action.name}</p>
                      <p className="text-xs text-gray-500">{action.count} items</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sidebar Footer */}
        <div className={`p-4 border-t border-gray-200 ${isOpen ? 'block' : 'hidden'}`}>
          <div className="text-xs text-gray-500 text-center">
            <p>CivicConnect Admin v2.1</p>
            <p>© 2025 Municipal Systems</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
