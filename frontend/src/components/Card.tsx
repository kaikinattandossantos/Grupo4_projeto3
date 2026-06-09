import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-bg-card rounded-2xl shadow-xl border border-text-light/20 p-6 md:p-8 max-w-full ${className}`}>
      {children}
    </div>
  );
};
