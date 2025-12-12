import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  onClick,
  noPadding = false 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-[24px] shadow-sm hover:shadow-md transition-shadow duration-300 ${noPadding ? '' : 'p-5'} ${className}`}
    >
      {children}
    </div>
  );
};