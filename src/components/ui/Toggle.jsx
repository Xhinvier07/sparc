import React from 'react';
import PropTypes from 'prop-types';

const Toggle = ({
  options = [],
  value,
  onChange,
  className = '',
  ...props
}) => {
  return (
    <div 
      className={`inline-flex p-1.5 rounded-xl bg-gray-100 shadow-inner ${className}`}
      {...props}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={`relative py-2.5 px-5 rounded-lg transition-all duration-300 flex items-center ${
            value === option.value
              ? 'bg-primary text-white shadow-md transform hover:translate-y-[-1px]'
              : 'bg-transparent text-gray-700 hover:bg-gray-200'
          }`}
        >
          {value === option.value && (
            <span className="absolute inset-0 rounded-lg bg-primary opacity-10 animate-pulse"></span>
          )}
          {option.icon && (
            <span className={`mr-2 text-lg ${value === option.value ? 'text-accent' : ''}`}>
              {option.icon}
            </span>
          )}
          <span className="font-medium">{option.label}</span>
        </button>
      ))}
    </div>
  );
};

Toggle.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
      icon: PropTypes.node,
    })
  ).isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Toggle; 