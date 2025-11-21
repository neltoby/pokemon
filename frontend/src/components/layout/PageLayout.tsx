import React from 'react';

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({
  children
}) => (
  <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
      {children}
    </main>
  </div>
);
