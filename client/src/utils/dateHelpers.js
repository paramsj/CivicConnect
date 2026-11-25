// src/utils/dateHelpers.js
import { DATE_FORMATS } from './constants';

export class DateHelpers {
  // Format date to readable string
  static formatDate(date, format = DATE_FORMATS.DISPLAY) {
    if (!date) return '';
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';

    const options = this.getDateFormatOptions(format);
    return dateObj.toLocaleDateString('en-US', options);
  }

  // Format date with time
  static formatDateTime(date, format = DATE_FORMATS.DISPLAY_WITH_TIME) {
    if (!date) return '';
    
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return '';

    const options = this.getDateTimeFormatOptions(format);
    return dateObj.toLocaleString('en-US', options);
  }

  // Get relative time (e.g., "2 hours ago", "3 days ago")
  static getRelativeTime(date) {
    if (!date) return '';
    
    const dateObj = new Date(date);
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);

    const intervals = [
      { label: 'year', seconds: 31536000 },
      { label: 'month', seconds: 2592000 },
      { label: 'week', seconds: 604800 },
      { label: 'day', seconds: 86400 },
      { label: 'hour', seconds: 3600 },
      { label: 'minute', seconds: 60 },
      { label: 'second', seconds: 1 }
    ];

    for (const interval of intervals) {
      const count = Math.floor(diffInSeconds / interval.seconds);
      if (count >= 1) {
        return count === 1 
          ? `1 ${interval.label} ago`
          : `${count} ${interval.label}s ago`;
      }
    }

    return 'just now';
  }

  // Check if date is today
  static isToday(date) {
    if (!date) return false;
    
    const dateObj = new Date(date);
    const today = new Date();
    
    return dateObj.toDateString() === today.toDateString();
  }

  // Check if date is yesterday
  static isYesterday(date) {
    if (!date) return false;
    
    const dateObj = new Date(date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return dateObj.toDateString() === yesterday.toDateString();
  }

  // Check if date is this week
  static isThisWeek(date) {
    if (!date) return false;
    
    const dateObj = new Date(date);
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
    
    return dateObj >= startOfWeek && dateObj <= endOfWeek;
  }

  // Get days between two dates
  static getDaysBetween(startDate, endDate) {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Add days to date
  static addDays(date, days) {
    if (!date) return null;
    
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  // Subtract days from date
  static subtractDays(date, days) {
    return this.addDays(date, -days);
  }

  // Get start of day
  static getStartOfDay(date) {
    if (!date) return null;
    
    const result = new Date(date);
    result.setHours(0, 0, 0, 0);
    return result;
  }

  // Get end of day
  static getEndOfDay(date) {
    if (!date) return null;
    
    const result = new Date(date);
    result.setHours(23, 59, 59, 999);
    return result;
  }

  // Format for API (ISO string)
  static formatForAPI(date) {
    if (!date) return '';
    
    const dateObj = new Date(date);
    return dateObj.toISOString();
  }

  // Parse API date string
  static parseFromAPI(dateString) {
    if (!dateString) return null;
    
    return new Date(dateString);
  }

  // Get current date in various formats
  static getCurrentDate() {
    return new Date();
  }

  static getCurrentDateString(format = DATE_FORMATS.API) {
    return this.formatDate(new Date(), format);
  }

  // Validate date
  static isValidDate(date) {
    return date instanceof Date && !isNaN(date.getTime());
  }

  // Get age from birthdate
  static getAge(birthdate) {
    if (!birthdate) return 0;
    
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  // Get business days between dates (excluding weekends)
  static getBusinessDaysBetween(startDate, endDate) {
    if (!startDate || !endDate) return 0;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    let businessDays = 0;
    
    while (start <= end) {
      const dayOfWeek = start.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) or Saturday (6)
        businessDays++;
      }
      start.setDate(start.getDate() + 1);
    }
    
    return businessDays;
  }

  // Helper methods for format options
  static getDateFormatOptions(format) {
    switch (format) {
      case DATE_FORMATS.DISPLAY:
        return { year: 'numeric', month: 'short', day: '2-digit' };
      case DATE_FORMATS.API:
        return { year: 'numeric', month: '2-digit', day: '2-digit' };
      default:
        return { year: 'numeric', month: 'short', day: '2-digit' };
    }
  }

  static getDateTimeFormatOptions(format) {
    switch (format) {
      case DATE_FORMATS.DISPLAY_WITH_TIME:
        return {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        };
      case DATE_FORMATS.TIME_ONLY:
        return { hour: '2-digit', minute: '2-digit' };
      default:
        return {
          year: 'numeric',
          month: 'short',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        };
    }
  }

  // Format date range
  static formatDateRange(startDate, endDate) {
    if (!startDate && !endDate) return '';
    if (!endDate) return this.formatDate(startDate);
    if (!startDate) return this.formatDate(endDate);
    
    const start = this.formatDate(startDate);
    const end = this.formatDate(endDate);
    
    return `${start} - ${end}`;
  }

  // Get time zone
  static getTimeZone() {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  }

  // Convert UTC to local time
  static utcToLocal(utcDate) {
    if (!utcDate) return null;
    
    const date = new Date(utcDate);
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
  }

  // Convert local time to UTC
  static localToUtc(localDate) {
    if (!localDate) return null;
    
    const date = new Date(localDate);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  }
}

// Export individual functions for easier importing
export const {
  formatDate,
  formatDateTime,
  getRelativeTime,
  isToday,
  isYesterday,
  isThisWeek,
  getDaysBetween,
  addDays,
  subtractDays,
  getStartOfDay,
  getEndOfDay,
  formatForAPI,
  parseFromAPI,
  getCurrentDate,
  getCurrentDateString,
  isValidDate,
  getAge,
  getBusinessDaysBetween,
  formatDateRange,
  getTimeZone,
  utcToLocal,
  localToUtc
} = DateHelpers;

export default DateHelpers;
