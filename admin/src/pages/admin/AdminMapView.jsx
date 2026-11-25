import React, { useState, useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';
import {
  FunnelIcon,
  MapPinIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  XMarkIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  CalendarDaysIcon,
  BuildingOfficeIcon,
  TagIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

const AdminMapView = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showDetailPopup, setShowDetailPopup] = useState(false);
  const [highlightCritical, setHighlightCritical] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    category: 'all',
    priority: 'all',
    department: 'all'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const markerClusterGroup = useRef(null);
  const updateTimeoutRef = useRef(null);

  // Debounced filter update function
  const debouncedFilterUpdate = useCallback((newFilters) => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(() => {
      filterReports(newFilters);
    }, 300);
  }, [reports]);

  useEffect(() => {
    loadReports();
  }, []);

  useEffect(() => {
    debouncedFilterUpdate(filters);
  }, [filters, debouncedFilterUpdate]);

  useEffect(() => {
    if (filteredReports.length > 0 && !mapInstance.current) {
      initializeMap();
    } else if (mapInstance.current) {
      updateMapMarkersSmooth();
    }
  }, [filteredReports, highlightCritical]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Build query parameters
      const params = new URLSearchParams();
      
      if (filters.status !== 'all') {
        params.append('status', filters.status);
      }
      
      if (filters.category !== 'all') {
        params.append('category', filters.category);
      }
      
      if (filters.priority !== 'all') {
        params.append('severity', filters.priority);
      }
      
      if (filters.department !== 'all') {
        params.append('department', filters.department);
      }
      
      // Set higher limit for admin view
      params.append('limit', '500');
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/admins/allReports?${params.toString()}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (response.ok && data.data) {
        const transformedReports = data.data.reports.map(report => ({
          id: `REP-${report.complaintId}`,
          complaintId: report.complaintId,
          category: report.category,
          priority: report.severity,
          status: report.progress,
          location: report.location,
          description: report.description,
          department: report.department,
          reportedBy: report.userId?.email || 'Unknown',
          dateSubmitted: report.createdAt,
          coordinates: report.coordinates ? [report.coordinates.lat, report.coordinates.lng] : [19.0760, 72.8777],
          resolutionDate: report.reportEndDate || '—',
          imageUrl: report.imageUrl,
          userId: report.userId,
          createdAt: report.createdAt,
          progress: report.progress,
          severity: report.severity
        }));
        
        setReports(transformedReports);
      } else {
        setError(data.message || 'Failed to fetch reports');
        setReports([]);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
      setError('Network error. Please try again.');
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const normalize = (str) => (str || '').toLowerCase().replace(/[-_ ]+/g, '');

  const filterReports = (currentFilters = filters) => {
    let filtered = [...reports];

    if (currentFilters.status !== 'all') {
      const targetStatus = normalize(currentFilters.status);
      filtered = filtered.filter(report => {
        const reportStatus = normalize(report.status);
        return reportStatus === targetStatus || reportStatus.includes(targetStatus);
      });
    }

    if (currentFilters.category !== 'all') {
      const targetCat = normalize(currentFilters.category);
      filtered = filtered.filter(report => {
        const reportCat = normalize(report.category);
        return reportCat === targetCat || reportCat.includes(targetCat);
      });
    }

    if (currentFilters.priority !== 'all') {
      const targetPri = normalize(currentFilters.priority);
      filtered = filtered.filter(report => 
        normalize(report.priority) === targetPri
      );
    }

    if (currentFilters.department !== 'all') {
      const targetDept = normalize(currentFilters.department);
      filtered = filtered.filter(report => 
        normalize(report.department).includes(targetDept)
      );
    }

    setFilteredReports(filtered);
  };

  // Toggle critical issues highlighting
  const toggleCriticalHighlight = () => {
    setHighlightCritical(prev => !prev);
  };

  // Smooth map marker updates without jarring movements
  const updateMapMarkersSmooth = useCallback(() => {
    if (!mapInstance.current || !L) return;

    // Store current map view
    const currentCenter = mapInstance.current.getCenter();
    const currentZoom = mapInstance.current.getZoom();

    // Clear existing markers smoothly
    if (markerClusterGroup.current) {
      markerClusterGroup.current.clearLayers();
    } else {
      markersRef.current.forEach(marker => {
        mapInstance.current.removeLayer(marker);
      });
    }
    markersRef.current = [];

    // Add new markers
    addMarkersToMapSmooth();

    // Restore view if we have markers, otherwise gently adjust
    if (markersRef.current.length > 0) {
      // Only auto-fit if the user hasn't interacted with the map recently
      const timeSinceLastInteraction = Date.now() - (mapInstance.current._lastInteraction || 0);
      
      if (timeSinceLastInteraction > 2000) { // 2 seconds
        const group = new L.featureGroup(markersRef.current);
        const bounds = group.getBounds();
        
        // Smooth transition to new bounds
        mapInstance.current.flyToBounds(bounds.pad(0.1), {
          duration: 1.0, // 1 second smooth animation
          easeLinearity: 0.25
        });
      } else {
        // Keep current view if user was interacting recently
        mapInstance.current.setView(currentCenter, currentZoom);
      }
    }
  }, [filteredReports, highlightCritical]);

  const addMarkersToMapSmooth = () => {
    if (!mapInstance.current || !L) return;

    const markers = [];

    filteredReports.forEach((report, index) => {
      if (report.coordinates && report.coordinates.length === 2) {
        const [lat, lng] = report.coordinates;
        
        // Create custom icon based on priority with smooth animations
        const iconColor = getPriorityColor(report.priority);
        const isCritical = report.priority === 'critical';
        
        // Enhanced styling for critical issues when highlighting is enabled
        const criticalHighlightClass = highlightCritical && isCritical ? 'critical-highlighted' : '';
        const pulseClass = highlightCritical && isCritical ? 'animate-pulse' : '';
        const glowClass = highlightCritical && isCritical ? 'critical-glow' : '';
        
        const customIcon = L.divIcon({
          className: 'custom-marker-smooth',
          html: `
            <div class="relative marker-container ${criticalHighlightClass}">
              <div class="w-8 h-8 rounded-full ${iconColor} shadow-lg border-2 border-white flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 marker-icon ${pulseClass} ${glowClass}">
                <div class="w-3 h-3 rounded-full bg-white opacity-90"></div>
              </div>
              ${highlightCritical && isCritical ? `
                <div class="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full border border-white animate-ping"></div>
                <div class="absolute -inset-2 border-2 border-red-400 rounded-full animate-pulse opacity-50"></div>
              ` : ''}
            </div>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
          popupAnchor: [0, -16]
        });

        const marker = L.marker([lat, lng], { 
          icon: customIcon,
          riseOnHover: true, // Brings marker to front on hover
          zIndexOffset: isCritical && highlightCritical ? 1000 : 0 // Bring critical markers to top when highlighted
        });

        // Enhanced tooltip for critical issues when highlighted
        const tooltipContent = `
          <div class="bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-[200px] max-w-[250px] tooltip-smooth ${highlightCritical && isCritical ? 'critical-tooltip' : ''}">
            <div class="flex items-center justify-between mb-2">
              <span class="font-bold text-sm text-gray-900">${report.id}</span>
              <span class="px-2 py-1 rounded-full text-xs font-semibold ${getStatusColorClass(report.status)}">
                ${formatStatus(report.status)}
              </span>
            </div>
            <div class="text-xs text-gray-600 space-y-1">
              <div class="flex items-center">
                <span class="w-4 h-4 rounded-full ${getPriorityColor(report.priority)} mr-2 flex-shrink-0"></span>
                <span class="font-medium ${highlightCritical && isCritical ? 'text-red-600 font-bold' : ''}">${report.category}</span>
              </div>
              <div class="text-gray-500 truncate">${report.location}</div>
              ${highlightCritical && isCritical ? '<div class="font-bold text-red-600 mt-2 text-center animate-pulse">🚨 CRITICAL ISSUE 🚨</div>' : '<div class="font-medium text-blue-600 mt-2 text-center">Click for details</div>'}
            </div>
          </div>
        `;

        marker.bindTooltip(tooltipContent, {
          direction: 'top',
          offset: [0, -10],
          opacity: 1,
          className: 'custom-tooltip-smooth',
          sticky: true // Tooltip follows cursor
        });

        // Smooth click handling
        marker.on('click', (e) => {
          // Track interaction time for smooth updates
          mapInstance.current._lastInteraction = Date.now();
          
          setSelectedReport(report);
          setShowDetailPopup(true);
          
          // Smooth zoom to clicked marker
          mapInstance.current.flyTo(e.latlng, Math.max(mapInstance.current.getZoom(), 15), {
            duration: 0.8,
            easeLinearity: 0.25
          });
        });

        // Track mouse interactions for smooth experience
        marker.on('mouseover', () => {
          mapInstance.current._lastInteraction = Date.now();
        });

        markers.push(marker);
        marker.addTo(mapInstance.current);
      }
    });

    markersRef.current = markers;
  };

  const initializeMap = () => {
    if (!mapRef.current || !L) return;

    // Clear existing map
    if (mapInstance.current) {
      mapInstance.current.remove();
    }

    // Initialize Leaflet map with smooth options
    const map = L.map(mapRef.current, {
      center: [19.0760, 72.8777], // Mumbai coordinates
      zoom: 10,
      zoomControl: false,
      attributionControl: true,
      // Smooth interaction options
      zoomAnimation: true,
      fadeAnimation: true,
      markerZoomAnimation: true,
      zoomSnap: 0.5,
      wheelPxPerZoomLevel: 120,
      zoomDelta: 0.5
    });

    mapInstance.current = map;
    
    // Track interactions for smooth updates
    map._lastInteraction = Date.now();
    
    // Track user interactions
    map.on('movestart drag zoom', () => {
      map._lastInteraction = Date.now();
    });

    // Add custom zoom control in better position
    L.control.zoom({
      position: 'bottomright'
    }).addTo(map);

    // Add smooth tile layer with fade effect
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      fadeAnimation: true,
      zoomOffset: 0,
      zoomReverse: false
    }).addTo(map);

    // Add custom CSS for smooth interactions and critical highlighting
    const style = document.createElement('style');
    style.textContent = `
      .custom-tooltip-smooth {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
      }
      
      .custom-tooltip-smooth .leaflet-tooltip-content {
        margin: 0 !important;
        padding: 0 !important;
      }
      
      .tooltip-smooth {
        animation: tooltipFadeIn 0.2s ease-out;
      }
      
      .critical-tooltip {
        animation: criticalPulse 1.5s ease-in-out infinite;
      }
      
      @keyframes tooltipFadeIn {
        from { opacity: 0; transform: translateY(5px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes criticalPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.02); }
      }
      
      .marker-container {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .marker-container:hover {
        transform: scale(1.15);
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
      }
      
      .critical-highlighted {
        animation: criticalGlow 2s ease-in-out infinite;
      }
      
      .critical-glow {
        filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.6));
      }
      
      @keyframes criticalGlow {
        0%, 100% { 
          filter: drop-shadow(0 0 8px rgba(239, 68, 68, 0.6));
          transform: scale(1);
        }
        50% { 
          filter: drop-shadow(0 0 16px rgba(239, 68, 68, 0.8));
          transform: scale(1.1);
        }
      }
      
      .marker-icon {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .leaflet-zoom-anim .leaflet-zoom-animated {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .leaflet-container {
        cursor: grab;
      }
      
      .leaflet-container:active {
        cursor: grabbing;
      }
      
      .leaflet-container .leaflet-control-zoom a {
        background-color: white;
        border: 2px solid #e5e7eb;
        transition: all 0.2s ease;
      }
      
      .leaflet-container .leaflet-control-zoom a:hover {
        background-color: #f3f4f6;
        border-color: #d1d5db;
        transform: scale(1.05);
      }
    `;
    
    if (!document.getElementById('smooth-map-styles')) {
      style.id = 'smooth-map-styles';
      document.head.appendChild(style);
    }

    // Add markers with delay for smooth loading
    setTimeout(() => {
      addMarkersToMapSmooth();
    }, 100);
  };

  // Smooth filter change handler
  const handleFilterChange = useCallback((filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      status: 'all',
      category: 'all',
      priority: 'all',
      department: 'all'
    });
  }, []);

  const getStatusColorClass = (status) => {
    const colors = {
      submitted: 'bg-blue-500 text-white',
      pending: 'bg-yellow-500 text-white',
      'in_progress': 'bg-purple-500 text-white',
      resolved: 'bg-green-500 text-white',
      completed: 'bg-emerald-500 text-white'
    };
    return colors[status] || 'bg-gray-500 text-white';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-500',
      high: 'bg-orange-500',
      medium: 'bg-yellow-500',
      low: 'bg-green-500'
    };
    return colors[priority] || 'bg-gray-500';
  };

  const getPriorityGradient = (priority) => {
    const gradients = {
      critical: 'from-red-500 to-red-600',
      high: 'from-orange-500 to-orange-600',
      medium: 'from-yellow-500 to-yellow-600',
      low: 'from-green-500 to-green-600'
    };
    return gradients[priority] || 'from-gray-500 to-gray-600';
  };

  const formatStatus = (status) => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getMapStats = () => {
    const totalReports = filteredReports.length;
    const criticalReports = filteredReports.filter(r => r.priority === 'critical').length;
    const resolvedReports = filteredReports.filter(r => r.status === 'resolved' || r.status === 'completed').length;
    const pendingReports = filteredReports.filter(r => r.status === 'pending' || r.status === 'submitted').length;

    return {
      totalReports,
      criticalReports,
      resolvedReports,
      pendingReports
    };
  };

  const stats = getMapStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading map data...</p>
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
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
              Interactive Map View
            </h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Smooth geographic visualization with hover previews and detailed popups
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center px-3 sm:px-4 py-2 bg-white border-2 border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 font-medium text-sm sm:text-base"
            >
              <FunnelIcon className="w-4 h-4 mr-2" />
              Filters ({Object.values(filters).filter(f => f !== 'all').length})
            </button>
          </div>
        </div>
        
        {/* Map Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg sm:rounded-xl shadow-lg border-2 border-blue-200 p-3 sm:p-4 lg:p-6 transition-all duration-200 hover:shadow-xl">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-500 shadow-lg">
                <MapPinIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-4 flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-600 truncate">Total Reports</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">{stats.totalReports}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg sm:rounded-xl shadow-lg border-2 border-red-200 p-3 sm:p-4 lg:p-6 transition-all duration-200 hover:shadow-xl">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-red-500 shadow-lg">
                <ExclamationTriangleIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-4 flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-600 truncate">Critical Issues</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">{stats.criticalReports}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg sm:rounded-xl shadow-lg border-2 border-green-200 p-3 sm:p-4 lg:p-6 transition-all duration-200 hover:shadow-xl">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-green-500 shadow-lg">
                <CheckCircleIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-4 flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-600 truncate">Resolved</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">{stats.resolvedReports}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg sm:rounded-xl shadow-lg border-2 border-yellow-200 p-3 sm:p-4 lg:p-6 transition-all duration-200 hover:shadow-xl">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-yellow-500 shadow-lg">
                <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="ml-2 sm:ml-3 lg:ml-4 flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-semibold text-slate-600 truncate">Pending</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900">{stats.pendingReports}</p>
              </div>
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

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 p-3 sm:p-6 animate-in fade-in duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Filter Reports on Map</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-all duration-200"
              >
                <XMarkIcon className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
                  <option value="submitted">Submitted</option>
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

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
                  <option value="potholes">Potholes</option>
                  <option value="garbage">Garbage</option>
                  <option value="construction road">Construction Road</option>
                  <option value="broken signage">Broken Signage</option>
                  <option value="bad streetlight">Bad Streetlight</option>
                  <option value="bad billboard">Bad Billboard</option>
                  <option value="graffiti">Graffiti</option>
                  <option value="faded signage">Faded Signage</option>
                  <option value="sand on road">Sand on Road</option>
                  <option value="clutter sidewalk">Clutter Sidewalk</option>
                  <option value="unkept facade">Unkept Facade</option>
                  <option value="others">Others</option>
                </select>
              </div>

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
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-3 sm:px-4 py-1.5 sm:py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-all duration-200 font-medium text-sm border border-slate-300"
                >
                  Clear All
                </button>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700">
                <strong>Smooth Navigation:</strong> Hover over markers for previews, click for details.
                Filters update smoothly with animations. Map preserves your view during updates.
              </p>
            </div>
          </div>
        )}

        {/* Map Container - Enhanced for Smooth Performance */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 overflow-hidden">
          <div className="h-96 sm:h-[500px] lg:h-[700px] relative">
            <div ref={mapRef} className="w-full h-full transition-all duration-300"></div>
            
            {/* Critical Issues Toggle Button - NEW */}
            <div className="absolute top-4 left-4 z-[1000]">
              <button
                onClick={toggleCriticalHighlight}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg border-2 transition-all duration-200 ${
                  highlightCritical
                    ? 'bg-red-500 text-white border-red-600 hover:bg-red-600'
                    : 'bg-white text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300'
                }`}
                title={highlightCritical ? 'Stop highlighting critical issues' : 'Highlight critical issues'}
              >
                {highlightCritical ? (
                  <>
                    <EyeSlashIcon className="w-4 h-4" />
                    <span className="text-xs font-semibold hidden sm:inline">Hide Critical</span>
                  </>
                ) : (
                  <>
                    <EyeIcon className="w-4 h-4" />
                    <span className="text-xs font-semibold hidden sm:inline">Show Critical</span>
                  </>
                )}
                {highlightCritical && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                )}
              </button>
            </div>

            {/* Enhanced Map Legend */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-3 border border-blue-100 z-[400] transition-all duration-200 hover:shadow-2xl">
              <h4 className="text-sm font-bold text-slate-900 mb-2">Priority Legend</h4>
              <div className="space-y-2">
                <div className="flex items-center text-xs">
                  <div className={`w-4 h-4 bg-red-500 rounded-full mr-2 border-2 border-white shadow-sm ${highlightCritical ? 'animate-pulse' : ''}`}></div>
                  <span className={highlightCritical ? 'font-bold text-red-600' : ''}>
                    Critical {highlightCritical ? '(Highlighted)' : ''}
                  </span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-4 h-4 bg-orange-500 rounded-full mr-2 border-2 border-white shadow-sm"></div>
                  <span>High Priority</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2 border-2 border-white shadow-sm"></div>
                  <span>Medium Priority</span>
                </div>
                <div className="flex items-center text-xs">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2 border-2 border-white shadow-sm"></div>
                  <span>Low Priority</span>
                </div>
              </div>
            </div>

            {/* Enhanced Instructions */}
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg shadow-xl p-3 border border-blue-100 z-[400] max-w-64 transition-all duration-200 hover:shadow-2xl">
              <h4 className="text-sm font-bold text-slate-900 mb-1">Smooth Navigation</h4>
              <div className="text-xs text-slate-600 space-y-1">
                <p><strong>Hover:</strong> Instant preview tooltip</p>
                <p><strong>Click:</strong> Detailed popup with zoom</p>
                <p><strong>Filters:</strong> Smooth real-time updates</p>
                <p><strong>Zoom:</strong> Mouse wheel or controls</p>
                <p className="text-red-600 font-semibold">
                  {/* <strong>🚨 Toggle:</strong> Highlight critical issues */}
                </p>
              </div>
            </div>

            {/* Active Filters Indicator */}
            {Object.values(filters).some(f => f !== 'all') && (
              <div className="absolute top-4 left-4 bg-blue-500 text-white rounded-lg shadow-lg px-3 py-2 text-sm font-medium z-[400] animate-in fade-in duration-300">
                🔍 {Object.values(filters).filter(f => f !== 'all').length} Filter(s) Active
              </div>
            )}

            {/* Critical Highlighting Indicator */}
            {highlightCritical && stats.criticalReports > 0 && (
              <div className="absolute top-16 left-4 bg-red-500 text-white rounded-lg shadow-lg px-3 py-2 text-sm font-medium z-[400] animate-pulse">
                🚨 {stats.criticalReports} Critical Issue(s) Highlighted
              </div>
            )}
          </div>
        </div>

        {/* Reports Summary */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-blue-100 p-4 sm:p-6 transition-all duration-200 hover:shadow-xl">
          <div className="text-center">
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Showing {filteredReports.length} of {reports.length} reports on map
            </h3>
            <p className="text-sm text-slate-600">
              {Object.values(filters).some(f => f !== 'all') 
                ? 'Filters are active. Map updates smoothly as you adjust filters.'
                : 'All reports are displayed. Use filters for focused viewing with smooth transitions.'
              }
              {highlightCritical && stats.criticalReports > 0 && (
                <span className="block text-red-600 font-semibold mt-1">
                  🚨 Critical issues are currently highlighted with enhanced animations
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Enhanced Detailed Report Popup Modal - Same as before */}
      {showDetailPopup && selectedReport && (
        <div className="fixed inset-0 bg-gradient-to-br from-blue-600/50 via-teal-500/50 to-emerald-600/50 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-blue-100 animate-in zoom-in-95 duration-300">
            {/* Header - Matching Theme */}
            <div className={`bg-gradient-to-r ${getPriorityGradient(selectedReport.priority)} p-6 rounded-t-2xl text-white relative overflow-hidden`}>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-teal-600/20"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm border border-white/30">
                      <MapPinIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{selectedReport.id}</h2>
                      <p className="text-white/90">{selectedReport.category}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailPopup(false)}
                    className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 backdrop-blur-sm border border-white/30"
                  >
                    <XMarkIcon className="w-6 h-6 text-white" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-4">
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm border border-white/30">
                    {formatStatus(selectedReport.status)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm border border-white/30">
                    {selectedReport.priority.toUpperCase()} Priority
                  </span>
                </div>
              </div>
            </div>

            {/* Content - Matching Blue/Teal Theme */}
            <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50/50 to-teal-50/50">
              {/* Basic Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 bg-white/70 p-4 rounded-xl border border-blue-100 transition-all duration-200 hover:bg-white/90">
                    <TagIcon className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Category</h4>
                      <p className="text-gray-600">{selectedReport.category}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-white/70 p-4 rounded-xl border border-emerald-100 transition-all duration-200 hover:bg-white/90">
                    <UserIcon className="w-5 h-5 text-emerald-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Reported By</h4>
                      <p className="text-gray-600">{selectedReport.reportedBy}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-white/70 p-4 rounded-xl border border-purple-100 transition-all duration-200 hover:bg-white/90">
                    <CalendarDaysIcon className="w-5 h-5 text-purple-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Date Submitted</h4>
                      <p className="text-gray-600">{formatDate(selectedReport.dateSubmitted)}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3 bg-white/70 p-4 rounded-xl border border-orange-100 transition-all duration-200 hover:bg-white/90">
                    <BuildingOfficeIcon className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Department</h4>
                      <p className="text-gray-600">{selectedReport.department}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 bg-white/70 p-4 rounded-xl border border-red-100 transition-all duration-200 hover:bg-white/90">
                    <MapPinIcon className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Location</h4>
                      <p className="text-gray-600">{selectedReport.location}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {selectedReport.coordinates[0]}, {selectedReport.coordinates[1]}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white/70 p-6 rounded-xl border border-blue-100 transition-all duration-200 hover:bg-white/90">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <PhotoIcon className="w-5 h-5 text-indigo-500 mr-2" />
                  Description
                </h4>
                <p className="text-gray-700 leading-relaxed">{selectedReport.description}</p>
              </div>

              {/* Attached Images */}
              <div className="bg-white/70 p-6 rounded-xl border border-blue-100 transition-all duration-200 hover:bg-white/90">
                <h4 className="font-semibold text-gray-900 mb-3">Attached Images</h4>
                {selectedReport.imageUrl ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {(Array.isArray(selectedReport.imageUrl) ? selectedReport.imageUrl : [selectedReport.imageUrl]).map((url, index) => (
                      <div key={index} className="aspect-square bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg overflow-hidden border border-blue-200 transition-all duration-200 hover:scale-105">
                        <img
                          src={url}
                          alt={`Report Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full flex items-center justify-center" style={{ display: 'none' }}>
                          <div className="text-center">
                            <PhotoIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                            <p className="text-xs text-blue-600">Image {index + 1}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[1, 2, 3].map((index) => (
                      <div key={index} className="aspect-square bg-gradient-to-br from-blue-100 to-teal-100 rounded-lg flex items-center justify-center border border-blue-200 transition-all duration-200 hover:scale-105">
                        <div className="text-center">
                          <PhotoIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                          <p className="text-xs text-blue-600">Image {index}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Timeline */}
              <div className="bg-white/70 p-6 rounded-xl border border-blue-100 transition-all duration-200 hover:bg-white/90">
                <h4 className="font-semibold text-gray-900 mb-3">Status Information</h4>
                <div className="bg-gradient-to-r from-blue-100 to-teal-100 rounded-lg p-4 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Current Status</p>
                      <p className="text-sm text-gray-600">{formatStatus(selectedReport.status)}</p>
                    </div>
                    <div className={`w-4 h-4 rounded-full ${getPriorityColor(selectedReport.priority)}`}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer - Matching Theme */}
            <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-teal-50 rounded-b-2xl border-t border-blue-100">
              <div className="flex justify-center">
                <button
                  onClick={() => setShowDetailPopup(false)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-all duration-200 font-medium shadow-lg"
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leaflet CSS */}
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    </div>
  );
};

export default AdminMapView;