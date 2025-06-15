'use client'

import React from 'react';

const Shimmer = ({ 
  width = '100%', 
  height = '20px', 
  className = '', 
  borderRadius = '6px',
  gradientColors = ['#f6f7f8', '#e8eaed', '#f6f7f8'],
  animationDuration = '1.8s',
  spacing = '8px'
}) => {
  return (
    <div
      className={`shimmer ${className}`}
      style={{
        width,
        height,
        background: `linear-gradient(90deg, ${gradientColors[0]} 20%, ${gradientColors[1]} 50%, ${gradientColors[2]} 80%)`,
        backgroundSize: '300% 100%',
        animation: `shimmer ${animationDuration} cubic-bezier(0.4, 0, 0.6, 1) infinite`,
        borderRadius,
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        margin: spacing,
      }}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -300% 0;
          }
          100% {
            background-position: 300% 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Shimmer;