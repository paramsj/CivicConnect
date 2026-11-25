// utils/csvToJson.js - Utility to convert your CSV files
export const csvToJson = (csvText, hasHeader = true) => {
  const lines = csvText.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) return [];
  
  const headers = hasHeader ? lines[0].split(',') : null;
  const startIndex = hasHeader ? 1 : 0;
  
  return lines.slice(startIndex).map((line, index) => {
    const values = line.split(',');
    if (!hasHeader) {
      return values;
    }
    
    const obj = {};
    headers.forEach((header, i) => {
      // Clean header and value
      const cleanHeader = header.trim().replace(/"/g, '');
      const cleanValue = values[i] ? values[i].trim().replace(/"/g, '') : '';
      
      // Convert numeric values
      if (cleanHeader === 'civic_score' || cleanHeader === 'Latitude' || cleanHeader === 'Longitude') {
        obj[cleanHeader] = parseFloat(cleanValue) || 0;
      } else {
        obj[cleanHeader] = cleanValue;
      }
    });
    
    return obj;
  });
};

// Usage example:
// import { csvToJson } from './utils/csvToJson';
// const complaintsData = csvToJson(complaintsCSVText);
// const usersData = csvToJson(usersCSVText);
