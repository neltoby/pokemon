import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full sticky top-0 z-20">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/40 via-accent/20 to-transparent blur-xl opacity-50 pointer-events-none" />
        <div className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur relative">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-lg font-bold shadow-inner shadow-black/20">
                P
              </span>
              <div>
                <h1 className="text-lg font-semibold tracking-tight bg-gradient-to-r from-slate-100 to-slate-400 bg-clip-text text-transparent">
                  PokéDex Favorites
                </h1>
                <p className="text-xs text-slate-400">
                  Sleek, keyboard-friendly Kanto explorer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
