import React, { ChangeEvent } from 'react';
import { SearchIcon } from '../icons/Search';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<Props> = React.memo(
  ({ value, onChange }) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
      onChange(e.target.value);

    return (
      <div className="relative w-full">
        <input
          value={value}
          onChange={handleChange}
          placeholder="Search Pokémon by name..."
          className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3 py-2 pl-9 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/70"
        />
        <span className="pointer-events-none absolute left-3 top-2.5 text-slate-500 text-sm">
          <SearchIcon className="h-4 w-4" />
        </span>
      </div>
    );
  }
);
