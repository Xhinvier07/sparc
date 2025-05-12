export const applianceData = [
  {
    category: "Cooling",
    appliances: [
      { name: "Air Conditioner", minWatts: 1000, maxWatts: 2500, defaultWatts: 1500 },
      { name: "Electric Fan: Desk", minWatts: 25, maxWatts: 35, defaultWatts: 30 },
      { name: "Electric Fan: Stand", minWatts: 50, maxWatts: 70, defaultWatts: 60 },
      { name: "Electric Fan: Wall", minWatts: 45, maxWatts: 60, defaultWatts: 55 },
      { name: "Ceiling Fan", minWatts: 60, maxWatts: 75, defaultWatts: 65 },
    ]
  },
  {
    category: "Kitchen",
    appliances: [
      { name: "Refrigerator", minWatts: 150, maxWatts: 400, defaultWatts: 300 },
      { name: "Microwave Oven", minWatts: 600, maxWatts: 1200, defaultWatts: 1000 },
      { name: "Rice Cooker", minWatts: 400, maxWatts: 700, defaultWatts: 500 },
      { name: "Electric Kettle", minWatts: 1000, maxWatts: 1500, defaultWatts: 1200 },
      { name: "Toaster", minWatts: 800, maxWatts: 1500, defaultWatts: 1000 },
    ]
  },
  {
    category: "Entertainment",
    appliances: [
      { name: "TV: LED", minWatts: 30, maxWatts: 100, defaultWatts: 60 },
      { name: "TV: LCD", minWatts: 125, maxWatts: 200, defaultWatts: 150 },
      { name: "Desktop Computer", minWatts: 150, maxWatts: 350, defaultWatts: 250 },
      { name: "Laptop", minWatts: 50, maxWatts: 100, defaultWatts: 65 },
      { name: "Gaming Console", minWatts: 150, maxWatts: 300, defaultWatts: 200 },
    ]
  },
  {
    category: "Lighting",
    appliances: [
      { name: "LED Bulb", minWatts: 5, maxWatts: 15, defaultWatts: 10 },
      { name: "CFL Bulb", minWatts: 13, maxWatts: 25, defaultWatts: 18 },
      { name: "Fluorescent Tube", minWatts: 15, maxWatts: 40, defaultWatts: 30 },
    ]
  },
  {
    category: "Others",
    appliances: [
      { name: "Washing Machine", minWatts: 500, maxWatts: 900, defaultWatts: 700 },
      { name: "Clothes Iron", minWatts: 1000, maxWatts: 2000, defaultWatts: 1200 },
      { name: "Water Pump", minWatts: 400, maxWatts: 750, defaultWatts: 550 },
      { name: "Electric Water Heater", minWatts: 1500, maxWatts: 4000, defaultWatts: 2500 },
    ]
  }
];

// Helper function to get all appliances in a flat list
export const getAllAppliances = () => {
  return applianceData.flatMap(category => 
    category.appliances.map(appliance => ({
      ...appliance,
      category: category.category
    }))
  );
};

// Helper function to get an appliance by name
export const getApplianceByName = (name) => {
  const allAppliances = getAllAppliances();
  return allAppliances.find(appliance => appliance.name === name);
};

// Helper function to get default electricity rate (Philippine rate in Peso/kWh)
export const getDefaultElectricityRate = () => {
  return 11; // Default Philippine electricity rate in ₱/kWh (example value)
}; 