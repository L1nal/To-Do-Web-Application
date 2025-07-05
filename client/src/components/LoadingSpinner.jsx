import React from 'react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-4 h-4';
      case 'lg':
        return 'w-8 h-8';
      default:
        return 'w-6 h-6';
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <div className={`${getSizeClasses()} animate-spin rounded-full border-2 border-gray-300 border-t-blue-600`}></div>
      {text && <span className="text-sm text-gray-600">{text}</span>}
    </div>
  );
};

export default LoadingSpinner; 