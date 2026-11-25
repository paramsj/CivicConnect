// src/pages/admin/AdminUsers.jsx
import React, { useState, useEffect } from 'react';
import dataService from '../../services/dataService';
import { exportToCSV, exportToExcel, exportToJSON, generateFilename, formatDateForExport } from '../../utils/exportUtils';
import {
  UsersIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  UserPlusIcon,
  UserMinusIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  Bars3Icon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    civicScore: 'all',
    sortBy: 'civic_score_desc'
  });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await dataService.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        user.id.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(user => user.status === filters.status);
    }

    // Civic score filter
    if (filters.civicScore !== 'all') {
      switch (filters.civicScore) {
        case 'high':
          filtered = filtered.filter(user => user.civicScore >= 80);
          break;
        case 'medium':
          filtered = filtered.filter(user => user.civicScore >= 50 && user.civicScore < 80);
          break;
        case 'low':
          filtered = filtered.filter(user => user.civicScore < 50);
          break;
      }
    }

    // Sort
    switch (filters.sortBy) {
      case 'civic_score_desc':
        filtered.sort((a, b) => b.civicScore - a.civicScore);
        break;
      case 'civic_score_asc':
        filtered.sort((a, b) => a.civicScore - b.civicScore);
        break;
      case 'reports_desc':
        filtered.sort((a, b) => b.reportsSubmitted - a.reportsSubmitted);
        break;
      case 'reports_asc':
        filtered.sort((a, b) => a.reportsSubmitted - b.reportsSubmitted);
        break;
      case 'last_active':
        filtered.sort((a, b) => new Date(b.lastActive) - new Date(a.lastActive));
        break;
    }

    setFilteredUsers(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      civicScore: 'all',
      sortBy: 'civic_score_desc'
    });
    setSearchTerm('');
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      moderate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      inactive: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCivicScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getCivicScoreBg = (score) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const getUserStats = () => {
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.status === 'active').length;
    const moderateUsers = users.filter(u => u.status === 'moderate').length;
    const inactiveUsers = users.filter(u => u.status === 'inactive').length;
    const avgCivicScore = users.reduce((sum, u) => sum + u.civicScore, 0) / totalUsers;

    return {
      totalUsers,
      activeUsers,
      moderateUsers,
      inactiveUsers,
      avgCivicScore: Math.round(avgCivicScore)
    };
  };

  // Export functions
  const exportUsersCSV = async () => {
    try {
      setExportLoading(true);
      const exportData = filteredUsers.map(user => ({
        'User ID': user.id,
        'Email': user.email,
        'Status': user.status,
        'Civic Score': user.civicScore,
        'Reports Submitted': user.reportsSubmitted,
        'Last Active': formatDateForExport(user.lastActive),
        'Account Created': formatDateForExport(user.accountCreated),
        'Profile Completion': `${user.profileCompletion}%`,
        'Verification Status': user.verified ? 'Verified' : 'Not Verified'
      }));
      
      const filename = generateFilename('users');
      exportToCSV(exportData, filename);
      alert('Users exported to CSV successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting users. Please try again.');
    } finally {
      setExportLoading(false);
      setShowExportMenu(false);
    }
  };

  const exportUsersExcel = async () => {
    try {
      setExportLoading(true);
      const exportData = filteredUsers.map(user => ({
        'User ID': user.id,
        'Email': user.email,
        'Status': user.status,
        'Civic Score': user.civicScore,
        'Reports Submitted': user.reportsSubmitted,
        'Last Active': formatDateForExport(user.lastActive),
        'Account Created': formatDateForExport(user.accountCreated),
        'Profile Completion': `${user.profileCompletion}%`,
        'Verification Status': user.verified ? 'Verified' : 'Not Verified'
      }));
      
      const filename = generateFilename('users');
      exportToExcel(exportData, filename);
      alert('Users exported to Excel successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting users. Please try again.');
    } finally {
      setExportLoading(false);
      setShowExportMenu(false);
    }
  };

  const exportUsersJSON = async () => {
    try {
      setExportLoading(true);
      const exportData = {
        exportedAt: new Date().toISOString(),
        totalUsers: filteredUsers.length,
        filters: filters,
        searchTerm: searchTerm,
        users: filteredUsers,
        summary: getUserStats()
      };
      
      const filename = generateFilename('users');
      exportToJSON(exportData, filename);
      alert('Users exported to JSON successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting users. Please try again.');
    } finally {
      setExportLoading(false);
      setShowExportMenu(false);
    }
  };

  const stats = getUserStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading users...</p>
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
              User Management
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Manage civic engagement users and their activity
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all duration-200 font-medium text-sm sm:text-base">
              <UserPlusIcon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add User</span>
            </button>
            
            {/* Export Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={exportLoading}
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all duration-200 font-medium text-sm sm:text-base disabled:opacity-50"
              >
                {exportLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                )}
                <span className="hidden sm:inline">Export</span>
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-blue-100 z-50">
                  <div className="py-2">
                    <button
                      onClick={exportUsersCSV}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 flex items-center"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4 mr-2 text-blue-600" />
                      Export as CSV
                    </button>
                    <button
                      onClick={exportUsersExcel}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 flex items-center"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4 mr-2 text-green-600" />
                      Export as Excel
                    </button>
                    <button
                      onClick={exportUsersJSON}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 flex items-center"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4 mr-2 text-purple-600" />
                      Export as JSON
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-3 sm:px-4 py-2 bg-white border-2 border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-medium text-sm sm:text-base"
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Filters</span>
            </button>
          </div>
        </div>

        {/* User Statistics - Mobile Optimized */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl shadow-lg border-2 border-blue-200 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-500 shadow-lg">
                <UsersIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-4 flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-600 truncate">Total Users</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">{stats.totalUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl shadow-lg border-2 border-green-200 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-green-500 shadow-lg">
                <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-4 flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-600 truncate">Active Users</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">{stats.activeUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg sm:rounded-xl shadow-lg border-2 border-yellow-200 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-yellow-500 shadow-lg">
                <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-4 flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-600 truncate">Moderate Users</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">{stats.moderateUsers.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl shadow-lg border-2 border-purple-200 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-purple-500 shadow-lg">
                <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-4 flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-600 truncate">Avg Civic Score</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">{stats.avgCivicScore}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters - Mobile Optimized */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 p-3 sm:p-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search users by ID or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border-2 border-blue-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 text-sm sm:text-base"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
              {/* Status Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="w-full border-2 border-blue-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 bg-white text-sm"
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="moderate">Moderate</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {/* Civic Score Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                  Civic Score
                </label>
                <select
                  value={filters.civicScore}
                  onChange={(e) => handleFilterChange('civicScore', e.target.value)}
                  className="w-full border-2 border-blue-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 bg-white text-sm"
                >
                  <option value="all">All Scores</option>
                  <option value="high">High (80+)</option>
                  <option value="medium">Medium (50-79)</option>
                  <option value="low">Low (&lt;50)</option>
                </select>
              </div>

              {/* Sort Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full border-2 border-blue-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 bg-white text-sm"
                >
                  <option value="civic_score_desc">Civic Score (High to Low)</option>
                  <option value="civic_score_asc">Civic Score (Low to High)</option>
                  <option value="reports_desc">Reports Submitted (High to Low)</option>
                  <option value="reports_asc">Reports Submitted (Low to High)</option>
                  <option value="last_active">Last Active</option>
                </select>
              </div>

              {/* Clear Filters */}
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all duration-200 font-medium text-sm border border-slate-300"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between text-sm text-slate-600">
            <span>Showing {filteredUsers.length} users</span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Active
              </span>
              <span className="flex items-center">
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                Moderate
              </span>
              <span className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                Inactive
              </span>
            </div>
          </div>
        </div>

        {/* Users List - Mobile Optimized */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 overflow-hidden">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <UsersIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No users found</h3>
              <p className="text-slate-600">Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-blue-100">
              {filteredUsers.map((user, index) => (
                <div
                  key={index}
                  className="p-3 sm:p-4 lg:p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50 transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Left Content */}
                    <div className="flex-1 min-w-0 mb-3 lg:mb-0">
                      <div className="flex items-center mb-2">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 mr-3 truncate">
                          {user.id}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(user.status)}`}>
                          {user.status}
                        </span>
                      </div>
                      
                      <p className="text-sm sm:text-base text-slate-700 mb-2 truncate">
                        {user.email}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600">
                        <div className="flex items-center">
                          <ChartBarIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span>{user.reportsSubmitted} reports</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarDaysIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span>Last active: {new Date(user.lastActive).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex items-center justify-between lg:justify-end lg:ml-4">
                      <div className="flex flex-col items-end space-y-2">
                        <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getCivicScoreBg(user.civicScore)} ${getCivicScoreColor(user.civicScore)}`}>
                          {user.civicScore} Civic Score
                        </div>
                        <span className="text-xs text-slate-500">
                          {user.reportsSubmitted} reports submitted
                        </span>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedUser(user);
                        }}
                        className="ml-3 p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-all duration-200"
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
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

export default AdminUsers;
