// src/pages/admin/AdminSettings.jsx
import React, { useState, useEffect } from 'react';
import dataService from '../../services/dataService';
import { exportToCSV, exportToExcel, exportToJSON, generateFilename, formatDateForExport } from '../../utils/exportUtils';
import {
  CogIcon,
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  CubeIcon,
  GlobeAltIcon,
  KeyIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ServerIcon,
  CpuChipIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    system: {
      siteName: 'Civic Management System',
      siteDescription: 'Comprehensive civic issue management platform',
      maintenanceMode: false,
      allowRegistration: true,
      maxFileSize: '10MB',
      sessionTimeout: '30 minutes'
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      reportUpdates: true,
      systemAlerts: true
    },
    security: {
      twoFactorAuth: true,
      passwordPolicy: 'Strong',
      sessionSecurity: 'High',
      ipWhitelist: false,
      auditLogging: true
    },
    integrations: {
      emailService: 'SMTP',
      smsService: 'Disabled',
      mapService: 'Google Maps',
      analyticsService: 'Google Analytics'
    }
  });
  
  const [systemStats, setSystemStats] = useState({
    totalReports: 0,
    totalUsers: 0,
    systemUptime: '99.9%',
    lastBackup: '2025-01-15 02:00:00'
  });
  const [loading, setLoading] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    try {
      setLoading(true);
      const [dashboardStats] = await Promise.all([
        dataService.getDashboardStats()
      ]);
      
      setSystemStats({
        totalReports: dashboardStats.totalReports,
        totalUsers: dashboardStats.totalUsers,
        systemUptime: '99.9%',
        lastBackup: new Date().toISOString().replace('T', ' ').substring(0, 19)
      });
    } catch (error) {
      console.error('Error loading system data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const saveSettings = () => {
    // In a real app, this would save to backend
    console.log('Saving settings:', settings);
    alert('Settings saved successfully!');
  };

  // Export functions
  const exportSystemDataCSV = async () => {
    try {
      setExportLoading(true);
      
      const exportData = [
        // System statistics
        { 'Metric': 'Total Reports', 'Value': systemStats.totalReports, 'Category': 'Statistics' },
        { 'Metric': 'Total Users', 'Value': systemStats.totalUsers, 'Category': 'Statistics' },
        { 'Metric': 'System Uptime', 'Value': systemStats.systemUptime, 'Category': 'Statistics' },
        { 'Metric': 'Last Backup', 'Value': systemStats.lastBackup, 'Category': 'Statistics' },
        
        // System settings
        { 'Metric': 'Site Name', 'Value': settings.system.siteName, 'Category': 'System' },
        { 'Metric': 'Maintenance Mode', 'Value': settings.system.maintenanceMode ? 'Enabled' : 'Disabled', 'Category': 'System' },
        { 'Metric': 'Allow Registration', 'Value': settings.system.allowRegistration ? 'Enabled' : 'Disabled', 'Category': 'System' },
        { 'Metric': 'Max File Size', 'Value': settings.system.maxFileSize, 'Category': 'System' },
        { 'Metric': 'Session Timeout', 'Value': settings.system.sessionTimeout, 'Category': 'System' },
        
        // Security settings
        { 'Metric': 'Two-Factor Auth', 'Value': settings.security.twoFactorAuth ? 'Enabled' : 'Disabled', 'Category': 'Security' },
        { 'Metric': 'Password Policy', 'Value': settings.security.passwordPolicy, 'Category': 'Security' },
        { 'Metric': 'Session Security', 'Value': settings.security.sessionSecurity, 'Category': 'Security' },
        { 'Metric': 'Audit Logging', 'Value': settings.security.auditLogging ? 'Enabled' : 'Disabled', 'Category': 'Security' },
        
        // Notification settings
        { 'Metric': 'Email Notifications', 'Value': settings.notifications.emailNotifications ? 'Enabled' : 'Disabled', 'Category': 'Notifications' },
        { 'Metric': 'Push Notifications', 'Value': settings.notifications.pushNotifications ? 'Enabled' : 'Disabled', 'Category': 'Notifications' },
        { 'Metric': 'Report Updates', 'Value': settings.notifications.reportUpdates ? 'Enabled' : 'Disabled', 'Category': 'Notifications' },
        { 'Metric': 'System Alerts', 'Value': settings.notifications.systemAlerts ? 'Enabled' : 'Disabled', 'Category': 'Notifications' },
        
        // Integration settings
        { 'Metric': 'Email Service', 'Value': settings.integrations.emailService, 'Category': 'Integrations' },
        { 'Metric': 'SMS Service', 'Value': settings.integrations.smsService, 'Category': 'Integrations' },
        { 'Metric': 'Map Service', 'Value': settings.integrations.mapService, 'Category': 'Integrations' },
        { 'Metric': 'Analytics Service', 'Value': settings.integrations.analyticsService, 'Category': 'Integrations' }
      ];
      
      const filename = generateFilename('system_settings');
      exportToCSV(exportData, filename);
      alert('System settings exported to CSV successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting system settings. Please try again.');
    } finally {
      setExportLoading(false);
      setShowExportMenu(false);
    }
  };

  const exportSystemDataExcel = async () => {
    try {
      setExportLoading(true);
      
      const exportData = [
        { 'Metric': 'Total Reports', 'Value': systemStats.totalReports, 'Category': 'Statistics' },
        { 'Metric': 'Total Users', 'Value': systemStats.totalUsers, 'Category': 'Statistics' },
        { 'Metric': 'System Uptime', 'Value': systemStats.systemUptime, 'Category': 'Statistics' },
        { 'Metric': 'Last Backup', 'Value': systemStats.lastBackup, 'Category': 'Statistics' },
        { 'Metric': 'Site Name', 'Value': settings.system.siteName, 'Category': 'System' },
        { 'Metric': 'Maintenance Mode', 'Value': settings.system.maintenanceMode ? 'Enabled' : 'Disabled', 'Category': 'System' },
        { 'Metric': 'Allow Registration', 'Value': settings.system.allowRegistration ? 'Enabled' : 'Disabled', 'Category': 'System' },
        { 'Metric': 'Two-Factor Auth', 'Value': settings.security.twoFactorAuth ? 'Enabled' : 'Disabled', 'Category': 'Security' },
        { 'Metric': 'Password Policy', 'Value': settings.security.passwordPolicy, 'Category': 'Security' },
        { 'Metric': 'Email Notifications', 'Value': settings.notifications.emailNotifications ? 'Enabled' : 'Disabled', 'Category': 'Notifications' },
        { 'Metric': 'Push Notifications', 'Value': settings.notifications.pushNotifications ? 'Enabled' : 'Disabled', 'Category': 'Notifications' },
        { 'Metric': 'Email Service', 'Value': settings.integrations.emailService, 'Category': 'Integrations' },
        { 'Metric': 'Map Service', 'Value': settings.integrations.mapService, 'Category': 'Integrations' }
      ];
      
      const filename = generateFilename('system_settings');
      exportToExcel(exportData, filename);
      alert('System settings exported to Excel successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting system settings. Please try again.');
    } finally {
      setExportLoading(false);
      setShowExportMenu(false);
    }
  };

  const exportSystemDataJSON = async () => {
    try {
      setExportLoading(true);
      
      const exportData = {
        exportedAt: new Date().toISOString(),
        systemStatistics: systemStats,
        settings: settings,
        summary: {
          totalSettings: Object.keys(settings).length,
          systemStatus: 'Healthy',
          lastUpdated: new Date().toISOString()
        }
      };
      
      const filename = generateFilename('system_settings');
      exportToJSON(exportData, filename);
      alert('System settings exported to JSON successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting system settings. Please try again.');
    } finally {
      setExportLoading(false);
      setShowExportMenu(false);
    }
  };

  const importData = () => {
    // In a real app, this would handle data import
    console.log('Importing data...');
    alert('Data import feature coming soon!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="space-y-4 p-2 sm:p-4 lg:p-6">
        {/* Page Header - Mobile Optimized */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 p-3 sm:p-6">
          <div className="mb-4 lg:mb-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              System Settings
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Configure system preferences and manage platform settings
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button 
              onClick={saveSettings}
              className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all duration-200 font-medium text-sm sm:text-base"
            >
              <CheckCircleIcon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Save Settings</span>
            </button>
          </div>
        </div>

        {/* System Statistics - Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl shadow-lg border-2 border-blue-200 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-500 shadow-lg">
                <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-4 flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-600 truncate">Total Reports</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">{systemStats.totalReports.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl shadow-lg border-2 border-green-200 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-green-500 shadow-lg">
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-4 flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-600 truncate">Total Users</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">{systemStats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl shadow-lg border-2 border-purple-200 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-purple-500 shadow-lg">
                <ServerIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-4 flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-600 truncate">System Uptime</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">{systemStats.systemUptime}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg sm:rounded-xl shadow-lg border-2 border-orange-200 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-orange-500 shadow-lg">
                <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-4 flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-600 truncate">Last Backup</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900">{systemStats.lastBackup}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Sections - Mobile Optimized */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* System Settings */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 p-3 sm:p-4 lg:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center">
              <CogIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              System Configuration
            </h3>
            
            <div className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={settings.system.siteName}
                  onChange={(e) => handleSettingChange('system', 'siteName', e.target.value)}
                  className="w-full border-2 border-blue-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 bg-white text-sm"
                />
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                  Site Description
                </label>
                <textarea
                  value={settings.system.siteDescription}
                  onChange={(e) => handleSettingChange('system', 'siteDescription', e.target.value)}
                  rows={3}
                  className="w-full border-2 border-blue-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 bg-white text-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">Maintenance Mode</label>
                  <p className="text-xs text-slate-500">Temporarily disable public access</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.system.maintenanceMode}
                    onChange={(e) => handleSettingChange('system', 'maintenanceMode', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">Allow Registration</label>
                  <p className="text-xs text-slate-500">Enable new user registration</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.system.allowRegistration}
                    onChange={(e) => handleSettingChange('system', 'allowRegistration', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 p-3 sm:p-4 lg:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center">
              <ShieldCheckIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-600" />
              Security Settings
            </h3>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">Two-Factor Authentication</label>
                  <p className="text-xs text-slate-500">Require 2FA for admin accounts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.security.twoFactorAuth}
                    onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                  Password Policy
                </label>
                <select
                  value={settings.security.passwordPolicy}
                  onChange={(e) => handleSettingChange('security', 'passwordPolicy', e.target.value)}
                  className="w-full border-2 border-blue-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 bg-white text-sm"
                >
                  <option value="Basic">Basic (8+ characters)</option>
                  <option value="Strong">Strong (12+ chars, mixed case, numbers)</option>
                  <option value="Very Strong">Very Strong (16+ chars, special chars)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                  Session Security
                </label>
                <select
                  value={settings.security.sessionSecurity}
                  onChange={(e) => handleSettingChange('security', 'sessionSecurity', e.target.value)}
                  className="w-full border-2 border-blue-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 bg-white text-sm"
                >
                  <option value="Low">Low (30 minutes)</option>
                  <option value="Medium">Medium (15 minutes)</option>
                  <option value="High">High (5 minutes)</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-xs sm:text-sm font-semibold text-slate-700">Audit Logging</label>
                  <p className="text-xs text-slate-500">Log all admin activities</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.security.auditLogging}
                    onChange={(e) => handleSettingChange('security', 'auditLogging', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Settings */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 p-3 sm:p-4 lg:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center">
            <BellIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
            Notification Settings
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div>
                <label className="text-xs sm:text-sm font-semibold text-slate-700">Email Notifications</label>
                <p className="text-xs text-slate-500">Send email alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.emailNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <div>
                <label className="text-xs sm:text-sm font-semibold text-slate-700">Push Notifications</label>
                <p className="text-xs text-slate-500">Browser push alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.pushNotifications}
                  onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div>
                <label className="text-xs sm:text-sm font-semibold text-slate-700">Report Updates</label>
                <p className="text-xs text-slate-500">Status change alerts</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.notifications.reportUpdates}
                  onChange={(e) => handleSettingChange('notifications', 'reportUpdates', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 p-3 sm:p-4 lg:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center">
            <CubeIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-orange-600" />
            Data Management
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Export Menu */}
            <div className="relative">
              <button 
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={exportLoading}
                className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 rounded-lg border border-emerald-200 hover:border-emerald-300 transition-all duration-200 disabled:opacity-50"
              >
                {exportLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-600 mr-3"></div>
                ) : (
                  <ArrowDownTrayIcon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 mr-3" />
                )}
                <div className="text-left">
                  <p className="text-sm sm:text-base font-semibold text-slate-900">Export Data</p>
                  <p className="text-xs text-slate-600">Download system data</p>
                </div>
              </button>
              
              {showExportMenu && (
                <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-lg border border-emerald-100 z-50">
                  <div className="py-2">
                    <button
                      onClick={exportSystemDataCSV}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 flex items-center"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4 mr-2 text-emerald-600" />
                      Export as CSV
                    </button>
                    <button
                      onClick={exportSystemDataExcel}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 flex items-center"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4 mr-2 text-green-600" />
                      Export as Excel
                    </button>
                    <button
                      onClick={exportSystemDataJSON}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 flex items-center"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4 mr-2 text-purple-600" />
                      Export as JSON
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              onClick={importData}
              className="flex items-center justify-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200"
            >
              <ArrowUpTrayIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-3" />
              <div className="text-left">
                <p className="text-sm sm:text-base font-semibold text-slate-900">Import Data</p>
                <p className="text-xs text-slate-600">Upload data files</p>
              </div>
            </button>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 p-3 sm:p-4 lg:p-6">
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center">
            <ServerIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-600" />
            System Status
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="p-2 rounded-lg bg-green-500 shadow-lg mr-3">
                <ServerIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-700">API Server</p>
                <p className="text-xs text-green-600 font-medium">Online</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="p-2 rounded-lg bg-green-500 shadow-lg mr-3">
                <CubeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-700">Database</p>
                <p className="text-xs text-green-600 font-medium">Healthy</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="p-2 rounded-lg bg-green-500 shadow-lg mr-3">
                <CpuChipIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-700">File Storage</p>
                <p className="text-xs text-green-600 font-medium">Normal</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="p-2 rounded-lg bg-green-500 shadow-lg mr-3">
                <GlobeAltIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-semibold text-slate-700">CDN</p>
                <p className="text-xs text-green-600 font-medium">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close export menu */}
      {showExportMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowExportMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default AdminSettings;