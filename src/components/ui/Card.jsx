import React from 'react';
import PropTypes from 'prop-types';

const Card = ({
  title,
  children,
  variant = 'default',
  className = '',
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    default: 'bg-white',
    primary: 'bg-primary text-white',
    secondary: 'bg-secondary text-white',
    success: 'bg-success text-white',
    warning: 'bg-warning text-primary',
    accent: 'bg-accent text-primary',
  };
  
  return (
    <div 
      className={`rounded shadow p-6 ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {title && (
        <div className="border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold">{title}</h3>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
};

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'primary', 'secondary', 'success', 'warning', 'accent']),
  className: PropTypes.string,
};

export default Card; 