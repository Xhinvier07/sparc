import React, { useState } from 'react';
import { FaBolt, FaLayerGroup, FaChartLine } from 'react-icons/fa';

import Toggle from './ui/Toggle';
import SingleApplianceCalculator from './SingleApplianceCalculator';
import MultipleApplianceCalculator from './MultipleApplianceCalculator';

const Calculator = () => {
  const [mode, setMode] = useState('single');
  
  const toggleOptions = [
    {
      label: 'Single Appliance',
      value: 'single',
      icon: <FaBolt />,
    },
    {
      label: 'Multiple Appliances',
      value: 'multiple',
      icon: <FaLayerGroup />,
    },
  ];
  
  return (
    <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-block p-2 px-5 bg-primary bg-opacity-10 rounded-full text-primary text-sm font-medium mb-4 shadow-sm">
            <FaChartLine className="inline mr-2" />
            Estimate Energy Calculations
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Electricity Bill Calculator
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Calculate how much your appliances cost to run. Track your energy usage and save money
            by understanding which appliances consume the most power.
          </p>
        </div>
        
        <div className="flex justify-center mb-10">
          <div className="bg-white shadow-xl rounded-2xl p-2 inline-block">
            <Toggle 
              options={toggleOptions} 
              value={mode} 
              onChange={setMode}
            />
          </div>
        </div>
        
        <p className="text-center text-gray-600 mb-10 max-w-xl mx-auto">
          {mode === 'single' 
            ? 'Calculate the energy consumption of a single appliance to understand its impact on your electricity bill.' 
            : 'Calculate and compare the energy consumption of multiple appliances to see which ones are using the most electricity.'}
        </p>
        
        {/* Content based on mode */}
        <div className="transition-all duration-500 transform">
          {mode === 'single' ? (
            <SingleApplianceCalculator />
          ) : (
            <MultipleApplianceCalculator />
          )}
        </div>
      </div>
    </div>
  );
};

export default Calculator; 