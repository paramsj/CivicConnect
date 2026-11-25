// src/utils/constants.js

// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export const API_ENDPOINTS = {
  // Authentication
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  LOGOUT: '/auth/logout',
  VERIFY_TOKEN: '/auth/verify',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHANGE_PASSWORD: '/auth/change-password',
  GOOGLE_LOGIN: '/auth/google',
  CHECK_EMAIL: '/auth/check-email',

  // Users
  USERS: '/users',
  CURRENT_USER: '/users/me',
  UPLOAD_AVATAR: '/users/avatar',

  // Complaints
  COMPLAINTS: '/complaints',
  MY_COMPLAINTS: '/complaints/my',
  
  // Dashboard
  DASHBOARD_STATS: '/dashboard/stats',
  PERFORMANCE_METRICS: '/dashboard/metrics',
  ANALYTICS: '/dashboard/analytics',
  
  // Reports
  REPORTS: '/reports',
  
  // Categories
  CATEGORIES: '/categories',
  
  // Departments
  DEPARTMENTS: '/departments',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
};

// App Configuration
export const APP_CONFIG = {
  APP_NAME: 'CivicConnect',
  APP_VERSION: '1.0.0',
  COPYRIGHT_YEAR: new Date().getFullYear(),
  SUPPORT_EMAIL: 'support@civicconnect.com',
  COMPANY_NAME: 'Municipal Management Systems',
  
  // Pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  
  // File Upload
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain', 'application/msword'],
};

// UI Constants
export const UI_CONFIG = {
  TOAST_DURATION: 5000,
  LOADING_DELAY: 300,
  DEBOUNCE_DELAY: 500,
  
  // Breakpoints (matching Tailwind)
  BREAKPOINTS: {
    SM: 640,
    MD: 768,
    LG: 1024,
    XL: 1280,
    '2XL': 1536,
  },
  
  // Colors
  COLORS: {
    PRIMARY: '#0f766e', // teal-700
    SECONDARY: '#0891b2', // sky-600
    SUCCESS: '#059669', // emerald-600
    WARNING: '#d97706', // amber-600
    ERROR: '#dc2626', // red-600
    INFO: '#2563eb', // blue-600
  },
};

// Complaint Status
export const COMPLAINT_STATUS = {
  SUBMITTED: 'Submitted',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  REJECTED: 'Rejected',
};

// Complaint Severity
export const COMPLAINT_SEVERITY = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
  CRITICAL: 'Critical',
};

// Complaint Categories
export const COMPLAINT_CATEGORIES = {
  POTHOLE: 'Pothole',
  STREETLIGHT: 'Streetlight',
  GARBAGE: 'Garbage',
  DRAINAGE: 'Drainage',
  WATER_SUPPLY: 'Water Supply',
  TRAFFIC_SIGNAL: 'Traffic Signal',
  TREE_FALL: 'Tree Fall',
  NOISE_POLLUTION: 'Noise Pollution',
  ILLEGAL_PARKING: 'Illegal Parking',
  FOOTPATH_SIDEWALK: 'Footpath/Sidewalk',
};

// User Roles
export const USER_ROLES = {
  CITIZEN: 'citizen',
  ADMIN: 'admin',
  STAFF: 'staff',
  SUPERVISOR: 'supervisor',
};

// Departments
export const DEPARTMENTS = {
  PUBLIC_WORKS: 'Public Works',
  TRANSPORT: 'Transport Dept.',
  SEWERAGE: 'Sewerage',
  GARDENING: 'Gardening Dept.',
  ELECTRICITY: 'Electricity Board',
  WATER: 'Water Department',
  WASTE_MANAGEMENT: 'Waste Management',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  RECENT_ITEMS: 'recent_items',
  DASHBOARD_LAYOUT: 'dashboard_layout',
  THEME: 'theme',
  LANGUAGE: 'language',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  COMPLAINTS: '/complaints',
  MY_COMPLAINTS: '/my-complaints',
  REPORT_ISSUE: '/report-issue',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  HELP: '/help',
  CONTACT: '/contact',
  ABOUT: '/about',
  NOT_FOUND: '/404',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  API: 'yyyy-MM-dd',
  TIME_ONLY: 'HH:mm',
};

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  PASSWORD_MIN_LENGTH: 8,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 50,
  DESCRIPTION_MAX_LENGTH: 1000,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
  
  // Form specific
  REQUIRED_FIELD: 'This field is required.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  INVALID_PHONE: 'Please enter a valid phone number.',
  PASSWORD_TOO_SHORT: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters.`,
  PASSWORDS_DONT_MATCH: 'Passwords do not match.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  LOGOUT_SUCCESS: 'Successfully logged out!',
  REGISTER_SUCCESS: 'Account created successfully!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  PASSWORD_CHANGED: 'Password changed successfully!',
  COMPLAINT_SUBMITTED: 'Complaint submitted successfully!',
  COMPLAINT_UPDATED: 'Complaint updated successfully!',
  COMPLAINT_DELETED: 'Complaint deleted successfully!',
  EMAIL_SENT: 'Email sent successfully!',
};

// Export default config object
export default {
  API_BASE_URL,
  API_ENDPOINTS,
  APP_CONFIG,
  UI_CONFIG,
  COMPLAINT_STATUS,
  COMPLAINT_SEVERITY,
  COMPLAINT_CATEGORIES,
  USER_ROLES,
  DEPARTMENTS,
  STORAGE_KEYS,
  ROUTES,
  DATE_FORMATS,
  VALIDATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
