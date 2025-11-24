import React from 'react';

export const ScrollFades: React.FC<{ showTop: boolean; showBottom: boolean }> = ({ showTop, showBottom }) => (
  <>
    {showTop && (
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-slate-950/90 to-transparent rounded-t-xl" />
    )}
    {showBottom && (
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-950/90 to-transparent rounded-b-xl" />
    )}
  </>
);

