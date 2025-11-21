import React from 'react';
import { useSelection } from '../../hooks/use-selection';
import { usePokemonDetails } from '../../hooks/use-pokemon-details';
import { Spinner } from '../layout/Spinner';
import { ErrorBanner } from '../layout/ErrorBanner';
import { Bolt } from '../icons/Bolt';
import { ArrowRight } from '../icons/ArrowRight';

export const PokemonDetailPanel: React.FC = () => {
  const { selectedPokemonId } = useSelection();
  const { details, status, error } = usePokemonDetails(
    selectedPokemonId
  );

  if (!selectedPokemonId) {
    return (
      <div className="h-full flex items-center justify-center text-sm text-slate-500">
        Select a Pokémon to see details
      </div>
    );
  }

  if (status === 'loading') {
    return (
      <div className="h-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="p-3">
        <ErrorBanner
          message={error ?? 'Failed to load Pokémon details'}
        />
      </div>
    );
  }

  if (!details) {
    return null;
  }

  return (
    <div className="h-full rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl shadow-black/50 p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold capitalize tracking-tight">
            {details.name}
          </h2>
          <p className="text-xs text-slate-400">
            #{String(details.id).padStart(3, '0')}
          </p>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Bolt className="h-7 w-7 text-white/90" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
            Types
          </h3>
          <div className="flex flex-wrap gap-1">
            {details.types.map(t => (
              <span
                key={t}
                className="inline-flex rounded-full bg-primary/20 px-2 py-0.5 text-[11px] text-primary-100 capitalize"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-xl bg-slate-900 border border-slate-800 p-3">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
            Abilities
          </h3>
          <div className="flex flex-wrap gap-1">
            {details.abilities.map(a => (
              <span
                key={a}
                className="inline-flex rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-100 capitalize"
              >
                {a}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-slate-900 border border-slate-800 p-3 flex-1">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
          Evolution Line
        </h3>
        {details.evolutions.length ? (
          <div className="flex flex-wrap gap-2 items-center text-sm">
            {details.evolutions.map((name, i) => (
              <React.Fragment key={name}>
                {i > 0 && (
                  <ArrowRight className="h-3.5 w-3.5 text-slate-500" />
                )}
                <span className="rounded-full bg-slate-800 px-3 py-1 capitalize">
                  {name}
                </span>
              </React.Fragment>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500">
            No evolution data available.
          </p>
        )}
      </div>
    </div>
  );
};
