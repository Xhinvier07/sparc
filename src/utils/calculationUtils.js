/**
 * Calculate energy consumption in kilowatt-hours (kWh)
 * 
 * @param {number} wattage - The wattage of the appliance in watts
 * @param {number} hoursPerDay - Hours of usage per day
 * @param {number} daysPerWeek - Days of usage per week
 * @returns {Object} Energy consumption in kWh (daily, weekly, monthly)
 */
export const calculateEnergyConsumption = (wattage, hoursPerDay, daysPerWeek) => {
  // Convert watts to kilowatts
  const kilowatts = wattage / 1000;
  
  // Calculate daily consumption (kWh)
  const dailyConsumption = kilowatts * hoursPerDay;
  
  // Calculate weekly consumption (kWh)
  const weeklyConsumption = dailyConsumption * daysPerWeek;
  
  // Calculate monthly consumption (kWh) - assuming 4.33 weeks per month
  const monthlyConsumption = weeklyConsumption * 4.33;
  
  return {
    daily: parseFloat(dailyConsumption.toFixed(2)),
    weekly: parseFloat(weeklyConsumption.toFixed(2)),
    monthly: parseFloat(monthlyConsumption.toFixed(2)),
  };
};

/**
 * Calculate cost based on energy consumption and electricity rate
 * 
 * @param {Object} consumption - Energy consumption object with daily, weekly, and monthly values
 * @param {number} rate - Electricity rate in currency per kWh
 * @returns {Object} Cost breakdown (daily, weekly, monthly)
 */
export const calculateCost = (consumption, rate) => {
  return {
    daily: parseFloat((consumption.daily * rate).toFixed(2)),
    weekly: parseFloat((consumption.weekly * rate).toFixed(2)),
    monthly: parseFloat((consumption.monthly * rate).toFixed(2)),
  };
};

/**
 * Calculate total energy consumption and cost for multiple appliances
 * 
 * @param {Array} appliancesList - List of appliances with their usage data
 * @param {number} rate - Electricity rate in currency per kWh
 * @returns {Object} Combined results with total consumption and costs
 */
export const calculateMultipleAppliances = (appliancesList, rate) => {
  const results = appliancesList.map(appliance => {
    const consumption = calculateEnergyConsumption(
      appliance.wattage,
      appliance.hoursPerDay,
      appliance.daysPerWeek
    );
    
    const cost = calculateCost(consumption, rate);
    
    return {
      name: appliance.name,
      wattage: appliance.wattage,
      consumption,
      cost,
    };
  });
  
  // Calculate totals
  const totalConsumption = {
    daily: parseFloat(results.reduce((sum, item) => sum + item.consumption.daily, 0).toFixed(2)),
    weekly: parseFloat(results.reduce((sum, item) => sum + item.consumption.weekly, 0).toFixed(2)),
    monthly: parseFloat(results.reduce((sum, item) => sum + item.consumption.monthly, 0).toFixed(2)),
  };
  
  const totalCost = {
    daily: parseFloat(results.reduce((sum, item) => sum + item.cost.daily, 0).toFixed(2)),
    weekly: parseFloat(results.reduce((sum, item) => sum + item.cost.weekly, 0).toFixed(2)),
    monthly: parseFloat(results.reduce((sum, item) => sum + item.cost.monthly, 0).toFixed(2)),
  };
  
  return {
    appliances: results,
    totalConsumption,
    totalCost,
  };
}; 