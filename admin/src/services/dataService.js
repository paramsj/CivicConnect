// src/services/dataService.js
class DataService {
  constructor() {
    this.complaintsData = null;
    this.usersData = null;
    this.isLoading = false;
  }

  async loadComplaintsData(forceRefresh = false) {
    if (this.complaintsData && !forceRefresh) return this.complaintsData;
    
    try {
      const apiUrl = import.meta.env.VITE_API_URL || '/api/v1';
      const response = await fetch(`${apiUrl}/admins/allReports?limit=2000`);
      if (response.ok) {
        const json = await response.json();
        if (json.data && json.data.reports) {
          this.complaintsData = json.data.reports.map(r => ({
            Complaint_ID: `REP-${r.complaintId}`,
            complaintId: r.complaintId,
            Date_Time: r.createdAt,
            createdAt: r.createdAt,
            updatedAt: r.updatedAt,
            User_ID: (r.userId && (r.userId._id || r.userId)) || 'User',
            Description: r.description || '',
            description: r.description || '',
            Category: r.category || 'others',
            category: r.category || 'others',
            Severity: r.severity || 'low',
            severity: r.severity || 'low',
            Latitude: r.coordinates?.lat || 19.0760,
            Longitude: r.coordinates?.lng || 72.8777,
            coordinates: r.coordinates,
            Location: r.location || 'Unknown',
            location: r.location || 'Unknown',
            Image_URL: r.imageUrl || '',
            imageUrl: r.imageUrl || '',
            Status: r.progress || 'submitted',
            progress: r.progress || 'submitted',
            Department: r.department || 'General Services',
            department: r.department || 'General Services',
            Resolution_Date: r.updatedAt || '',
            adminNotes: r.adminNotes || '',
            reportedBy: (r.userId && r.userId.email) || 'User',
            userId: r.userId
          }));
          return this.complaintsData;
        }
      }
      return [];
    } catch (error) {
      console.error('Error loading complaints data from API:', error);
      return [];
    }
  }

  async loadUsersData() {
    if (this.usersData) return this.usersData;
    
    try {
      const response = await fetch('/data/civic_users.json');
      this.usersData = await response.json();
      return this.usersData;
    } catch (error) {
      // Fallback: derive users from complaints data
      const complaints = await this.loadComplaintsData();
      const userMap = new Map();
      complaints.forEach((c, idx) => {
        const email = c.reportedBy || (c.userId && c.userId.email) || `user${idx}@example.com`;
        const id = (c.userId && (c.userId._id || c.userId)) || `USR-${idx + 1000}`;
        if (!userMap.has(email)) {
          userMap.set(email, {
            userID: id,
            email: email,
            civic_score: Math.min(100, Math.floor(Math.random() * 40) + 60)
          });
        }
      });
      this.usersData = Array.from(userMap.values());
      return this.usersData;
    }
  }

  // Transform complaint data to match our component structure
  transformComplaintData(complaint) {
    return {
      id: complaint.Complaint_ID || `REP-${complaint.complaintId}`,
      complaintId: complaint.complaintId,
      dateSubmitted: complaint.Date_Time || complaint.createdAt,
      userId: complaint.User_ID || (complaint.userId && (complaint.userId._id || complaint.userId)),
      description: complaint.Description || complaint.description || '',
      category: complaint.Category || complaint.category || 'others',
      priority: (complaint.Severity || complaint.severity || 'low').toLowerCase(),
      coordinates: complaint.coordinates ? [complaint.coordinates.lat, complaint.coordinates.lng] : [complaint.Latitude || 19.0760, complaint.Longitude || 72.8777],
      location: complaint.Location || complaint.location || 'Unknown',
      imageUrl: complaint.Image_URL || complaint.imageUrl || '',
      status: (complaint.Status || complaint.progress || 'submitted').toLowerCase().replace(' ', '_'),
      progress: complaint.progress || complaint.Status || 'submitted',
      department: complaint.Department || complaint.department || 'General Services',
      resolutionDate: complaint.Resolution_Date || complaint.updatedAt || '',
      reportedBy: complaint.reportedBy || (complaint.userId && complaint.userId.email) || `User ${complaint.User_ID || ''}`,
      assignedTo: complaint.Department || complaint.department || 'General Services',
      adminNotes: complaint.adminNotes || ''
    };
  }

  // Get all complaints with filtering options
  async getComplaints(filters = {}) {
    const data = await this.loadComplaintsData();
    let filteredData = data.map(complaint => this.transformComplaintData(complaint));

    // Apply filters
    if (filters.status && filters.status !== 'all') {
      const normalizedStatus = filters.status.toLowerCase().replace(/[-_ ]+/g, '');
      filteredData = filteredData.filter(complaint => 
        complaint.status.replace(/[-_ ]+/g, '') === normalizedStatus
      );
    }

    if (filters.category && filters.category !== 'all') {
      const normalizedCat = filters.category.toLowerCase().replace(/[-_ ]+/g, '');
      filteredData = filteredData.filter(complaint => 
        complaint.category.toLowerCase().replace(/[-_ ]+/g, '') === normalizedCat
      );
    }

    if (filters.priority && filters.priority !== 'all') {
      filteredData = filteredData.filter(complaint => 
        complaint.priority === filters.priority.toLowerCase()
      );
    }

    if (filters.department && filters.department !== 'all') {
      filteredData = filteredData.filter(complaint => 
        complaint.department === filters.department
      );
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase();
      filteredData = filteredData.filter(complaint => 
        (complaint.id && complaint.id.toLowerCase().includes(searchLower)) ||
        (complaint.description && complaint.description.toLowerCase().includes(searchLower)) ||
        (complaint.location && complaint.location.toLowerCase().includes(searchLower)) ||
        (complaint.reportedBy && complaint.reportedBy.toLowerCase().includes(searchLower))
      );
    }

    // Sort data
    if (filters.sortBy) {
      filteredData.sort((a, b) => {
        switch (filters.sortBy) {
          case 'date_newest':
            return new Date(b.dateSubmitted) - new Date(a.dateSubmitted);
          case 'date_oldest':
            return new Date(a.dateSubmitted) - new Date(b.dateSubmitted);
          case 'priority_high':
            const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
          case 'priority_low':
            const priorityOrderLow = { critical: 3, high: 2, medium: 1, low: 0 };
            return priorityOrderLow[a.priority] - priorityOrderLow[b.priority];
          default:
            return 0;
        }
      });
    }

    return filteredData;
  }

  // Get dashboard statistics
  async getDashboardStats() {
    const data = await this.loadComplaintsData();
    
    const totalReports = data.length;
    const resolvedReports = data.filter(complaint => {
      const s = (complaint.Status || complaint.progress || '').toLowerCase().replace(/[-_ ]+/g, '');
      return s.includes('resolved') || s.includes('completed');
    }).length;
    
    const pendingReports = data.filter(complaint => {
      const s = (complaint.Status || complaint.progress || '').toLowerCase().replace(/[-_ ]+/g, '');
      return s.includes('pending') || s.includes('submitted') || s.includes('assigned') || s.includes('accepted');
    }).length;
    
    const inProgressReports = data.filter(complaint => {
      const s = (complaint.Status || complaint.progress || '').toLowerCase().replace(/[-_ ]+/g, '');
      return s.includes('progress');
    }).length;

    // Calculate average resolution time (in days)
    const resolvedWithDates = data.filter(c => 
      ((c.Status || c.progress || '').toLowerCase().includes('resolved') || (c.Status || c.progress || '').toLowerCase().includes('completed')) &&
      c.createdAt && c.updatedAt
    );
    let avgResolutionTime = 3.2;
    if (resolvedWithDates.length > 0) {
      const totalTimeMs = resolvedWithDates.reduce((acc, c) => {
        const diff = Math.max(0, new Date(c.updatedAt) - new Date(c.createdAt));
        return acc + diff;
      }, 0);
      avgResolutionTime = Math.round((totalTimeMs / (resolvedWithDates.length * 1000 * 3600 * 24)) * 10) / 10;
    }

    return {
      totalReports,
      resolvedReports,
      pendingReports,
      inProgressReports,
      totalUsers: 0,
      avgResolutionTime
    };
  }

  // Get recent reports for dashboard
  async getRecentReports(limit = 5) {
    const data = await this.getComplaints({ sortBy: 'date_newest' });
    return data.slice(0, limit);
  }

  // Get department performance data
  async getDepartmentPerformance() {
    const data = await this.loadComplaintsData();
    const departmentStats = {};
    
    data.forEach(complaint => {
      const dept = complaint.Department || complaint.department || 'General Services';
      if (!departmentStats[dept]) {
        departmentStats[dept] = {
          total: 0,
          resolved: 0,
          name: dept
        };
      }
      departmentStats[dept].total++;
      
      const s = (complaint.Status || complaint.progress || '').toLowerCase().replace(/[-_ ]+/g, '');
      if (s.includes('resolved') || s.includes('completed')) {
        departmentStats[dept].resolved++;
      }
    });

    return Object.values(departmentStats).map(dept => ({
      name: dept.name,
      efficiency: dept.total > 0 ? Math.round((dept.resolved / dept.total) * 100) : 0,
      totalReports: dept.total,
      resolvedReports: dept.resolved,
      color: this.getDepartmentColor(dept.name)
    })).sort((a, b) => b.totalReports - a.totalReports);
  }

  // Get analytics data
  async getAnalyticsData() {
    const data = await this.loadComplaintsData();
    const users = await this.loadUsersData();
    
    // Category statistics
    const categoryStats = {};
    data.forEach(complaint => {
      const category = complaint.Category || complaint.category || 'others';
      if (!categoryStats[category]) {
        categoryStats[category] = {
          total: 0,
          resolved: 0
        };
      }
      categoryStats[category].total++;
      
      const s = (complaint.Status || complaint.progress || '').toLowerCase().replace(/[-_ ]+/g, '');
      if (s.includes('resolved') || s.includes('completed')) {
        categoryStats[category].resolved++;
      }
    });

    const categoryData = Object.entries(categoryStats).map(([name, stats]) => ({
      name,
      reports: stats.total,
      resolved: stats.resolved,
      percentage: stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0,
      trend: Math.random() > 0.5 ? 'up' : 'down'
    }));

    const resolvedReports = data.filter(c => {
      const s = (c.Status || c.progress || '').toLowerCase().replace(/[-_ ]+/g, '');
      return s.includes('resolved') || s.includes('completed');
    }).length;

    return {
      totalReports: data.length,
      resolvedReports,
      totalUsers: users.length || Math.round(data.length * 0.4),
      avgResolutionTime: 3.2,
      categoryStats: categoryData
    };
  }

  // Get users data
  async getUsers() {
    const users = await this.loadUsersData();
    return users.map(user => ({
      id: user.userID || user.id,
      email: user.email,
      civicScore: user.civic_score || user.civicScore || 75,
      status: (user.civic_score || 75) > 70 ? 'active' : (user.civic_score || 75) > 40 ? 'moderate' : 'inactive',
      reportsSubmitted: Math.floor(Math.random() * 20) + 1,
      lastActive: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));
  }

  // Helper method to get department colors
  getDepartmentColor(department) {
    const colors = {
      'Public Works Department': 'bg-gradient-to-r from-blue-500 to-blue-600',
      'Sanitation Department': 'bg-gradient-to-r from-emerald-500 to-emerald-600',
      'Infrastructure Department': 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      'Advertising & Infrastructure': 'bg-gradient-to-r from-purple-500 to-purple-600',
      'Municipal Art & Cleaning': 'bg-gradient-to-r from-pink-500 to-pink-600',
      'General Services': 'bg-gradient-to-r from-indigo-500 to-indigo-600',
      'Urban Planning / General Services': 'bg-gradient-to-r from-cyan-500 to-cyan-600',
      'Public Works': 'bg-gradient-to-r from-blue-500 to-blue-600',
      'Gardening Dept.': 'bg-gradient-to-r from-green-500 to-green-600',
      'Sewerage': 'bg-gradient-to-r from-purple-500 to-purple-600',
      'Electricity': 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      'Water Supply': 'bg-gradient-to-r from-cyan-500 to-cyan-600',
      'Traffic': 'bg-gradient-to-r from-red-500 to-red-600'
    };
    return colors[department] || 'bg-gradient-to-r from-slate-500 to-slate-600';
  }

  // Get unique values for filter dropdowns
  async getFilterOptions() {
    const data = await this.loadComplaintsData();
    
    const categories = [...new Set(data.map(c => c.Category))].sort();
    const departments = [...new Set(data.map(c => c.Department))].sort();
    const severities = [...new Set(data.map(c => c.Severity))].sort();
    const statuses = [...new Set(data.map(c => c.Status))].sort();

    return {
      categories,
      departments,
      severities,
      statuses
    };
  }
}

export default new DataService();