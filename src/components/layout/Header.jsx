import React from 'react';
import logo from '../../assets/logo.png';

const Header = () => {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="SPARC Logo" className="h-14 w-auto" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">SPARC</h1>
              <p className="text-xs md:text-sm text-gray-200">Savings and Power Analysis Reporting Calculator</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm md:text-base italic">Smart Energy Tracking Made Simple</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 