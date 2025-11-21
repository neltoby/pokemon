import React from 'react';

export const ErrorBanner: React.FC<{ message: string }> = ({ message }) => (
  <div className="rounded-xl border border-red-500/60 bg-red-500/10 px-3 py-2 text-sm text-red-300">
    {message}
  </div>
);
