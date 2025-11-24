import React from 'react';
import { useSelection } from '../../hooks/use-selection';
import { usePokemonDetails } from '../../hooks/use-pokemon-details';
import { Spinner } from '../layout/Spinner';
import { ErrorBanner } from '../layout/ErrorBanner';
import { PokemonImg } from './PokemonImg';
import { Card, CardBody } from '../ui/Card';
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
      <Card className="h-full">
        <CardBody className="flex flex-col gap-4 h-full">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="h-6 w-40 rounded bg-slate-800/60 animate-pulse" />
              <div className="h-3 w-16 mt-2 rounded bg-slate-800/60 animate-pulse" />
            </div>
            <div className="h-24 w-24 rounded-xl bg-slate-800/60 animate-pulse" />
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="h-28 rounded-xl bg-slate-800/50 animate-pulse" />
            <div className="h-28 rounded-xl bg-slate-800/50 animate-pulse" />
          </div>
          <div className="flex-1 rounded-xl bg-slate-800/50 animate-pulse" />
        </CardBody>
      </Card>
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
    <Card className="h-full">
      <CardBody className="flex flex-col gap-4 h-full">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-semibold capitalize tracking-tight">
              {details.name}
            </h2>
            <p className="text-xs text-slate-400">
              #{String(details.id).padStart(3, '0')}
            </p>
          </div>
          {details.imageUrl ? (
            <img
              src={details.imageUrl}
              alt={details.name}
              className="h-24 w-24 object-contain rounded-xl bg-slate-800"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <PokemonImg
              id={details.id}
              name={details.name}
              alt={details.name}
              className="h-24 w-24 object-contain rounded-xl bg-slate-800"
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <Card className="bg-slate-900/80">
            <CardBody>
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
            </CardBody>
          </Card>

          <Card className="bg-slate-900/80">
            <CardBody>
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
            </CardBody>
          </Card>
        </div>

        <Card className="bg-slate-900/80 flex-1">
          <CardBody>
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
          </CardBody>
        </Card>
      </CardBody>
    </Card>
  );
};
