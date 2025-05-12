import React, { useState, useEffect } from 'react';

const generateRandomPoints = (startX, startY, endX, endY, jitter) => {
  const points = [];
  
  // Start point
  points.push([startX, startY]);
  
  // Middle segments
  const segments = Math.floor(Math.random() * 3) + 2; // 2-4 segments
  const segmentLength = (endY - startY) / segments;
  
  for (let i = 1; i < segments; i++) {
    const y = startY + i * segmentLength;
    const xJitter = (Math.random() - 0.5) * 2 * jitter;
    points.push([startX + xJitter, y]);
  }
  
  // End point
  points.push([endX, endY]);
  
  return points;
};

const LightningBolt = ({ active, width, height, color = '#FFCC00' }) => {
  const [pathData, setPathData] = useState('');
  const [opacity, setOpacity] = useState(0);
  
  useEffect(() => {
    if (!active) {
      setOpacity(0);
      return;
    }
    
    const generateLightning = () => {
      // Randomize the start and end positions
      const startX = width * (0.3 + Math.random() * 0.4); // Middle area of the width
      const startY = 0;
      const endX = width * (0.3 + Math.random() * 0.4);
      const endY = height;
      
      const jitter = width * 0.3; // How jagged the lightning bolt is
      const points = generateRandomPoints(startX, startY, endX, endY, jitter);
      
      // Create SVG path
      let path = `M ${points[0][0]} ${points[0][1]}`;
      for (let i = 1; i < points.length; i++) {
        path += ` L ${points[i][0]} ${points[i][1]}`;
      }
      
      setPathData(path);
      setOpacity(0.8 + Math.random() * 0.2); // Random opacity for variation
      
      // Animate opacity to 0
      setTimeout(() => {
        setOpacity(0);
      }, 100);
    };
    
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance to generate lightning
        generateLightning();
      }
    }, 500);
    
    return () => clearInterval(interval);
  }, [active, width, height]);
  
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      
      {/* Glow effect */}
      <path 
        d={pathData} 
        stroke={color} 
        strokeWidth="8" 
        fill="none" 
        strokeOpacity={opacity * 0.5} 
        strokeLinecap="round"
        filter="url(#glow)"
      />
      
      {/* Main lightning bolt */}
      <path 
        d={pathData} 
        stroke="white" 
        strokeWidth="2" 
        fill="none" 
        strokeOpacity={opacity} 
        strokeLinecap="round"
      />
    </svg>
  );
};

const LightningEffect = ({ active = false }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <LightningBolt 
        active={active} 
        width={dimensions.width} 
        height={dimensions.height} 
      />
    </div>
  );
};

export default LightningEffect; 