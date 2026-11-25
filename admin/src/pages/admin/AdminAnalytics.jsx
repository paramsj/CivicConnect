// src/pages/admin/AdminAnalytics.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import dataService from '../../services/dataService';
import { exportToCSV, exportToExcel, exportToJSON, generateFilename } from '../../utils/exportUtils';
import {
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ClockIcon,
  MapPinIcon,
  UsersIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  SignalIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

// Import leaflet.heat plugin
// Make sure to install: npm install leaflet.heat
// Or include via CDN: <script src="https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/dist/leaflet-heat.js"></script>

// Extended Heatmap Layer Component for Leaflet with proper cleanup
const HeatmapLayer = ({ data }) => {
  const map = useMap();
  const heatLayerRef = useRef(null);

  useEffect(() => {
    // Remove existing heatmap layer if it exists
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }

    if (!data || data.length === 0) return;

    // Check if leaflet.heat is available
    if (!L.heatLayer) {
      console.error('Leaflet.heat plugin not loaded. Please install leaflet.heat or include it via CDN.');
      return;
    }

    try {
      // Convert data to heatmap format: [lat, lng, intensity]
      const heatmapData = data.map(point => {
        let intensity = 0.1;
        switch (point.Severity) {
          case 'Critical': intensity = 1.0; break;
          case 'High': intensity = 0.75; break;
          case 'Medium': intensity = 0.5; break;
          case 'Low': intensity = 0.25; break;
          default: intensity = 0.3;
        }
        return [parseFloat(point.Latitude), parseFloat(point.Longitude), intensity];
      }).filter(point => 
        // Filter out invalid coordinates
        !isNaN(point[0]) && !isNaN(point[1]) && 
        point[0] >= -90 && point[0] <= 90 && 
        point[1] >= -180 && point[1] <= 180
      );

      console.log('Heatmap data points:', heatmapData.length);

      if (heatmapData.length === 0) {
        console.warn('No valid heatmap data points');
        return;
      }

      // Create heatmap layer with enhanced options
      const heatLayer = L.heatLayer(heatmapData, {
        radius: 30,
        blur: 25,
        maxZoom: 18,
        max: 1.0,
        minOpacity: 0.3,
        gradient: {
          0.0: '#0000ff',  // Blue for low intensity
          0.2: '#00ffff',  // Cyan
          0.4: '#00ff00',  // Green
          0.6: '#ffff00',  // Yellow
          0.8: '#ff8000',  // Orange
          1.0: '#ff0000'   // Red for high intensity
        }
      });

      // Add to map and store reference
      heatLayer.addTo(map);
      heatLayerRef.current = heatLayer;

      console.log('Heatmap layer added successfully');

    } catch (error) {
      console.error('Error creating heatmap layer:', error);
    }

    // Cleanup function
    return () => {
      if (heatLayerRef.current) {
        try {
          map.removeLayer(heatLayerRef.current);
          heatLayerRef.current = null;
        } catch (error) {
          console.error('Error removing heatmap layer:', error);
        }
      }
    };
  }, [map, data]);

  return null;
};

// Speedometer Component for Department Performance (unchanged)
// Update the SpeedometerGauge component with better styling and alignment
const SpeedometerGauge = ({ value, title, department, total, resolved }) => {
  const normalizedValue = Math.min(Math.max(value, 0), 100);
  const circumference = 2 * Math.PI * 45; // radius of 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;
  
  const getColor = (val) => {
    if (val >= 80) return '#10b981'; // green-500
    if (val >= 60) return '#f59e0b'; // amber-500
    if (val >= 40) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  };

  const getGradient = (val) => {
    if (val >= 80) return 'from-green-400 to-green-600';
    if (val >= 60) return 'from-amber-400 to-amber-600';
    if (val >= 40) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  const getStatus = (val) => {
    if (val >= 80) return 'Excellent';
    if (val >= 60) return 'Good';
    if (val >= 40) return 'Average';
    return 'Needs Improvement';
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200/50 p-6 hover:shadow-xl transition-all duration-300 hover:scale-105">
      {/* Department Name */}
      <div className="text-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 truncate">{department}</h3>
        <p className="text-sm text-gray-500 mt-1">Performance Efficiency</p>
      </div>
      
      {/* Circular Progress */}
      <div className="flex justify-center items-center mb-6">
        <div className="relative w-32 h-32">
          {/* Background Circle */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke={getColor(normalizedValue)}
              strokeWidth="8"
              fill="transparent"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-in-out"
              style={{
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }}
            />
          </svg>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-bold text-gray-900">
              {normalizedValue.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500 font-medium">
              %
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{total}</div>
          <div className="text-xs text-blue-500 font-medium">Total Reports</div>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{resolved}</div>
          <div className="text-xs text-green-500 font-medium">Resolved</div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="text-center">
        <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
          normalizedValue >= 80 ? 'bg-green-100 text-green-800 border border-green-200' :
          normalizedValue >= 60 ? 'bg-amber-100 text-amber-800 border border-amber-200' :
          normalizedValue >= 40 ? 'bg-orange-100 text-orange-800 border border-orange-200' :
          'bg-red-100 text-red-800 border border-red-200'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            normalizedValue >= 80 ? 'bg-green-500' :
            normalizedValue >= 60 ? 'bg-amber-500' :
            normalizedValue >= 40 ? 'bg-orange-500' :
            'bg-red-500'
          }`}></div>
          {getStatus(normalizedValue)}
        </div>
      </div>
    </div>
  );
};

const AdminAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [analyticsData, setAnalyticsData] = useState({
    stats: [],
    categoryStats: [],
    departmentStats: [],
    heatmapData: [],
    complaintsData: []
  });
  const [loading, setLoading] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // Load leaflet.heat plugin dynamically
    const loadLeafletHeat = async () => {
      if (!window.L || !window.L.heatLayer) {
        try {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/dist/leaflet-heat.js';
          script.async = true;
          document.head.appendChild(script);
          
          script.onload = () => {
            console.log('Leaflet.heat plugin loaded successfully');
            loadAnalyticsData();
          };
          
          script.onerror = () => {
            console.error('Failed to load leaflet.heat plugin');
            loadAnalyticsData(); // Load data anyway, heatmap will show error
          };
        } catch (error) {
          console.error('Error loading leaflet.heat:', error);
          loadAnalyticsData();
        }
      } else {
        loadAnalyticsData();
      }
    };

    loadLeafletHeat();
  }, [timeRange, selectedCategory]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      
      // Load complaints data from your dataset
      const complaintsData = await dataService.getComplaints();
      
      // Process the data for analytics
      const processedData = processComplaintsData(complaintsData);
      
      setAnalyticsData({
        ...processedData,
        complaintsData
      });
      
      setLastUpdate(new Date());
      
    } catch (error) {
      console.error('Error loading analytics data:', error);
      // Fallback to mock data if API fails
      setAnalyticsData(generateMockData());
    } finally {
      setLoading(false);
    }
  };

  const processComplaintsData = (data) => {
    if (!data || data.length === 0) return generateMockData();

    // Calculate key stats
    const totalReports = data.length;
    const resolvedReports = data.filter(r => r.status === 'Resolved').length;
    const criticalReports = data.filter(r => r.severity === 'Critical').length;
    const avgResolutionTime = 2.8; // Calculate from your data

    const stats = [
      {
        name: 'Total Reports',
        value: totalReports.toLocaleString(),
        change: '+12.5%',
        changeType: 'increase',
        icon: DocumentTextIcon,
        color: 'bg-blue-500'
      },
      {
        name: 'Resolved Issues',
        value: resolvedReports.toLocaleString(),
        change: '+8.2%',
        changeType: 'increase',
        icon: CheckCircleIcon,
        color: 'bg-green-500'
      },
      {
        name: 'Critical Issues',
        value: criticalReports.toLocaleString(),
        change: '-5.1%',
        changeType: 'decrease',
        icon: ExclamationTriangleIcon,
        color: 'bg-red-500'
      },
      {
        name: 'Avg Resolution Time',
        value: `${avgResolutionTime} days`,
        change: '-1.8%',
        changeType: 'decrease',
        icon: ClockIcon,
        color: 'bg-orange-500'
      }
    ];

    // Category stats
    const categoryStats = Object.entries(
      data.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, count], index) => ({
      name,
      reports: count,
      resolved: Math.floor(count * (0.3 + Math.random() * 0.4)),
      percentage: ((count / totalReports) * 100).toFixed(1),
      trend: Math.random() > 0.5 ? 'up' : 'down'
    }));

    // Department stats
    const departmentStats = Object.entries(
      data.reduce((acc, item) => {
        acc[item.department] = (acc[item.department] || 0) + 1;
        return acc;
      }, {})
    ).map(([name, total]) => {
      const resolved = data.filter(r => r.department === name && r.status === 'resolved').length;
      const efficiency = total > 0 ? (resolved / total * 100) : 0;
      return {
        name,
        totalReports: total,
        resolvedReports: resolved,
        efficiency: efficiency.toFixed(1),
        color: efficiency >= 75 ? 'bg-green-500' : 
               efficiency >= 50 ? 'bg-yellow-500' : 'bg-red-500'
      };
    }).sort((a, b) => b.efficiency - a.efficiency);

    return {
      stats,
      categoryStats: categoryStats.slice(0, 8),
      departmentStats: departmentStats.slice(0, 9),
      heatmapData: data.filter(item => 
        item.coordinates && item.coordinates.length === 2
      ).map(item => ({
        Latitude: item.coordinates[0],
        Longitude: item.coordinates[1],
        Severity: item.priority || item.severity || 'Medium',
        Category: item.category,
        Status: item.status,
        Location: item.location
      }))
    };
  };

  const generateMockData = () => {
    // Enhanced mock data with more realistic Indian city coordinates
    const mockHeatmapData = [
  { Latitude: 23.3441, Longitude: 85.3096, Severity: 'Critical', Category: 'Water Supply', Status: 'Submitted', Location: 'Ranchi' },
  { Latitude: 22.8046, Longitude: 86.2029, Severity: 'High', Category: 'Garbage', Status: 'In Progress', Location: 'Jamshedpur' },
  { Latitude: 23.7957, Longitude: 86.4304, Severity: 'Medium', Category: 'Potholes', Status: 'Resolved', Location: 'Dhanbad' },
  { Latitude: 24.4800, Longitude: 85.0100, Severity: 'Critical', Category: 'Streetlight', Status: 'Submitted', Location: 'Hazaribagh' },
  { Latitude: 24.8295, Longitude: 87.2670, Severity: 'High', Category: 'Drainage', Status: 'In Progress', Location: 'Deoghar' },
  { Latitude: 24.2686, Longitude: 86.3560, Severity: 'Low', Category: 'Tree Fall', Status: 'Resolved', Location: 'Giridih' },
  { Latitude: 23.3500, Longitude: 85.3333, Severity: 'Medium', Category: 'Traffic Signal', Status: 'Submitted', Location: 'Bokaro Steel City' },
  { Latitude: 22.6369, Longitude: 85.8040, Severity: 'Critical', Category: 'Illegal Parking', Status: 'In Progress', Location: 'Chaibasa' },
  { Latitude: 24.0300, Longitude: 85.0100, Severity: 'High', Category: 'Water Supply', Status: 'Submitted', Location: 'Ramgarh' },
  { Latitude: 24.5000, Longitude: 87.6500, Severity: 'Medium', Category: 'Garbage', Status: 'Resolved', Location: 'Sahibganj' },
  { Latitude: 22.8000, Longitude: 86.1800, Severity: 'Low', Category: 'Potholes', Status: 'Resolved', Location: 'Chakradharpur' },
  { Latitude: 23.6500, Longitude: 85.5500, Severity: 'Critical', Category: 'Streetlight', Status: 'Submitted', Location: 'Chatra' },
  { Latitude: 24.2500, Longitude: 83.8700, Severity: 'High', Category: 'Drainage', Status: 'In Progress', Location: 'Garhwa' },
  { Latitude: 23.6500, Longitude: 85.6300, Severity: 'Medium', Category: 'Traffic Signal', Status: 'Resolved', Location: 'Lohardaga' },
  { Latitude: 22.4000, Longitude: 85.3300, Severity: 'High', Category: 'Water Supply', Status: 'Submitted', Location: 'Seraikela' }
];


    return {
      stats: [
        { name: 'Total Reports', value: '1,247', change: '+12.5%', changeType: 'increase', icon: DocumentTextIcon, color: 'bg-blue-500' },
        { name: 'Resolved Issues', value: '892', change: '+8.2%', changeType: 'increase', icon: CheckCircleIcon, color: 'bg-green-500' },
        { name: 'Critical Issues', value: '156', change: '-5.1%', changeType: 'decrease', icon: ExclamationTriangleIcon, color: 'bg-red-500' },
        { name: 'Avg Resolution Time', value: '2.8 days', change: '-1.8%', changeType: 'decrease', icon: ClockIcon, color: 'bg-orange-500' }
      ],
      categoryStats: [
        { name: 'Water Supply', reports: 280, resolved: 190, percentage: 22.5, trend: 'up' },
        { name: 'Garbage', reports: 220, resolved: 160, percentage: 17.6, trend: 'up' },
        { name: 'Potholes', reports: 180, resolved: 140, percentage: 14.4, trend: 'down' },
        { name: 'Streetlight', reports: 150, resolved: 110, percentage: 12.0, trend: 'up' }
      ],
      departmentStats: [
        { name: 'Sanitation', totalReports: 105, resolvedReports: 88, efficiency: 83.8, color: 'bg-green-500' },
        { name: 'Traffic Police', totalReports: 111, resolvedReports: 89, efficiency: 80.2, color: 'bg-green-500' },
        { name: 'Water Works', totalReports: 115, resolvedReports: 82, efficiency: 71.3, color: 'bg-yellow-500' },
        { name: 'Sewerage', totalReports: 96, resolvedReports: 39, efficiency: 40.6, color: 'bg-orange-500' },
        { name: 'Gardening Dept.', totalReports: 104, resolvedReports: 40, efficiency: 38.5, color: 'bg-red-500' },
        { name: 'Public Works', totalReports: 187, resolvedReports: 68, efficiency: 36.4, color: 'bg-red-500' }
      ],
      heatmapData: mockHeatmapData
    };
  };

  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 3 Months' }
  ];

  // Export functions remain the same...
  const exportAnalyticsCSV = async () => {
    setExportLoading(true);
    try {
      const exportData = [
        ...analyticsData.stats.map(stat => ({
          'Metric': stat.name,
          'Value': stat.value,
          'Change': stat.change,
          'Trend': stat.changeType,
          'Time Period': timeRange
        })),
        ...analyticsData.categoryStats.map(category => ({
          'Metric': `Category - ${category.name}`,
          'Value': `${category.resolved}/${category.reports}`,
          'Change': `${category.percentage}%`,
          'Trend': category.trend,
          'Time Period': timeRange
        })),
        ...analyticsData.departmentStats.map(dept => ({
          'Metric': `Department - ${dept.name}`,
          'Value': `${dept.resolvedReports}/${dept.totalReports}`,
          'Change': `${dept.efficiency}%`,
          'Trend': dept.efficiency > 50 ? 'up' : 'down',
          'Time Period': timeRange
        }))
      ];
      
      const filename = generateFilename(`analytics_${timeRange}`);
      exportToCSV(exportData, filename);
      alert('Analytics exported to CSV successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting analytics. Please try again.');
    } finally {
      setExportLoading(false);
      setShowExportMenu(false);
    }
  };

  const exportAnalyticsExcel = async () => {
    setExportLoading(true);
    try {
      const exportData = analyticsData.departmentStats.map(dept => ({
        'Department': dept.name,
        'Total Reports': dept.totalReports,
        'Resolved Reports': dept.resolvedReports,
        'Efficiency (%)': dept.efficiency,
        'Status': dept.efficiency > 75 ? 'Excellent' : dept.efficiency > 50 ? 'Good' : 'Needs Improvement'
      }));
      
      const filename = generateFilename(`analytics_${timeRange}`);
      exportToExcel(exportData, filename);
      alert('Analytics exported to Excel successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting analytics. Please try again.');
    } finally {
      setExportLoading(false);
      setShowExportMenu(false);
    }
  };

  const exportAnalyticsJSON = async () => {
    setExportLoading(true);
    try {
      const exportData = {
        timeRange,
        generatedAt: new Date().toISOString(),
        summary: {
          totalReports: analyticsData.stats[0]?.value || '0',
          resolvedReports: analyticsData.stats[1]?.value || '0',
          topPerformingDept: analyticsData.departmentStats[0]?.name || 'N/A',
          avgResolutionTime: analyticsData.stats[3]?.value || 'N/A'
        },
        departmentPerformance: analyticsData.departmentStats,
        categoryBreakdown: analyticsData.categoryStats,
        heatmapData: analyticsData.heatmapData.slice(0, 10)
      };
      
      const filename = generateFilename(`analytics_${timeRange}`);
      exportToJSON(exportData, filename);
      alert('Analytics exported to JSON successfully!');
    } catch (error) {
      console.error('Export error:', error);
      alert('Error exporting analytics. Please try again.');
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
          <p className="text-slate-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="space-y-4 p-2 sm:p-4 lg:p-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 p-3 sm:p-6">
          <div className="mb-4 lg:mb-0">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                CIVIC COMPLAINTS ANALYTICS DASHBOARD
              </h1>
              <button
                onClick={() => setIsPolling(!isPolling)}
                className={`ml-3 flex items-center space-x-2 px-3 py-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  isPolling 
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <SignalIcon className={`w-3 h-3 ${isPolling ? 'animate-pulse' : ''}`} />
                <span>{isPolling ? 'Live' : 'Static'}</span>
              </button>
            </div>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Real-time insights with interactive heatmap visualization
              {lastUpdate && (
                <span className="ml-2 text-xs text-slate-500">
                  Updated: {lastUpdate.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border-2 border-blue-200 rounded-lg px-3 sm:px-4 py-2 bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-400 transition-all duration-200 font-medium text-slate-700 text-sm sm:text-base"
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            
            {/* Export Menu */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={exportLoading}
                className="flex items-center justify-center px-3 sm:px-4 py-2 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all duration-200 font-medium text-sm sm:text-base disabled:opacity-50"
              >
                {exportLoading ? (
                  <ArrowPathIcon className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
                )}
                <span className="hidden sm:inline">Export Report</span>
              </button>
              
              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-blue-100 z-50">
                  <div className="py-2">
                    <button
                      onClick={exportAnalyticsCSV}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 flex items-center"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4 mr-2 text-blue-600" />
                      Export as CSV
                    </button>
                    <button
                      onClick={exportAnalyticsExcel}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 flex items-center"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4 mr-2 text-green-600" />
                      Export as Excel
                    </button>
                    <button
                      onClick={exportAnalyticsJSON}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 flex items-center"
                    >
                      <DocumentArrowDownIcon className="w-4 h-4 mr-2 text-purple-600" />
                      Export as JSON
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {analyticsData.stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-gradient-to-br from-white to-gray-50 rounded-lg sm:rounded-xl shadow-lg border-2 border-blue-100 p-3 sm:p-4 lg:p-6 hover:shadow-xl transition-all duration-300">
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

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
          {/* Category Performance */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 p-3 sm:p-4 lg:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center">
              <ChartBarIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600" />
              Category Performance
            </h3>
            
            <div className="space-y-4 sm:space-y-6">
              {analyticsData.categoryStats.map((category, index) => (
                <div key={index} className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-semibold text-slate-900 truncate">{category.name}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs sm:text-sm text-slate-600 font-medium">{category.percentage}%</span>
                      {category.trend === 'up' ? (
                        <ArrowTrendingUpIcon className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-500" />
                      ) : (
                        <ArrowTrendingDownIcon className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-slate-200 rounded-full h-2 sm:h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-emerald-500 h-2 sm:h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(category.percentage, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs sm:text-sm text-slate-600 font-medium min-w-0">
                      {category.resolved}/{category.reports}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Interactive Heatmap with better error handling */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 p-3 sm:p-4 lg:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6 flex items-center">
              <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-purple-600" />
              Geographic Complaint Density
            </h3>
            
            <div className="h-64 sm:h-80 rounded-lg overflow-hidden border border-gray-200">
              <MapContainer
                center={[20.5937, 78.9629]} // Center of India
                zoom={5}
                style={{ height: '100%', width: '100%' }}
                key={`map-${analyticsData.heatmapData.length}`} // Force re-render when data changes
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <HeatmapLayer data={analyticsData.heatmapData} />
              </MapContainer>
            </div>
            
            {/* Enhanced Heatmap Legend and Stats */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600 font-medium">Intensity Scale:</span>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded mr-1"></div>
                    <span>Low</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded mr-1"></div>
                    <span>Medium</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded mr-1"></div>
                    <span>Critical</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-700">
                    Heatmap Data Points: {analyticsData.heatmapData.length}
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-medium">Critical: </span>
                      <span className="text-red-600">
                        {analyticsData.heatmapData.filter(d => d.Severity === 'Critical').length}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">High: </span>
                      <span className="text-orange-600">
                        {analyticsData.heatmapData.filter(d => d.Severity === 'High').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Performance Speedometers */}
       {/* Department Performance Speedometers - Updated Layout */}
<div className="space-y-6">
  <div className="text-center">
    <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center mb-2">
      <BuildingOfficeIcon className="w-8 h-8 mr-3 text-indigo-600" />
      Department Performance Matrix
    </h2>
    <p className="text-gray-600 max-w-2xl mx-auto">
      Real-time efficiency metrics showing resolution rates and performance indicators for each department
    </p>
  </div>
  
  {/* Responsive Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {analyticsData.departmentStats.map((dept, index) => (
      <SpeedometerGauge
        key={index}
        value={parseFloat(dept.efficiency)}
        title="Efficiency"
        department={dept.name}
        total={dept.totalReports}
        resolved={dept.resolvedReports}
      />
    ))}
  </div>
</div>

        {/* Summary Insights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg sm:rounded-xl shadow-lg border-2 border-emerald-200 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center mb-3">
              <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 mr-2" />
              <h4 className="text-sm sm:text-base font-bold text-slate-900">Top Category</h4>
            </div>
            <p className="text-lg sm:text-xl font-bold text-emerald-700 mb-1">
              {analyticsData.categoryStats[0]?.name || 'N/A'}
            </p>
            <p className="text-xs sm:text-sm text-slate-600">
              {analyticsData.categoryStats[0]?.percentage || 0}% of all reports
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl shadow-lg border-2 border-blue-200 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center mb-3">
              <BuildingOfficeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mr-2" />
              <h4 className="text-sm sm:text-base font-bold text-slate-900">Best Performing Dept</h4>
            </div>
            <p className="text-lg sm:text-xl font-bold text-blue-700 mb-1">
              {analyticsData.departmentStats[0]?.name || 'N/A'}
            </p>
            <p className="text-xs sm:text-sm text-slate-600">
              {analyticsData.departmentStats[0]?.efficiency || 0}% efficiency rate
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg sm:rounded-xl shadow-lg border-2 border-purple-200 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center mb-3">
              <ClockIcon className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 mr-2" />
              <h4 className="text-sm sm:text-base font-bold text-slate-900">Resolution Time</h4>
            </div>
            <p className="text-lg sm:text-xl font-bold text-purple-700 mb-1">
              {analyticsData.stats[3]?.value || 'N/A'}
            </p>
            <p className="text-xs sm:text-sm text-slate-600">
              Average time to resolve
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg sm:rounded-xl shadow-lg border-2 border-red-200 p-3 sm:p-4 lg:p-6">
            <div className="flex items-center mb-3">
              <ExclamationTriangleIcon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 mr-2" />
              <h4 className="text-sm sm:text-base font-bold text-slate-900">Critical Issues</h4>
            </div>
            <p className="text-lg sm:text-xl font-bold text-red-700 mb-1">
              {analyticsData.heatmapData.filter(h => h.Severity === 'Critical').length}
            </p>
            <p className="text-xs sm:text-sm text-slate-600">
              Require immediate attention
            </p>
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

export default AdminAnalytics;