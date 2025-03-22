// library-inventory-system\src\components\LoadingSpinner.tsx

import { useEffect, useState } from 'react';

const LoadingSpinner = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="relative">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full h-24 w-24 border-t-4 border-b-4 border-purple-600 animate-spin"></div>
        
        {/* Middle ring - spins in opposite direction */}
        <div className="absolute inset-0 rounded-full h-20 w-20 m-2 border-l-4 border-r-4 border-pink-500 animate-[spin_1s_linear_infinite_reverse]"></div>
        
        {/* Inner ring */}
        <div className="absolute inset-0 rounded-full h-16 w-16 m-4 border-t-4 border-b-4 border-blue-500 animate-spin"></div>
        
        {/* Center pulsing circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full animate-pulse shadow-lg shadow-indigo-500/50"></div>
        </div>
        
        {/* Orbiting dots */}
        <div className="absolute inset-0" style={{ transform: `rotate(${rotation}deg)` }}>
          <div className="absolute h-3 w-3 bg-yellow-400 rounded-full top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-md"></div>
          <div className="absolute h-3 w-3 bg-green-400 rounded-full bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 shadow-md"></div>
          <div className="absolute h-3 w-3 bg-red-400 rounded-full left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 shadow-md"></div>
          <div className="absolute h-3 w-3 bg-blue-400 rounded-full right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 shadow-md"></div>
        </div>
        
        {/* Invisible spacer to maintain size */}
        <div className="h-24 w-24 opacity-0"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
