/**
 * SPARC - Google Sheets Database
 * This script creates a simple API that returns appliance data from Google Sheets.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet at https://sheets.google.com/
 * 2. Create three sheets: "categories", "appliances", and "rates"
 * 3. In the "categories" sheet, add a header row with "name"
 * 4. In the "appliances" sheet, add a header row with "name", "category", "minWatts", "maxWatts", "defaultWatts"
 * 5. In the "rates" sheet, add a header row with "rate", "month", "year", "notes"
 * 6. Click on Extensions > Apps Script in the Google Sheets menu
 * 7. Paste this entire code into the Apps Script editor
 * 8. Save the project (give it a name like "SPARC Database")
 * 9. Click Deploy > New deployment
 * 10. Select type "Web app"
 * 11. Set "Who has access" to "Anyone"
 * 12. Click Deploy
 * 13. Copy the Web app URL and paste it into your googleSheetsConfig.js file
 */

// Global variables
const SHEET_NAMES = {
  CATEGORIES: 'categories',
  APPLIANCES: 'appliances',
  RATES: 'rates'
};

/**
 * Serves HTML content for the root URL
 */
function doGet(e) {
  // Get the requested sheet name from the URL parameter
  const sheetName = e.parameter.sheet;
  
  // Check if a valid sheet name was provided
  if (!sheetName || !SHEET_NAMES[sheetName.toUpperCase()]) {
    return ContentService.createTextOutput(JSON.stringify({
      error: 'Invalid sheet name. Use "appliances", "categories", or "rates".'
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
  
  // Get the data from the requested sheet
  const data = getSheetData(SHEET_NAMES[sheetName.toUpperCase()]);
  
  // Return the data as JSON
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Gets data from a sheet and returns it as an array of objects
 * @param {string} sheetName - Name of the sheet to get data from
 * @return {Array} Array of objects with column headers as keys
 */
function getSheetData(sheetName) {
  try {
    // Get the active spreadsheet
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      return [];
    }
    
    // Get all data from the sheet
    const data = sheet.getDataRange().getValues();
    
    // Get the headers (first row)
    const headers = data[0];
    
    // Convert the data to an array of objects
    const result = [];
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const record = {};
      
      // Add each column to the record
      for (let j = 0; j < headers.length; j++) {
        record[headers[j]] = row[j];
      }
      
      result.push(record);
    }
    
    return result;
  } catch (error) {
    Logger.log('Error getting sheet data: ' + error.message);
    return [];
  }
}

/**
 * Handles POST requests for updating data
 * This can be extended to allow adding/editing appliances
 */
function doPost(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'error',
    message: 'POST requests are not yet implemented.'
  }))
  .setMimeType(ContentService.MimeType.JSON);
} 