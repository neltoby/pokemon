import React from 'react';

export const ScrollHint: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-3">
      <div className="flex items-center gap-2 rounded-full bg-slate-900/80 border border-slate-800 px-3 py-1 text-[11px] text-slate-300 shadow-md">
        <span className="inline-block h-3 w-3 animate-bounce [animation-duration:1.2s]">⬇️</span>
        <span>Scroll to browse more</span>
      </div>
    </div>
  );
};

