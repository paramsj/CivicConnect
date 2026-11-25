// src/pages/admin/AdminDashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dataService from '../../services/dataService';
import ReportDetailModal from '../../components/admin/ReportDetailModal';
import {
  ChartBarIcon,
  DocumentTextIcon,
  UsersIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  CheckCircleIcon,
  MapPinIcon,
  EyeIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  ServerIcon,
  CpuChipIcon,
  CubeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedReport, setSelectedReport] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    recentReports: [],
    departmentPerformance: [],
    systemStatus: [],
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [timeRange]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [stats, recentReports, departmentPerformance] = await Promise.all([
        dataService.getDashboardStats(),
        dataService.getRecentReports(5),
        dataService.getDepartmentPerformance()
      ]);

      // Transform stats for display
      const quickStats = [
        {
          name: 'Total Reports',
          value: stats.totalReports.toLocaleString(),
          change: '+12.5%',
          changeType: 'increase',
          icon: DocumentTextIcon,
          bgColor: 'bg-gradient-to-br from-blue-50 to-blue-100',
          borderColor: 'border-blue-200',
          color: 'bg-blue-500'
        },
        {
          name: 'Resolved Issues',
          value: stats.resolvedReports.toLocaleString(),
          change: '+8.2%',
          changeType: 'increase',
          icon: CheckCircleIcon,
          bgColor: 'bg-gradient-to-br from-emerald-50 to-emerald-100',
          borderColor: 'border-emerald-200',
          color: 'bg-emerald-500'
        },
        {
          name: 'Pending Reports',
          value: stats.pendingReports.toLocaleString(),
          change: '-2.1%',
          changeType: 'decrease',
          icon: ClockIcon,
          bgColor: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
          borderColor: 'border-yellow-200',
          color: 'bg-yellow-500'
        }
      ];

      // System status data
      const systemStatus = [
        {
          name: 'API Server',
          value: 'Online',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: ServerIcon
        },
        {
          name: 'Database',
          value: 'Healthy',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: CubeIcon
        },
        {
          name: 'File Storage',
          value: 'Normal',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: CpuChipIcon
        },
        {
          name: 'CDN',
          value: 'Active',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: GlobeAltIcon
        }
      ];

      // Recent activity data derived from live reports
      const recentActivity = recentReports.length > 0
        ? recentReports.slice(0, 4).map(report => ({
            action: `Report ${report.id} (${report.category || 'General'}) is ${report.status?.replace('_', ' ') || 'updated'}`,
            time: new Date(report.dateSubmitted || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            icon: (report.status === 'resolved' || report.status === 'completed') ? CheckCircleIcon : DocumentTextIcon
          }))
        : [
            {
              action: 'New report submitted',
              time: '2 minutes ago',
              icon: DocumentTextIcon
            },
            {
              action: 'Issue resolved by Public Works',
              time: '15 minutes ago',
              icon: CheckCircleIcon
            }
          ];

      setDashboardData({
        stats: quickStats,
        recentReports,
        departmentPerformance,
        systemStatus,
        recentActivity
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'reports':
        navigate('/admin/reports');
        break;
      case 'analytics':
        navigate('/admin/analytics');
        break;
      case 'map':
        navigate('/admin/map-view');
        break;
      case 'users':
        navigate('/admin/users');
        break;
      default:
        break;
    }
  };

  const handleReportClick = (report) => {
    setSelectedReport(report);
  };

  const handleStatusUpdate = async (reportId, newStatus, notes) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
      const numericId = typeof reportId === 'string' && reportId.startsWith('REP-')
        ? parseInt(reportId.replace('REP-', ''), 10)
        : parseInt(reportId, 10);

      const response = await fetch(`${apiUrl}/admins/changeStatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportId: numericId,
          status: newStatus,
          notes: notes || ''
        })
      });

      if (response.ok) {
        await dataService.loadComplaintsData(true);
        await loadDashboardData();
        setSelectedReport(null);
      }
    } catch (err) {
      console.error('Error updating status from dashboard:', err);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      submitted: 'bg-blue-100 text-blue-800 border-blue-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in_progress': 'bg-purple-100 text-purple-800 border-purple-200',
      resolved: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading dashboard...</p>
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
              Admin Dashboard
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">Overview of civic management system</p>
          </div>
          
          <div className="w-full sm:w-auto">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="w-full sm:w-auto border-2 border-blue-200 rounded-lg px-3 sm:px-4 py-2 bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 font-medium text-slate-700 text-sm sm:text-base"
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 3 Months</option>
            </select>
          </div>
        </div>

        {/* Quick Stats - 3 Balanced Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {dashboardData.stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className={`${stat.bgColor} rounded-lg sm:rounded-xl shadow-lg border-2 ${stat.borderColor} p-3 sm:p-4 lg:p-6 hover:shadow-xl transition-all duration-200`}>
                <div className="flex items-center">
                  <div className={`p-2 sm:p-3 rounded-lg sm:rounded-xl ${stat.color} shadow-lg`}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  <div className="ml-2 sm:ml-3 lg:ml-4 flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-semibold text-slate-600 truncate">{stat.name}</p>
                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">{stat.value}</p>
                  </div>
                </div>
                <div className="mt-2 sm:mt-3 lg:mt-4 flex items-center">
                  {stat.changeType === 'increase' ? (
                    <ArrowTrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-xs sm:text-sm font-semibold ${
                    stat.changeType === 'increase' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-slate-500 text-xs sm:text-sm ml-1 hidden sm:inline">vs last period</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid - Mobile Optimized */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Reports */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center">
                <DocumentTextIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
                Recent Reports
              </h3>
              <button 
                onClick={() => handleQuickAction('reports')}
                className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-semibold bg-blue-50 px-2 sm:px-3 py-1 rounded-lg hover:bg-blue-100 transition-all duration-200"
              >
                View All
              </button>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              {dashboardData.recentReports.map((report, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-blue-50 rounded-lg border border-blue-100 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => handleReportClick(report)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center mb-1">
                      <p className="text-xs sm:text-sm font-semibold text-slate-900 mr-2 truncate">{report.id}</p>
                      <EyeIcon className="w-3 h-3 sm:w-4 sm:h-4 text-slate-400 flex-shrink-0" />
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 mb-1 truncate">{report.category} • {report.location}</p>
                    <p className="text-xs text-slate-500 truncate max-w-xs hidden sm:block">{report.description}</p>
                    <div className="flex items-center mt-1">
                      <CalendarDaysIcon className="w-3 h-3 text-slate-400 mr-1" />
                      <span className="text-xs text-slate-500">{new Date(report.dateSubmitted).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1 sm:space-y-2 ml-2">
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold border ${getStatusColor(report.status)}`}>
                      {report.status.replace('_', ' ')}
                    </span>
                    <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-semibold border ${getPriorityColor(report.priority)}`}>
                      {report.priority}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Department Performance */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 p-3 sm:p-4 lg:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center">
              <BuildingOfficeIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-600" />
              Department Performance
            </h3>
            
            <div className="space-y-4 sm:space-y-6">
              {dashboardData.departmentPerformance.map((dept, index) => (
                <div key={index} className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 truncate">{dept.name}</span>
                    <span className="text-xs sm:text-sm text-slate-600 font-medium">{dept.efficiency}% efficiency</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2 sm:h-3 overflow-hidden">
                      <div 
                        className={`${dept.color} h-2 sm:h-3 rounded-full transition-all duration-500`}
                        style={{ width: `${dept.efficiency}%` }}
                      ></div>
                    </div>
                    <span className="text-xs sm:text-sm text-slate-600 font-medium min-w-0">
                      {dept.resolvedReports}/{dept.totalReports}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row - Mobile Optimized */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 p-3 sm:p-4 lg:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center">
              <ExclamationTriangleIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
              Quick Actions
            </h3>
            <div className="space-y-3 sm:space-y-4">
              <button 
                onClick={() => handleQuickAction('reports')}
                className="w-full text-left p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-300"
              >
                <div className="flex items-center">
                  <DocumentTextIcon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 sm:mr-3" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-900">View All Reports</span>
                </div>
              </button>
              <button 
                onClick={() => handleQuickAction('analytics')}
                className="w-full text-left p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 rounded-lg transition-all duration-200 border border-emerald-200 hover:border-emerald-300"
              >
                <div className="flex items-center">
                  <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 mr-2 sm:mr-3" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-900">Analytics Dashboard</span>
                </div>
              </button>
              <button 
                onClick={() => handleQuickAction('map')}
                className="w-full text-left p-3 sm:p-4 bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 rounded-lg transition-all duration-200 border border-purple-200 hover:border-purple-300"
              >
                <div className="flex items-center">
                  <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 mr-2 sm:mr-3" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-900">Map View</span>
                </div>
              </button>
              <button 
                onClick={() => handleQuickAction('users')}
                className="w-full text-left p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 rounded-lg transition-all duration-200 border border-orange-200 hover:border-orange-300"
              >
                <div className="flex items-center">
                  <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 mr-2 sm:mr-3" />
                  <span className="text-xs sm:text-sm font-semibold text-slate-900">User Management</span>
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
            <div className="space-y-3 sm:space-y-4">
              {dashboardData.systemStatus.map((status, index) => {
                const Icon = status.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-2 sm:p-3 bg-gradient-to-r from-slate-50 to-green-50 rounded-lg border border-green-100">
                    <div className="flex items-center min-w-0 flex-1">
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-slate-500 mr-2 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-slate-600 font-medium truncate">{status.name}</span>
                    </div>
                    <span className={`flex items-center text-xs sm:text-sm font-semibold ${status.color} ml-2`}>
                      <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full mr-1 sm:mr-2 ${status.bgColor.replace('100', '500')}`}></div>
                      {status.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 p-3 sm:p-4 lg:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center">
              <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-indigo-600" />
              Recent Activity
            </h3>
            <div className="space-y-3 sm:space-y-4">
              {dashboardData.recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="text-xs sm:text-sm p-2 sm:p-3 bg-gradient-to-r from-slate-50 to-indigo-50 rounded-lg border border-indigo-100">
                    <div className="flex items-start">
                      <Icon className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500 mr-2 mt-0.5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-slate-900 font-semibold truncate">{activity.action}</p>
                        <p className="text-slate-500 text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
