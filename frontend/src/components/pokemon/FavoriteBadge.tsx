import React from 'react';
import { StarSolid } from '../icons/Star';

interface Props {
  isFavorite: boolean;
}

export const FavoriteBadge: React.FC<Props> = React.memo(
  ({ isFavorite }) => {
    if (!isFavorite) return null;

  return (
    <span className="ml-1 inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-300">
      <StarSolid className="h-3 w-3" />
      Favorite
    </span>
  );
}
);
