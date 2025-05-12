import React, { useState } from 'react';
import Button from './ui/Button';
import heroImage from '../assets/hero.png';
import SparkEffect from './ui/SparkEffect';

const Hero = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div 
      className="bg-background relative overflow-hidden py-12 md:py-20"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Animated electricity background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className={`w-full h-full ${isHovering ? 'animate-electricity' : ''}`}>
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <filter id="electricity">
              <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" seed="1" />
              <feDisplacementMap in="SourceGraphic" scale="30" />
              <feGaussianBlur stdDeviation="2" />
              <feComponentTransfer>
                <feFuncR type="linear" slope="6" intercept="-1.5" />
                <feFuncG type="linear" slope="6" intercept="-1.5" />
                <feFuncB type="linear" slope="10" intercept="-1.5" />
              </feComponentTransfer>
            </filter>
            <rect width="100%" height="100%" filter="url(#electricity)" 
                  fill="transparent" 
                  stroke="#FFCC00" 
                  strokeWidth="1"
                  opacity={isHovering ? "0.3" : "0.1"} />
          </svg>
        </div>
        
        {/* Enhanced spark effect with more sparkles when hovering */}
        <SparkEffect active={true} count={isHovering ? 30 : 5} />
      </div>
      
      {/* Blue gradient overlay */}
      <div className="absolute inset-0 z-0 bg-primary opacity-5"></div>
      
      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-8 relative">
            <img src={heroImage} alt="SPARC Logo" className="h-32 md:h-40 w-auto relative z-10" />
            <div className="absolute inset-0 flex items-center justify-center">
              <SparkEffect active={true} count={20} />
            </div>
          </div>
          
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-6">
            Track Your Electricity Consumption & <span className="text-secondary">Save Money</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-700 mb-8">
            Calculate how much your appliances cost to run and identify ways to reduce your 
            electricity bill with our user-friendly calculator.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              variant="primary" 
              size="lg"
              onClick={() => {
                const calculatorElement = document.getElementById('calculator');
                if (calculatorElement) {
                  calculatorElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="relative overflow-hidden group"
            >
              <span className="relative z-10">Start Calculating</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
                <SparkEffect active={true} count={10} />
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="relative overflow-hidden group"
            >
              <span className="relative z-10">Learn Energy Saving Tips</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100">
                <SparkEffect active={true} count={8} />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 