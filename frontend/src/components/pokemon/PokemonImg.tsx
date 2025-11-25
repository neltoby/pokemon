import React, { useMemo, useState, useCallback } from 'react';
import { getPokemonImageCandidates } from '../../api/pokemon-api';

interface Props {
  id: number;
  alt: string;
  className?: string;
  name?: string;
  src?: string;
}

export const PokemonImg: React.FC<Props> = ({ id, alt, className, name, src }) => {
  const sources = useMemo(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    const base = getPokemonImageCandidates(id);
    // Prefer provided src if any
    const candidates: string[] = src ? [src] : [];
    // Prefer backend proxy as next candidate to avoid CDN/network issues
    candidates.push(`${apiBase}/api/pokemon/${id}/image`);
    candidates.push(...base);
    if (name) {
      const n = name.toLowerCase();
      // Name-based fallbacks via pokemondb
      candidates.push(
        `https://img.pokemondb.net/artwork/large/${n}.jpg`,
        `https://img.pokemondb.net/sprites/home/normal/${n}.png`,
        `https://img.pokemondb.net/sprites/x-y/normal/${n}.png`
      );
    }
    return candidates;
  }, [id, name, src]);
  const [idx, setIdx] = useState(0);

  const handleError = useCallback(() => {
    setIdx((i) => (i + 1 < sources.length ? i + 1 : i));
  }, [sources.length]);

  // If id is invalid, render nothing instead of a broken image
  if (!Number.isFinite(id) || id <= 0) {
    return null;
  }

  return (
    <img
      src={sources[idx]}
      alt={alt}
      className={className}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={handleError}
    />
  );
};
