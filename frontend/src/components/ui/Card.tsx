import React from 'react';

interface CardProps {
  className?: string;
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ className = '', children }) => (
  <div className={`rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl shadow-black/40 ${className}`}>
    {children}
  </div>
);

export const CardBody: React.FC<CardProps> = ({ className = '', children }) => (
  <div className={`p-3 ${className}`}>{children}</div>
);

