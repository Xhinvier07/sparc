import React, { useState, useEffect } from 'react';

const SparkSVG = ({ style }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={style}
    className="absolute animate-spark pointer-events-none"
  >
    <path
      d="M12 0C12 0 13.2 6.2 16 9C18.8 11.8 24 12 24 12C24 12 18.8 12.2 16 15C13.2 17.8 12 24 12 24C12 24 10.8 17.8 8 15C5.2 12.2 0 12 0 12C0 12 5.2 11.8 8 9C10.8 6.2 12 0 12 0Z"
      fill="#FFCC00"
    />
  </svg>
);

// Use this component to create sparkle effects
const SparkEffect = ({ active = false, count = 30 }) => {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    if (!active) {
      setSparkles([]);
      return;
    }

    // Create new sparkles
    const generateSparkle = () => ({
      id: Math.random().toString(36).substring(2),
      createdAt: Date.now(),
      color: "#FFCC00",
      size: Math.random() * 15 + 10,
      style: {
        position: 'absolute',
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        zIndex: 2,
      },
    });

    const interval = setInterval(() => {
      // Add a new sparkle
      const sparkle = generateSparkle();
      
      // Clean up old sparkles and add the new one
      setSparkles(prevSparkles => {
        const now = Date.now();
        const filteredSparkles = prevSparkles.filter(
          s => now - s.createdAt < 600 // 600ms matches the animation duration
        );
        return [...filteredSparkles, sparkle];
      });
    }, 200); // Generate new sparkle every 200ms

    return () => clearInterval(interval);
  }, [active, count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {sparkles.map(sparkle => (
        <SparkSVG
          key={sparkle.id}
          style={{
            ...sparkle.style,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
          }}
        />
      ))}
    </div>
  );
};

export default SparkEffect; 