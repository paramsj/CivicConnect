// src/services/apiService.js
import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Set the getToken function from outside (will be set by a component with access to Clerk)
  setTokenGetter(getTokenFn) {
    this.getTokenFn = getTokenFn;
  }

  // Get authentication token from Clerk
  async getAuthToken() {
    if (this.getTokenFn) {
      try {
        return await this.getTokenFn();
      } catch (error) {
        console.error('Failed to get auth token:', error);
        return null;
      }
    }
    return null;
  }

  // Add auth header if token exists
  async getHeaders(customHeaders = {}) {
    const token = await this.getAuthToken();
    return {
      ...this.defaultHeaders,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...customHeaders,
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: await this.getHeaders(options.headers),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // File upload
  async uploadFile(endpoint, file, additionalData = {}) {
    const formData = new FormData();
    formData.append('file', file);
    
    // Add additional form data
    Object.keys(additionalData).forEach(key => {
      formData.append(key, additionalData[key]);
    });

    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData, let browser set it
        Authorization: `Bearer ${this.getAuthToken()}`,
      },
    });
  }

  // Specific API methods for civic app
  
  // Complaints API
  async getComplaints(params = {}) {
    return this.get(API_ENDPOINTS.COMPLAINTS, params);
  }

  async getComplaint(id) {
    return this.get(`${API_ENDPOINTS.COMPLAINTS}/${id}`);
  }

  async createComplaint(data) {
    return this.post(API_ENDPOINTS.COMPLAINTS, data);
  }

  async updateComplaint(id, data) {
    return this.put(`${API_ENDPOINTS.COMPLAINTS}/${id}`, data);
  }

  async deleteComplaint(id) {
    return this.delete(`${API_ENDPOINTS.COMPLAINTS}/${id}`);
  }

  // Users API
  async getUsers(params = {}) {
    return this.get(API_ENDPOINTS.USERS, params);
  }

  async getUser(id) {
    return this.get(`${API_ENDPOINTS.USERS}/${id}`);
  }

  async updateUser(id, data) {
    return this.put(`${API_ENDPOINTS.USERS}/${id}`, data);
  }

  // Dashboard API
  async getDashboardStats() {
    return this.get(API_ENDPOINTS.DASHBOARD_STATS);
  }

  async getPerformanceMetrics(params = {}) {
    return this.get(API_ENDPOINTS.PERFORMANCE_METRICS, params);
  }

  // Analytics API
  async getAnalytics(params = {}) {
    return this.get(API_ENDPOINTS.ANALYTICS, params);
  }

  // Reports API
  async generateReport(type, params = {}) {
    return this.post(`${API_ENDPOINTS.REPORTS}/${type}`, params);
  }

  // Health check
  async healthCheck() {
    return this.get('/health');
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;
