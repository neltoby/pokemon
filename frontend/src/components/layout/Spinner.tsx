import React from 'react';

export const Spinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({
  size = 'md'
}) => {
  const sizes: Record<string, string> = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-2 border-slate-500 border-t-primary ${sizes[size]}`}
    />
  );
};
