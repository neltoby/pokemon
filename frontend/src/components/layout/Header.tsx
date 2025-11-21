import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur sticky top-0 z-20">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-bold">
            P
          </span>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">
              PokéDex Favorites
            </h1>
            <p className="text-xs text-slate-400">
              Browse, inspect & favorite the first 150 Pokémon
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
