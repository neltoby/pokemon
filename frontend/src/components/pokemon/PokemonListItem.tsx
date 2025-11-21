import React from 'react';
import type { PokemonSummary } from '../../api/pokemon-api';
import { FavoriteBadge } from './FavoriteBadge';
import { StarSolid, StarOutline } from '../icons/Star';

interface Props {
  pokemon: PokemonSummary;
  index: number;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: (id: number) => void;
  onToggleFavorite: (id: number, name: string) => void;
}

export const PokemonListItem: React.FC<Props> = React.memo(
  ({
    pokemon,
    isSelected,
    isFavorite,
    onSelect,
    onToggleFavorite
  }) => {
    const handleClick = () => onSelect(pokemon.id);
    const handleFavClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleFavorite(pokemon.id, pokemon.name);
    };

    return (
      <div
        onClick={handleClick}
        className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-colors ${
          isSelected
            ? 'bg-slate-800 border border-primary/70'
            : 'bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-xl bg-slate-800 flex items-center justify-center text-xs text-slate-300">
            #{String(pokemon.id).padStart(3, '0')}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium capitalize">
              {pokemon.name}
              <FavoriteBadge isFavorite={isFavorite} />
            </span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wide">
              Kanto
            </span>
          </div>
        </div>

        <button
          onClick={handleFavClick}
          className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-xs transition-colors ${
            isFavorite
              ? 'bg-amber-500/20 text-amber-300'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
          aria-label="Toggle favorite"
        >
          {isFavorite ? (
            <StarSolid className="h-4 w-4" />
          ) : (
            <StarOutline className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  }
);
