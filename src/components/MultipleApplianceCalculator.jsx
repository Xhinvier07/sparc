import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { FaBolt, FaPlus, FaTrash, FaChartPie, FaInfoCircle } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

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
import { calculateMultipleAppliances } from '../utils/calculationUtils';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const MultipleApplianceCalculator = () => {
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [applianceData, setApplianceData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [rateInfo, setRateInfo] = useState(null);
  const [showRateTooltip, setShowRateTooltip] = useState(false);
  
  const { control, register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      appliances: [
        { 
          name: '', 
          wattage: '',
          hoursPerDay: 8,
          daysPerWeek: 7
        }
      ],
      rate: '',
    }
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'appliances'
  });
  
  // Fetch appliance data on component mount
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
  const getSelectOptions = () => {
    // Add custom option at the top
    const options = [
      {
        category: 'Custom',
        options: [
          {
            value: 'custom',
            label: 'Custom Appliance'
          }
        ]
      }
    ];
    
    // Add categorized appliances
    applianceData.forEach(category => {
      options.push({
        category: category.category,
        options: category.appliances.map(appliance => ({
          value: appliance.name,
          label: appliance.name
        }))
      });
    });
    
    return options;
  };
  
  const handleApplianceChange = async (index, value) => {
    setValue(`appliances.${index}.name`, value);
    
    // If custom option is selected, allow user to enter custom name
    if (value === 'custom') {
      setTimeout(() => {
        const customName = prompt('Enter custom appliance name:', 'Custom Appliance');
        if (customName) {
          setValue(`appliances.${index}.name`, customName);
          
          // Set a default wattage for custom appliances if not already set
          const currentWattage = watch(`appliances.${index}.wattage`);
          if (!currentWattage) {
            setValue(`appliances.${index}.wattage`, 100); // Default wattage for custom appliance
          }
        }
      }, 100);
      return;
    }
    
    // For regular appliances, set the wattage
    const allAppliances = await getAllAppliances();
    const selected = allAppliances.find(app => app.name === value);
    
    if (selected) {
      setValue(`appliances.${index}.wattage`, selected.defaultWatts);
    }
  };
  
  const onSubmit = (data) => {
    if (data.appliances.length === 0) {
      return;
    }
    
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      const appliancesList = data.appliances.map(appliance => ({
        name: appliance.name || 'Custom Appliance',
        wattage: parseFloat(appliance.wattage),
        hoursPerDay: parseFloat(appliance.hoursPerDay),
        daysPerWeek: parseFloat(appliance.daysPerWeek)
      }));
      
      const calculationResults = calculateMultipleAppliances(appliancesList, parseFloat(data.rate));
      
      setResults({
        ...calculationResults,
        rate: parseFloat(data.rate)
      });
      
      setIsCalculating(false);
    }, 800);
  };
  
  // Toggle rate tooltip visibility
  const toggleRateTooltip = () => {
    setShowRateTooltip(!showRateTooltip);
  };
  
  // Prepare chart data if results are available
  const getChartData = () => {
    if (!results) return null;
    
    const colors = [
      '#0033A0', // primary
      '#007BFF', // secondary
      '#FFCC00', // accent
      '#28A745', // success
      '#FFC107', // warning
      '#6610f2', // purple
      '#fd7e14', // orange
      '#20c997', // teal
      '#e83e8c', // pink
      '#6c757d', // gray
    ];
    
    return {
      labels: results.appliances.map(a => a.name),
      datasets: [
        {
          data: results.appliances.map(a => a.consumption.monthly),
          backgroundColor: results.appliances.map((_, index) => colors[index % colors.length]),
          borderWidth: 1,
        },
      ],
    };
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} kWh (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="space-y-8">
      {/* Calculator Form */}
      <Card title="Multiple Appliance Calculator">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {fields.map((field, index) => (
              <div key={field.id} className="mb-6 p-4 border border-gray-200 rounded bg-gray-50">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-primary font-medium">Appliance {index + 1}</h4>
                  {fields.length > 1 && (
                    <Button 
                      variant="text"
                      size="sm"
                      onClick={() => remove(index)}
                      className="text-red-500"
                    >
                      <FaTrash className="mr-1" /> Remove
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Select
                    label="Select Appliance"
                    id={`appliance-${index}`}
                    name={`appliances.${index}.name`}
                    placeholder="Select an appliance"
                    options={getSelectOptions()}
                    groupByCategory={true}
                    {...register(`appliances.${index}.name`)}
                    onChange={(e) => handleApplianceChange(index, e.target.value)}
                    value={watch(`appliances.${index}.name`)}
                  />
                  
                  <Input
                    label="Wattage"
                    id={`wattage-${index}`}
                    name={`appliances.${index}.wattage`}
                    type="number"
                    placeholder="Enter wattage"
                    required
                    endAdornment="W"
                    {...register(`appliances.${index}.wattage`, { 
                      required: 'Wattage is required',
                      min: { value: 1, message: 'Wattage must be at least 1W' }
                    })}
                    error={errors.appliances?.[index]?.wattage?.message}
                    onChange={(e) => setValue(`appliances.${index}.wattage`, e.target.value)}
                    value={watch(`appliances.${index}.wattage`)}
                  />
                </div>
                
                {/* Show custom name input if it's a custom appliance */}
                {watch(`appliances.${index}.name`) && 
                 !applianceData.flatMap(cat => cat.appliances).some(app => app.name === watch(`appliances.${index}.name`)) && 
                 watch(`appliances.${index}.name`) !== 'custom' && (
                  <div className="mt-4 p-3 bg-accent bg-opacity-10 rounded-lg">
                    <p className="text-sm font-medium mb-2 text-primary">Custom Appliance Name</p>
                    <Input
                      id={`customName-${index}`}
                      placeholder="Custom appliance name"
                      value={watch(`appliances.${index}.name`)}
                      onChange={(e) => setValue(`appliances.${index}.name`, e.target.value)}
                    />
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Hours Per Day"
                    id={`hoursPerDay-${index}`}
                    name={`appliances.${index}.hoursPerDay`}
                    type="number"
                    min={0.1}
                    max={24}
                    step={0.1}
                    required
                    {...register(`appliances.${index}.hoursPerDay`, { 
                      required: 'Hours per day is required',
                      min: { value: 0.1, message: 'Minimum is 0.1 hours' },
                      max: { value: 24, message: 'Maximum is 24 hours' }
                    })}
                    error={errors.appliances?.[index]?.hoursPerDay?.message}
                    onChange={(e) => setValue(`appliances.${index}.hoursPerDay`, e.target.value)}
                    value={watch(`appliances.${index}.hoursPerDay`)}
                  />
                  
                  <Input
                    label="Days Per Week"
                    id={`daysPerWeek-${index}`}
                    name={`appliances.${index}.daysPerWeek`}
                    type="number"
                    min={1}
                    max={7}
                    step={1}
                    required
                    {...register(`appliances.${index}.daysPerWeek`, { 
                      required: 'Days per week is required',
                      min: { value: 1, message: 'Minimum is 1 day' },
                      max: { value: 7, message: 'Maximum is 7 days' }
                    })}
                    error={errors.appliances?.[index]?.daysPerWeek?.message}
                    onChange={(e) => setValue(`appliances.${index}.daysPerWeek`, e.target.value)}
                    value={watch(`appliances.${index}.daysPerWeek`)}
                  />
                </div>
              </div>
            ))}
            
            <Button 
              type="button" 
              variant="outline" 
              className="mb-4 w-full"
              onClick={() => append({ name: '', wattage: '', hoursPerDay: 8, daysPerWeek: 7 })}
            >
              <FaPlus className="mr-2" /> Add Another Appliance
            </Button>
            
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
      {results && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Totals Card */}
          <Card title="Total Energy Consumption" variant="primary">
            <div className="text-center mb-8">
              <div className="text-3xl font-bold mb-2">
                {results.totalConsumption.monthly} kWh / month
              </div>
              <div className="text-2xl flex items-center justify-center">
                <div className="mr-1" />
                <span>₱{results.totalCost.monthly} / month</span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white bg-opacity-20 p-4 rounded-lg shadow-inner hover:bg-opacity-30 transition-all">
                <p className="text-sm mb-1">Daily</p>
                <p className="font-semibold text-lg mb-1">{results.totalConsumption.daily} kWh</p>
                <p className="text-sm bg-white bg-opacity-20 rounded-full py-1 px-2 inline-block">₱{results.totalCost.daily}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-4 rounded-lg shadow-inner hover:bg-opacity-30 transition-all">
                <p className="text-sm mb-1">Weekly</p>
                <p className="font-semibold text-lg mb-1">{results.totalConsumption.weekly} kWh</p>
                <p className="text-sm bg-white bg-opacity-20 rounded-full py-1 px-2 inline-block">₱{results.totalCost.weekly}</p>
              </div>
              <div className="bg-accent text-primary p-4 rounded-lg shadow-lg transform hover:scale-105 transition-all">
                <p className="text-sm font-medium mb-1">Monthly</p>
                <p className="font-bold text-lg mb-1">{results.totalConsumption.monthly} kWh</p>
                <p className="text-sm bg-primary bg-opacity-20 rounded-full py-1 px-3 inline-block font-medium">₱{results.totalCost.monthly}</p>
              </div>
            </div>
          </Card>
          
          {/* Chart Card */}
          <Card title="Consumption Breakdown" className="hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-center h-72">
              {getChartData() && (
                <Pie data={getChartData()} options={chartOptions} />
              )}
            </div>
          </Card>
          
          {/* Appliance Breakdown Table */}
          <Card title="Appliance Breakdown" className="col-span-1 md:col-span-2">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border-b border-gray-200 font-semibold">Appliance</th>
                    <th className="p-3 border-b border-gray-200 text-right font-semibold">Wattage</th>
                    <th className="p-3 border-b border-gray-200 text-right font-semibold">Monthly kWh</th>
                    <th className="p-3 border-b border-gray-200 text-right font-semibold">Monthly Cost</th>
                    <th className="p-3 border-b border-gray-200 text-right font-semibold">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {results.appliances.map((appliance, index) => {
                    const percentOfTotal = ((appliance.consumption.monthly / results.totalConsumption.monthly) * 100).toFixed(1);
                    
                    return (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-medium">{appliance.name}</td>
                        <td className="p-3 text-right">{appliance.wattage}W</td>
                        <td className="p-3 text-right font-medium">{appliance.consumption.monthly}</td>
                        <td className="p-3 text-right font-medium text-primary">₱{appliance.cost.monthly}</td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end">
                            <div 
                              className="w-24 h-4 rounded-full bg-gray-200 mr-2 overflow-hidden shadow-inner"
                              title={`${percentOfTotal}% of total consumption`}
                            >
                              <div 
                                className="h-full rounded-full" 
                                style={{ 
                                  width: `${percentOfTotal}%`,
                                  backgroundColor: getChartData().datasets[0].backgroundColor[index]
                                }}
                              />
                            </div>
                            <span className="font-medium">{percentOfTotal}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MultipleApplianceCalculator; 