import React, { type ChangeEvent, forwardRef } from 'react';
import { SearchIcon } from '../icons/Search';
import { Input } from '../ui/Input';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar = React.memo(
  forwardRef<HTMLInputElement, Props>(({ value, onChange }, ref) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
      onChange(e.target.value);

    return (
      <Input
        ref={ref}
        id="search-input"
        value={value}
        onChange={handleChange}
        placeholder="Search Pokémon by name..."
        aria-label="Search Pokémon by name"
        leftIcon={<SearchIcon className="h-4 w-4" />}
      />
    );
  })
);
