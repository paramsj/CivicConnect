// src/utils/exportUtils.js

// Export data to CSV format
export const exportToCSV = (data, filename, headers = null) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  // Get headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create CSV content
  const csvContent = [
    // Headers row
    csvHeaders.map(header => `"${header}"`).join(','),
    // Data rows
    ...data.map(row => 
      csvHeaders.map(header => {
        const value = row[header];
        // Handle null/undefined values and escape quotes
        return `"${value !== null && value !== undefined ? String(value).replace(/"/g, '""') : ''}"`;
      }).join(',')
    )
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export data to JSON format
export const exportToJSON = (data, filename) => {
  if (!data) {
    alert('No data to export');
    return;
  }

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Export data to Excel format (using CSV with .xlsx extension)
export const exportToExcel = (data, filename, headers = null) => {
  if (!data || data.length === 0) {
    alert('No data to export');
    return;
  }

  const csvHeaders = headers || Object.keys(data[0]);
  
  const csvContent = [
    csvHeaders.map(header => `"${header}"`).join(','),
    ...data.map(row => 
      csvHeaders.map(header => {
        const value = row[header];
        return `"${value !== null && value !== undefined ? String(value).replace(/"/g, '""') : ''}"`;
      }).join(',')
    )
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xlsx`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Format date for export
export const formatDateForExport = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Generate filename with timestamp
export const generateFilename = (prefix) => {
  const now = new Date();
  const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
  return `${prefix}_${timestamp}`;
}; 