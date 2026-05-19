import React from 'react';
import './Skeleton.css';

export default function Skeleton({ width, height, variant = 'text', type = 'custom', count = 1, className = '' }) {
  const renderSkeleton = (index) => {
    // Predefined types for common layouts
    if (type === 'product-card') {
      return (
        <div key={index} className={`skeleton-product-card ${className}`}>
          <div className="skeleton-base skeleton-rectangular" style={{ height: '240px', width: '100%' }} />
          <div className="skeleton-info" style={{ padding: '15px' }}>
            <div className="skeleton-base skeleton-text" style={{ width: '80%', height: '1.2rem' }} />
            <div className="skeleton-base skeleton-text" style={{ width: '40%', height: '1rem' }} />
            <div className="skeleton-base skeleton-text" style={{ width: '60%', height: '1.5rem', marginTop: '10px' }} />
          </div>
        </div>
      );
    }

    const style = {
      width: width || '100%',
      height: height || (variant === 'text' ? '1.2rem' : '100%'),
    };

    return (
      <div 
        key={index}
        className={`skeleton-base skeleton-${variant} ${className}`} 
        style={style}
        aria-hidden="true"
      />
    );
  };

  if (count > 1) {
    return <>{Array.from({ length: count }).map((_, i) => renderSkeleton(i))}</>;
  }

  return renderSkeleton(0);
}

