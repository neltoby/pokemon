import React from 'react';
import { PageLayout } from './components/layout/PageLayout';
import { Header } from './components/layout/Header';
import { PokemonList } from './components/pokemon/PokemonList';
import { PokemonDetailPanel } from './components/pokemon/PokemonDetailPanel';
import { SearchBar } from './components/pokemon/SearchBar';
import { FavoritesFilterToggle } from './components/pokemon/FavoritesFilterToggle';
import { useUiFilters } from './hooks/use-ui-filters';
import { useFavorites } from './hooks/use-favorites';

export const App: React.FC = () => {
  const { searchTerm, setSearchTerm, showFavoritesOnly, setShowFavoritesOnly } =
    useUiFilters();

  // Mount favorites logic so it loads once at app start
  useFavorites();

  return (
    <>
      <Header />
      <PageLayout>
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-4.5rem)]">
          <section className="lg:w-[45%] flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <SearchBar value={searchTerm} onChange={setSearchTerm} />
              <FavoritesFilterToggle
                checked={showFavoritesOnly}
                onChange={setShowFavoritesOnly}
              />
            </div>
            <div className="flex-1 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg shadow-black/40 p-2 overflow-hidden">
              <PokemonList />
            </div>
          </section>

          <section className="lg:flex-1 hidden lg:block">
            <PokemonDetailPanel />
          </section>
        </div>
      </PageLayout>
    </>
  );
};
