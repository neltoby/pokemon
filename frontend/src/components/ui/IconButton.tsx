import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const IconButton: React.FC<IconButtonProps> = ({ label, className = '', children, ...props }) => (
  <button
    aria-label={label}
    className={`inline-flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

