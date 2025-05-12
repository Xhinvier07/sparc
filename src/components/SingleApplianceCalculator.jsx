import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaBolt, FaClock, FaCalendarAlt, FaDollarSign, FaInfoCircle } from 'react-icons/fa';

import Card from './ui/Card';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

import { 
  fetchApplianceData, 
  getAllAppliances, 
  getDefaultElectricityRate,
  fetchElectricityRate
} from '../services/applianceService';
import { calculateEnergyConsumption, calculateCost } from '../utils/calculationUtils';

const SingleApplianceCalculator = () => {
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [applianceData, setApplianceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rateInfo, setRateInfo] = useState(null);
  const [showRateTooltip, setShowRateTooltip] = useState(false);
  
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      appliance: '',
      wattage: '',
      hoursPerDay: 8,
      daysPerWeek: 7,
      rate: '',
    }
  });
  
  const selectedAppliance = watch('appliance');
  
  // Fetch appliance data and electricity rate on component mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Fetch appliance data
        const data = await fetchApplianceData();
        setApplianceData(data);
        
        // Fetch electricity rate data
        const rateData = await fetchElectricityRate();
        setRateInfo(rateData);
        setValue('rate', rateData.rate);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [setValue]);
  
  // Format appliance data for the select dropdown
  const selectOptions = applianceData.map(category => ({
    category: category.category,
    options: category.appliances.map(appliance => ({
      value: appliance.name,
      label: appliance.name
    }))
  }));
  
  // Add custom option at the top
  const customOption = {
    category: 'Custom',
    options: [
      {
        value: 'custom',
        label: 'Custom Appliance'
      }
    ]
  };
  
  const finalSelectOptions = [customOption, ...selectOptions];
  
  // Update wattage when appliance selection changes
  useEffect(() => {
    const updateApplianceWattage = async () => {
      if (selectedAppliance && selectedAppliance !== 'custom') {
        const allAppliances = await getAllAppliances();
        const selected = allAppliances.find(app => app.name === selectedAppliance);
        
        if (selected) {
          setValue('wattage', selected.defaultWatts);
        }
      } else if (selectedAppliance === 'custom') {
        // Handle custom appliance selection
        setTimeout(() => {
          const customName = prompt('Enter custom appliance name:', 'Custom Appliance');
          if (customName) {
            setValue('appliance', customName);
            
            // Set a default wattage for custom appliances if not already set
            const currentWattage = watch('wattage');
            if (!currentWattage) {
              setValue('wattage', 100); // Default wattage for custom appliance
            }
          }
        }, 100);
      }
    };
    
    updateApplianceWattage();
  }, [selectedAppliance, setValue, watch]);
  
  const onSubmit = (data) => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      const consumption = calculateEnergyConsumption(
        parseFloat(data.wattage),
        parseFloat(data.hoursPerDay),
        parseFloat(data.daysPerWeek)
      );
      
      const cost = calculateCost(consumption, parseFloat(data.rate));
      
      setResults({
        appliance: data.appliance || 'Custom Appliance',
        wattage: parseFloat(data.wattage),
        hoursPerDay: parseFloat(data.hoursPerDay),
        daysPerWeek: parseFloat(data.daysPerWeek),
        rate: parseFloat(data.rate),
        consumption,
        cost
      });
      
      setIsCalculating(false);
    }, 800);
  };
  
  // Toggle rate tooltip visibility
  const toggleRateTooltip = () => {
    setShowRateTooltip(!showRateTooltip);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Calculator Form */}
      <Card title="Single Appliance Calculator">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Select
              label="Select Appliance"
              id="appliance"
              name="appliance"
              placeholder="Select an appliance"
              options={finalSelectOptions}
              groupByCategory={true}
              {...register('appliance')}
              onChange={(e) => setValue('appliance', e.target.value)}
              value={watch('appliance')}
            />
            
            {/* Show custom name input if it's a custom appliance */}
            {watch('appliance') && 
             !applianceData.flatMap(cat => cat.appliances).some(app => app.name === watch('appliance')) && 
             watch('appliance') !== 'custom' && (
              <div className="mt-4 p-3 bg-accent bg-opacity-10 rounded-lg">
                <p className="text-sm font-medium mb-2 text-primary">Custom Appliance Name</p>
                <Input
                  id="customName"
                  placeholder="Custom appliance name"
                  value={watch('appliance')}
                  onChange={(e) => setValue('appliance', e.target.value)}
                />
              </div>
            )}
            
            <Input
              label="Wattage"
              id="wattage"
              name="wattage"
              type="number"
              placeholder="Enter wattage"
              required
              endAdornment="W"
              {...register('wattage', { 
                required: 'Wattage is required',
                min: { value: 1, message: 'Wattage must be at least 1W' },
                max: { value: 10000, message: 'Wattage must be less than 10000W' }
              })}
              error={errors.wattage?.message}
              onChange={(e) => setValue('wattage', e.target.value)}
              value={watch('wattage')}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Hours Per Day"
                id="hoursPerDay"
                name="hoursPerDay"
                type="number"
                min={0.1}
                max={24}
                step={0.1}
                required
                endAdornment={<FaClock />}
                {...register('hoursPerDay', { 
                  required: 'Hours per day is required',
                  min: { value: 0.1, message: 'Minimum is 0.1 hours' },
                  max: { value: 24, message: 'Maximum is 24 hours' }
                })}
                error={errors.hoursPerDay?.message}
                onChange={(e) => setValue('hoursPerDay', e.target.value)}
                value={watch('hoursPerDay')}
              />
              
              <Input
                label="Days Per Week"
                id="daysPerWeek"
                name="daysPerWeek"
                type="number"
                min={1}
                max={7}
                step={1}
                required
                endAdornment={<FaCalendarAlt />}
                {...register('daysPerWeek', { 
                  required: 'Days per week is required',
                  min: { value: 1, message: 'Minimum is 1 day' },
                  max: { value: 7, message: 'Maximum is 7 days' }
                })}
                error={errors.daysPerWeek?.message}
                onChange={(e) => setValue('daysPerWeek', e.target.value)}
                value={watch('daysPerWeek')}
              />
            </div>
            
            <div className="relative">
              <Input
                label={
                  <div className="flex items-center">
                    <span>Electricity Rate</span>
                    <button 
                      type="button"
                      className="ml-2 text-primary hover:text-secondary focus:outline-none transition-colors"
                      onClick={toggleRateTooltip}
                      aria-label="Show electricity rate information"
                    >
                      <FaInfoCircle />
                    </button>
                  </div>
                }
                id="rate"
                name="rate"
                type="number"
                min={0.1}
                step={0.01}
                required
                endAdornment="₱/kWh"
                {...register('rate', { 
                  required: 'Electricity rate is required',
                  min: { value: 0.1, message: 'Rate must be at least 0.1' }
                })}
                error={errors.rate?.message}
                onChange={(e) => setValue('rate', e.target.value)}
                value={watch('rate')}
              />
              
              {/* Rate Information Tooltip */}
              {showRateTooltip && rateInfo && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4 z-10 border border-gray-200">
                  <div className="flex justify-between">
                    <h5 className="text-primary font-medium">Rate Information</h5>
                    <button 
                      type="button"
                      className="text-gray-400 hover:text-gray-600"
                      onClick={toggleRateTooltip}
                      aria-label="Close rate information"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="text-sm mt-2">
                    Electricity rate as of {rateInfo.month} {rateInfo.year}
                  </p>
                  {rateInfo.notes && (
                    <p className="text-xs mt-1 text-gray-600">{rateInfo.notes}</p>
                  )}
                </div>
              )}
            </div>
            
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full mt-4"
              disabled={isCalculating}
            >
              {isCalculating ? 'Calculating...' : 'Calculate'}
            </Button>
          </form>
        )}
      </Card>
      
      {/* Results Display */}
      <div>
        {results ? (
          <Card title="Energy Consumption Results">
            <div className="mb-6 bg-gray-50 p-4 rounded-lg">
              <h4 className="text-xl font-semibold mb-2 text-primary">
                {results.appliance} ({results.wattage}W)
              </h4>
              <p className="text-gray-600 flex items-center">
                <FaClock className="mr-2 text-secondary" />
                <span>Used {results.hoursPerDay} hours/day, {results.daysPerWeek} days/week</span>
              </p>
            </div>
            
            {/* Energy Consumption Section */}
            <div className="mb-8">
              <h5 className="font-medium flex items-center text-primary mb-3">
                <FaBolt className="mr-2" /> Energy Consumption
              </h5>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow transition-shadow">
                  <p className="text-sm text-gray-600 mb-1">Daily</p>
                  <p className="text-lg font-semibold text-primary">{results.consumption.daily} kWh</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow transition-shadow">
                  <p className="text-sm text-gray-600 mb-1">Weekly</p>
                  <p className="text-lg font-semibold text-primary">{results.consumption.weekly} kWh</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow transition-shadow">
                  <p className="text-sm text-gray-600 mb-1">Monthly</p>
                  <p className="text-lg font-semibold text-primary">{results.consumption.monthly} kWh</p>
                </div>
              </div>
            </div>
            
            {/* Cost Section */}
            <div>
              <h5 className="font-medium flex items-center text-primary mb-3">
                <FaDollarSign className="mr-2" /> Cost (₱{results.rate}/kWh)
              </h5>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-primary bg-opacity-10 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Daily</p>
                  <p className="text-xl font-semibold">₱{results.cost.daily}</p>
                </div>
                <div className="bg-primary bg-opacity-10 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Weekly</p>
                  <p className="text-xl font-semibold">₱{results.cost.weekly}</p>
                </div>
                <div className="bg-accent text-primary p-4 rounded-lg shadow-md transform hover:scale-105 transition-all">
                  <p className="text-sm font-medium mb-1">Monthly</p>
                  <p className="text-2xl font-bold">₱{results.cost.monthly}</p>
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl text-gray-300 mb-4">
                <FaBolt />
              </div>
              <h3 className="text-xl text-gray-400 mb-2">No Data Yet</h3>
              <p className="text-center text-gray-500">
                Fill out the form and click "Calculate" to see the energy consumption and cost.
              </p>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SingleApplianceCalculator; 