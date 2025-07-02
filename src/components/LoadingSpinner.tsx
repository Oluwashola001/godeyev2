// Loading spinner component with cinematic styling
import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="relative w-full h-full">
        <div className="absolute inset-0 border-2 border-amber-500/20 rounded-full"></div>
        <div className="absolute inset-0 border-2 border-transparent border-t-amber-500 rounded-full animate-spin"></div>
        <div className="absolute inset-1 border border-transparent border-t-amber-400 rounded-full animate-spin animation-delay-150"></div>
      </div>
    </div>
  );
};

// Loading skeleton for movie cards
export const MovieCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-800/50 dark:bg-gray-900/50 rounded-xl overflow-hidden animate-pulse">
      <div className="aspect-[2/3] bg-gray-700/50 dark:bg-gray-800/50"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-700/50 dark:bg-gray-800/50 rounded w-3/4"></div>
        <div className="h-3 bg-gray-700/50 dark:bg-gray-800/50 rounded w-1/2"></div>
        <div className="h-3 bg-gray-700/50 dark:bg-gray-800/50 rounded w-full"></div>
        <div className="h-3 bg-gray-700/50 dark:bg-gray-800/50 rounded w-2/3"></div>
      </div>
    </div>
  );
};