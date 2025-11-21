import React from 'react';
import { Toggle } from '../layout/Toggle';

interface Props {
  checked: boolean;
  onChange: (value: boolean) => void;
}

export const FavoritesFilterToggle: React.FC<Props> = React.memo(
  ({ checked, onChange }) => (
    <Toggle
      checked={checked}
      onChange={onChange}
      label={
        <span>
          Show{' '}
          <span className="font-semibold text-accent">
            favorites only
          </span>
        </span>
      }
    />
  )
);
