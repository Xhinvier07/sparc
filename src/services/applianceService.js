import { GOOGLE_SHEETS_CONFIG } from './googleSheetsConfig';

// Fallback data in case the API is not available
const FALLBACK_DATA = [
  {
    category: "Cooling",
    appliances: [
      { name: "Air Conditioner", minWatts: 1000, maxWatts: 2500, defaultWatts: 1500 },
      { name: "Electric Fan: Desk", minWatts: 25, maxWatts: 35, defaultWatts: 30 },
    ]
  },
  {
    category: "Kitchen",
    appliances: [
      { name: "Refrigerator", minWatts: 150, maxWatts: 400, defaultWatts: 300 },
      { name: "Microwave Oven", minWatts: 600, maxWatts: 1200, defaultWatts: 1000 },
    ]
  }
];

// Fallback rate data
const FALLBACK_RATE = {
  rate: 13.01,
  month: 'March',
  year: '2025',
  notes: 'Default Philippine electricity rate in ₱/kWh'
};

// Cache the data to avoid frequent API requests
let cachedApplianceData = null;
let cachedRateData = null;
let lastFetchTime = 0;
let lastRateFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Fetch data from Google Sheets API
 * @returns {Promise} Promise that resolves to the appliance data
 */
export const fetchApplianceData = async () => {
  // Return cached data if it's still valid
  const now = Date.now();
  if (cachedApplianceData && now - lastFetchTime < CACHE_DURATION) {
    return cachedApplianceData;
  }
  
  try {
    // If API URL is not set, return fallback data
    if (!GOOGLE_SHEETS_CONFIG.API_URL) {
      console.warn('Google Sheets API URL not configured. Using fallback data.');
      return FALLBACK_DATA;
    }
    
    // Fetch categories from Google Sheets
    const categoriesResponse = await fetch(
      `${GOOGLE_SHEETS_CONFIG.API_URL}?sheet=${GOOGLE_SHEETS_CONFIG.SHEETS.CATEGORIES}`
    );
    
    if (!categoriesResponse.ok) {
      throw new Error(`Failed to fetch categories: ${categoriesResponse.statusText}`);
    }
    
    const categories = await categoriesResponse.json();
    
    // Fetch appliances from Google Sheets
    const appliancesResponse = await fetch(
      `${GOOGLE_SHEETS_CONFIG.API_URL}?sheet=${GOOGLE_SHEETS_CONFIG.SHEETS.APPLIANCES}`
    );
    
    if (!appliancesResponse.ok) {
      throw new Error(`Failed to fetch appliances: ${appliancesResponse.statusText}`);
    }
    
    const appliances = await appliancesResponse.json();
    
    // Organize data by category
    const organizedData = categories.map(category => ({
      category: category.name,
      appliances: appliances
        .filter(appliance => appliance.category === category.name)
        .map(appliance => ({
          name: appliance.name,
          minWatts: parseInt(appliance.minWatts || 0, 10),
          maxWatts: parseInt(appliance.maxWatts || 0, 10),
          defaultWatts: parseInt(appliance.defaultWatts || 0, 10)
        }))
    }));
    
    // Update cache
    cachedApplianceData = organizedData;
    lastFetchTime = now;
    
    return organizedData;
  } catch (error) {
    console.error('Error fetching appliance data:', error);
    // Return fallback data if API request fails
    return FALLBACK_DATA;
  }
};

/**
 * Fetch electricity rate data from Google Sheets API
 * @returns {Promise} Promise that resolves to the latest electricity rate data
 */
export const fetchElectricityRate = async () => {
  // Return cached rate data if it's still valid
  const now = Date.now();
  if (cachedRateData && now - lastRateFetchTime < CACHE_DURATION) {
    return cachedRateData;
  }
  
  try {
    // If API URL is not set, return fallback rate
    if (!GOOGLE_SHEETS_CONFIG.API_URL) {
      console.warn('Google Sheets API URL not configured. Using fallback rate data.');
      return FALLBACK_RATE;
    }
    
    // Fetch rates from Google Sheets
    const ratesResponse = await fetch(
      `${GOOGLE_SHEETS_CONFIG.API_URL}?sheet=${GOOGLE_SHEETS_CONFIG.SHEETS.RATES}`
    );
    
    if (!ratesResponse.ok) {
      throw new Error(`Failed to fetch rates: ${ratesResponse.statusText}`);
    }
    
    const rates = await ratesResponse.json();
    
    // Get the latest rate (assuming rates are stored in chronological order with the latest at the end)
    const latestRate = rates.length > 0 ? rates[rates.length - 1] : FALLBACK_RATE;
    
    // Parse the rate value to ensure it's a number
    const rateData = {
      rate: parseFloat(latestRate.rate || FALLBACK_RATE.rate),
      month: latestRate.month || FALLBACK_RATE.month,
      year: latestRate.year || FALLBACK_RATE.year,
      notes: latestRate.notes || ''
    };
    
    // Update cache
    cachedRateData = rateData;
    lastRateFetchTime = now;
    
    return rateData;
  } catch (error) {
    console.error('Error fetching electricity rate data:', error);
    // Return fallback rate if API request fails
    return FALLBACK_RATE;
  }
};

/**
 * Get all appliances in a flat list
 * @returns {Promise} Promise that resolves to a flat list of appliances
 */
export const getAllAppliances = async () => {
  const data = await fetchApplianceData();
  return data.flatMap(category => 
    category.appliances.map(appliance => ({
      ...appliance,
      category: category.category
    }))
  );
};

/**
 * Get an appliance by name
 * @param {string} name - Name of the appliance
 * @returns {Promise} Promise that resolves to the appliance object
 */
export const getApplianceByName = async (name) => {
  const allAppliances = await getAllAppliances();
  return allAppliances.find(appliance => appliance.name === name);
};

/**
 * Helper function to get default electricity rate (Philippine rate in Peso/kWh)
 * @returns {Promise<number>} Default electricity rate
 */
export const getDefaultElectricityRate = async () => {
  const rateData = await fetchElectricityRate();
  return rateData.rate;
}; 