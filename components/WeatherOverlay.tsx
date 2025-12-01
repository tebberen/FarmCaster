"use client";

import React, { useEffect, useState } from 'react';

const WeatherOverlay = () => {
  const [isNight, setIsNight] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const hour = new Date().getHours();
      // Night is roughly 6 PM to 6 AM
      setIsNight(hour >= 18 || hour < 6);
    };

    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

  // Generate random particles
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animationDuration: `${Math.random() * 10 + 10}s`,
    animationDelay: `${Math.random() * 5}s`,
  }));

  if (isNight) {
    // Fireflies
    return (
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-1.5 h-1.5 bg-yellow-400 rounded-full opacity-60 animate-pulse"
            style={{
              left: p.left,
              top: p.top,
              transition: 'all 10s ease-in-out',
              // Simple floating effect via transform is harder with just inline styles without custom keyframes,
              // but animate-pulse gives the glowing effect.
              // We can add a simple translate animation if we want.
              animation: `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite, float ${p.animationDuration} infinite linear`
            }}
          />
        ))}
        <style jsx>{`
          @keyframes float {
            0% { transform: translateY(0px) translateX(0px); }
            33% { transform: translateY(-20px) translateX(20px); }
            66% { transform: translateY(10px) translateX(-10px); }
            100% { transform: translateY(0px) translateX(0px); }
          }
        `}</style>
      </div>
    );
  }

  // Day - Pollen/Dust
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
       {particles.map((p) => (
          <div
            key={p.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{
              left: p.left,
              top: p.top,
              animation: `float ${p.animationDuration} infinite linear`
            }}
          />
        ))}
         <style jsx>{`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-50px); }
            100% { transform: translateY(0px); }
          }
        `}</style>
    </div>
  );
};

export default WeatherOverlay;
