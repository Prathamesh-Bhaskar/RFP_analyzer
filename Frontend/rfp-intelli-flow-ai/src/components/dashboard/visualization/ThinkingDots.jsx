import React, { useState, useEffect } from 'react';

const ThinkingDots = ({ isActive = false, color = "text-blue-500" }) => {
  const [dots, setDots] = useState(".");
  
  useEffect(() => {
    if (!isActive) return;
    
    const interval = setInterval(() => {
      setDots(prevDots => {
        if (prevDots.length >= 3) return ".";
        return prevDots + ".";
      });
    }, 400);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  if (!isActive) return null;
  
  return (
    <span className={`inline-block min-w-6 ${color}`}>
      {dots}
    </span>
  );
};

export default ThinkingDots;