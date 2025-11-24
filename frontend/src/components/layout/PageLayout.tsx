import React from 'react';

export const PageLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
    <div className="absolute inset-0 -z-10">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[70vw] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/30 via-accent/20 to-transparent blur-3xl" />
    </div>
    <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
      {children}
    </main>
  </div>
);
