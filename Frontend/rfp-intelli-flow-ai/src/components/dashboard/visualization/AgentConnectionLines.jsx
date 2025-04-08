import React, { useEffect, useRef } from 'react';

const AgentConnectionLines = ({ active, color }) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animationRef = useRef(null);
  
  // Initialize the particles
  useEffect(() => {
    if (!active || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const particleCount = 10;
    
    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Create particles
    particlesRef.current = Array(particleCount).fill().map(() => ({
      x: 0,
      y: canvas.height / 2,
      size: Math.random() * 3 + 1,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3
    }));
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw the base line
      ctx.beginPath();
      ctx.strokeStyle = `rgba(${color}, 0.2)`;
      ctx.lineWidth = 2;
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();
      
      // Update and draw particles
      particlesRef.current.forEach(particle => {
        // Update position
        particle.x += particle.speed;
        
        // Reset if off-screen
        if (particle.x > canvas.width) {
          particle.x = 0;
          particle.y = canvas.height / 2;
          particle.size = Math.random() * 3 + 1;
          particle.speed = Math.random() * 2 + 1;
          particle.opacity = Math.random() * 0.5 + 0.3;
        }
        
        // Draw particle
        ctx.beginPath();
        ctx.fillStyle = `rgba(${color}, ${particle.opacity})`;
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Clean up animation on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [active, color]);
  
  if (!active) return null;
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute left-0 w-full h-6" 
      style={{ top: 'calc(50% - 12px)' }}
    />
  );
};

export default AgentConnectionLines;