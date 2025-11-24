import React from 'react';
import type { PokemonSummary } from '../../api/pokemon-api';
import { PokemonImg } from './PokemonImg';
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
        className={`group flex items-center justify-between px-3 py-2 rounded-2xl cursor-pointer transition-all outline-none ${
          isSelected
            ? 'bg-slate-800/80 border border-primary/40 shadow-[0_0_0_2px_rgba(59,130,246,0.25)] backdrop-blur'
            : 'bg-slate-900/60 hover:bg-slate-800/70 border border-slate-800 hover:shadow-[0_4px_16px_rgba(0,0,0,0.3)]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`relative h-11 w-11 rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden ${isSelected ? 'ring-1 ring-primary/40' : ''}`}>
            <PokemonImg
              id={pokemon.id}
              name={pokemon.name}
              alt={pokemon.name}
              className="h-10 w-10 object-contain"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium capitalize flex items-center gap-2">
              {pokemon.name}
              <FavoriteBadge isFavorite={isFavorite} />
            </span>
            <span className="inline-flex items-center text-[10px] text-slate-400">
              <span className="inline-flex items-center rounded-full bg-slate-800 px-1.5 py-0.5">#{String(pokemon.id).padStart(3, '0')}</span>
            </span>
          </div>
        </div>

        <button
          onClick={handleFavClick}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-xl text-xs transition-colors ${
            isFavorite
              ? 'bg-amber-500/20 text-amber-300'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
          aria-label="Toggle favorite"
          aria-pressed={isFavorite}
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
