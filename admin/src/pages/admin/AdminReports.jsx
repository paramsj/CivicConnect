import React, { useState, useEffect, useMemo } from 'react';
import ReportDetailModal from '../../components/admin/ReportDetailModal';
import { exportToCSV, exportToExcel, exportToJSON, generateFilename, formatDateForExport } from '../../utils/exportUtils';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  MapPinIcon,
  CalendarDaysIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  AdjustmentsHorizontalIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  TagIcon,
  Bars3Icon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

const AdminReports = () => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
    department: 'all',
    dateRange: 'all',
    sortBy: 'date_newest'
  });
  
  // Store ALL reports from API (never filtered)
  const [allReports, setAllReports] = useState([]);
  // Store filtered reports for display
  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [filterOptions, setFilterOptions] = useState({
    categories: [
      'Potholes', 'Garbage', 'Construction Road', 'Broken Signage',
      'Bad Streetlight', 'Bad Billboard', 'Graffiti', 'Faded Signage',
      'Sand on Road', 'Clutter Sidewalk', 'Unkept Facade', 'Others'
    ],
    departments: [
      'Public Works Department', 'Sanitation Department', 'Infrastructure Department',
      'Advertising & Infrastructure', 'Municipal Art & Cleaning',
      'Urban Planning / General Services', 'General Services'
    ],
    severities: ['Low', 'Medium', 'High', 'Critical'],
    statuses: ['Submitted', 'Pending', 'Accepted', 'Assigned', 'In Progress', 'Resolved', 'Completed']
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  // Load reports ONCE on mount
  useEffect(() => {
    loadReports();
  }, []);

  // Filter locally whenever searchTerm or filters change
  useEffect(() => {
    if (allReports.length > 0) {
      filterReportsLocally();
    }
  }, [searchTerm, filters, allReports]);

  const loadReports = async (bypassCache = false) => {
    try {
      if (!bypassCache) setLoading(true);
      setError('');
      
      // Fetch ALL reports without any filters
      const params = new URLSearchParams();
      params.append('limit', '500'); // Get all reports
      if (bypassCache) {
        params.append('noCache', 'true');
        params.append('_t', Date.now().toString());
      }
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admins/allReports?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok && data.data) {
        // Transform backend data to match UI expectations
        const transformedReports = data.data.reports.map(report => ({
          id: `REP-${report.complaintId}`,
          complaintId: report.complaintId,
          category: report.category || 'others',
          priority: report.severity || 'low',
          status: report.progress || 'submitted',
          location: report.location || 'Unknown',
          description: report.description || '',
          department: report.department || 'General Services',
          reportedBy: report.userId?.email || 'Unknown',
          dateSubmitted: report.createdAt,
          coordinates: report.coordinates ? [report.coordinates.lat, report.coordinates.lng] : [19.0760, 72.8777],
          resolutionDate: report.updatedAt || report.reportEndDate || '—',
          imageUrl: report.imageUrl,
          userId: report.userId,
          createdAt: report.createdAt,
          progress: report.progress || 'submitted',
          severity: report.severity || 'low',
          adminNotes: report.adminNotes || ''
        }));
        
        // Store ALL reports
        setAllReports(transformedReports);
        setTotal(data.data.total || transformedReports.length);
      } else {
        setError(data.message || 'Failed to fetch reports');
        setAllReports([]);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      setError('Network error. Please try again.');
      setAllReports([]);
    } finally {
      setLoading(false);
    }
  };

  // Helper to normalize strings: removes dashes, underscores, spaces, lowercase
  const normalize = (str) => (str || '').toLowerCase().replace(/[-_ ]+/g, '');

  // Local filtering function - no API calls
  const filterReportsLocally = () => {
    let filtered = [...allReports];

    // Search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(report =>
        report.id.toLowerCase().includes(searchLower) ||
        report.description.toLowerCase().includes(searchLower) ||
        report.location.toLowerCase().includes(searchLower) ||
        report.reportedBy.toLowerCase().includes(searchLower) ||
        report.category.toLowerCase().includes(searchLower) ||
        report.department.toLowerCase().includes(searchLower)
      );
    }

    // Status filter - robust normalized comparison
    if (filters.status !== 'all') {
      const targetStatus = normalize(filters.status);
      filtered = filtered.filter(report => {
        const reportStatus = normalize(report.status);
        return reportStatus === targetStatus || reportStatus.includes(targetStatus);
      });
    }

    // Category filter - robust normalized comparison
    if (filters.category !== 'all') {
      const targetCat = normalize(filters.category);
      filtered = filtered.filter(report =>
        normalize(report.category) === targetCat || normalize(report.category).includes(targetCat)
      );
    }

    // Priority filter
    if (filters.priority !== 'all') {
      const targetPri = normalize(filters.priority);
      filtered = filtered.filter(report =>
        normalize(report.priority) === targetPri
      );
    }

    // Department filter
    if (filters.department !== 'all') {
      const targetDept = normalize(filters.department);
      filtered = filtered.filter(report =>
        normalize(report.department) === targetDept || normalize(report.department).includes(targetDept)
      );
    }

    // Sorting
    switch (filters.sortBy) {
      case 'date_newest':
        filtered.sort((a, b) => new Date(b.dateSubmitted) - new Date(a.dateSubmitted));
        break;
      case 'date_oldest':
        filtered.sort((a, b) => new Date(a.dateSubmitted) - new Date(b.dateSubmitted));
        break;
      case 'severity_high':
        const priorityOrderHigh = { critical: 4, high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => 
          (priorityOrderHigh[b.priority?.toLowerCase()] || 0) - 
          (priorityOrderHigh[a.priority?.toLowerCase()] || 0)
        );
        break;
      case 'severity_low':
        const priorityOrderLow = { critical: 4, high: 3, medium: 2, low: 1 };
        filtered.sort((a, b) => 
          (priorityOrderLow[a.priority?.toLowerCase()] || 0) - 
          (priorityOrderLow[b.priority?.toLowerCase()] || 0)
        );
        break;
      default:
        break;
    }

    setReports(filtered);
  };

  // ...existing code for handleFilterChange, clearFilters, getStatusColor, getPriorityColor...

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: 'all',
      category: 'all',
      priority: 'all',
      department: 'all',
      dateRange: 'all',
      sortBy: 'date_newest'
    });
    setSearchTerm('');
  };

  const getStatusColor = (status) => {
    const colors = {
      submitted: 'bg-blue-100 text-blue-800 border-blue-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'in-progress': 'bg-purple-100 text-purple-800 border-purple-200',
      'in_progress': 'bg-purple-100 text-purple-800 border-purple-200',
      assigned: 'bg-orange-100 text-orange-800 border-orange-200',
      resolved: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      closed: 'bg-gray-100 text-gray-800 border-gray-200'
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
    return colors[priority?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleStatusUpdate = async (reportId, newStatus, notes) => {
    try {
      const complaintId = parseInt(String(reportId).replace('REP-', '').replace('RPT-', ''), 10);
      
      // 1. Optimistic instant UI update
      setAllReports(prev => prev.map(report => {
        if (report.complaintId === complaintId || report.id === reportId) {
          return {
            ...report,
            status: newStatus,
            progress: newStatus,
            adminNotes: notes || report.adminNotes
          };
        }
        return report;
      }));
      setSelectedReport(null);

      // 2. Persist to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admins/changeStatus`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportId: complaintId,
          status: newStatus,
          notes: notes || ''
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log('Status updated successfully');
        // Reload fresh data from server with cache bypass
        loadReports(true);
      } else {
        console.error('Failed to update status:', data.message);
        alert('Failed to update status: ' + (data.message || 'Server error'));
        loadReports(true);
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error updating status. Please try again.');
      loadReports(true);
    }
  };

  // Export functions use the filtered 'reports' array
  const exportReportsCSV = async () => {
    try {
      setExportLoading(true);
      const exportData = reports.map(report => ({
        'Report ID': report.id,
        'Category': report.category,
        'Priority': report.priority,
        'Status': report.status.replace('_', ' '),
        'Location': report.location,
        'Description': report.description,
        'Department': report.department,
        'Reported By': report.reportedBy,
        'Date Submitted': formatDateForExport(report.dateSubmitted),
        'Coordinates': `${report.coordinates[0]}, ${report.coordinates[1]}`,
        'Resolution Date': report.resolutionDate !== '—' ? formatDateForExport(report.resolutionDate) : 'Not Resolved'
      }));
      
      const filename = generateFilename('reports');
      exportToCSV(exportData, filename);
      alert('Reports exported to CSV successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting reports. Please try again.');
    } finally {
      setExportLoading(false);
      setShowExportMenu(false);
    }
  };

  const exportReportsExcel = async () => {
    try {
      setExportLoading(true);
      const exportData = reports.map(report => ({
        'Report ID': report.id,
        'Category': report.category,
        'Priority': report.priority,
        'Status': report.status.replace('_', ' '),
        'Location': report.location,
        'Description': report.description,
        'Department': report.department,
        'Reported By': report.reportedBy,
        'Date Submitted': formatDateForExport(report.dateSubmitted),
        'Coordinates': `${report.coordinates[0]}, ${report.coordinates[1]}`,
        'Resolution Date': report.resolutionDate !== '—' ? formatDateForExport(report.resolutionDate) : 'Not Resolved'
      }));
      
      const filename = generateFilename('reports');
      exportToExcel(exportData, filename);
      alert('Reports exported to Excel successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting reports. Please try again.');
    } finally {
      setExportLoading(false);
      setShowExportMenu(false);
    }
  };

  const exportReportsJSON = async () => {
    try {
      setExportLoading(true);
      const filename = generateFilename('reports');
      exportToJSON(reports, filename);
      alert('Reports exported to JSON successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting reports. Please try again.');
    } finally {
      setExportLoading(false);
      setShowExportMenu(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading reports...</p>
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
              All Reports
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Manage and track civic complaints and issues
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
                      onClick={exportReportsCSV}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 flex items-center"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4 mr-2 text-blue-600" />
                      Export as CSV
                    </button>
                    <button
                      onClick={exportReportsExcel}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 flex items-center"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4 mr-2 text-green-600" />
                      Export as Excel
                    </button>
                    <button
                      onClick={exportReportsJSON}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 flex items-center"
                    >
                      <ArrowDownTrayIcon className="w-4 h-4 mr-2 text-purple-600" />
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

        {/* Search and Filters - Mobile Optimized */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 p-3 sm:p-6">
          {/* Search Bar */}
          <div className="relative mb-4">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search reports by ID, description, location, or reporter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-2 sm:py-3 border-2 border-blue-200 rounded-lg focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 text-sm sm:text-base"
            />
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-4">
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
                  {filterOptions.statuses.map(status => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border-2 border-blue-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 bg-white text-sm"
                >
                  <option value="all">All Categories</option>
                  {filterOptions.categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                  Priority
                </label>
                <select
                  value={filters.priority}
                  onChange={(e) => handleFilterChange('priority', e.target.value)}
                  className="w-full border-2 border-blue-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 bg-white text-sm"
                >
                  <option value="all">All Priorities</option>
                  {filterOptions.severities.map(severity => (
                    <option key={severity} value={severity.toLowerCase()}>
                      {severity}
                    </option>
                  ))}
                </select>
              </div>

              {/* Department Filter */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-1 sm:mb-2">
                  Department
                </label>
                <select
                  value={filters.department}
                  onChange={(e) => handleFilterChange('department', e.target.value)}
                  className="w-full border-2 border-blue-200 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 bg-white text-sm"
                >
                  <option value="all">All Departments</option>
                  {filterOptions.departments.map(department => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
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
                  <option value="date_newest">Newest First</option>
                  <option value="date_oldest">Oldest First</option>
                  <option value="severity_high">High Priority</option>
                  <option value="severity_low">Low Priority</option>
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
            <span>Showing {reports.length} of {total} reports</span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                Submitted
              </span>
              <span className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                In Progress
              </span>
              <span className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                Completed
              </span>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mr-3" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Reports List - Mobile Optimized */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 overflow-hidden">
          {reports.length === 0 ? (
            <div className="text-center py-12">
              <ExclamationTriangleIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No reports found</h3>
              <p className="text-slate-600">Try adjusting your search criteria or filters.</p>
            </div>
          ) : (
            <div className="divide-y divide-blue-100">
              {reports.map((report, index) => (
                <div
                  key={report.complaintId || index}
                  className="p-3 sm:p-4 lg:p-6 hover:bg-gradient-to-r hover:from-blue-50 hover:to-emerald-50 transition-all duration-200 cursor-pointer"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    {/* Left Content */}
                    <div className="flex-1 min-w-0 mb-3 lg:mb-0">
                      <div className="flex items-center mb-2">
                        <h3 className="text-sm sm:text-base font-bold text-slate-900 mr-3 truncate">
                          {report.id}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(report.status)}`}>
                          {report.status.replace('_', ' ').replace('-', ' ')}
                        </span>
                      </div>
                      
                      <p className="text-sm sm:text-base text-slate-700 mb-2 line-clamp-2">
                        {report.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600">
                        <div className="flex items-center">
                          <BuildingOfficeIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="truncate">{report.category}</span>
                        </div>
                        <div className="flex items-center">
                          <MapPinIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span className="truncate">{report.location}</span>
                        </div>
                        <div className="flex items-center">
                          <CalendarDaysIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                          <span>{new Date(report.dateSubmitted).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right Content */}
                    <div className="flex items-center justify-between lg:justify-end lg:ml-4">
                      <div className="flex flex-col items-end space-y-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(report.priority)}`}>
                          {report.priority}
                        </span>
                        <span className="text-xs text-slate-500">
                          {report.department}
                        </span>
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(report);
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

      {/* Report Detail Modal */}
      {selectedReport && (
        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}

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

export default AdminReports;
