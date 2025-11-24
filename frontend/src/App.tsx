import React, { useRef } from 'react';
import { PageLayout } from './components/layout/PageLayout';
import { Header } from './components/layout/Header';
import { PokemonList } from './components/pokemon/PokemonList';
import { PokemonDetailPanel } from './components/pokemon/PokemonDetailPanel';
import { SearchBar } from './components/pokemon/SearchBar';
import { FavoritesFilterToggle } from './components/pokemon/FavoritesFilterToggle';
import { useUiFilters } from './hooks/use-ui-filters';
import { useFavorites } from './hooks/use-favorites';
import { useHotkeys } from './hooks/use-hotkeys';
import { useElementSize } from './hooks/use-element-size';
import { ErrorBoundary } from './components/layout/ErrorBoundary';
import { ErrorBanner } from './components/layout/ErrorBanner';

export const App: React.FC = () => {
  const { searchTerm, setSearchTerm, showFavoritesOnly, setShowFavoritesOnly } =
    useUiFilters();

  // Mount favorites logic so it loads once at app start
  useFavorites();

  const searchRef = useRef<HTMLInputElement | null>(null);

  const listPanelRef = useRef<HTMLDivElement | null>(null);
  const listWrapperRef = useRef<HTMLDivElement | null>(null);
  const detailsPanelRef = useRef<HTMLElement | null>(null);
  const { onKeyDown } = useHotkeys({
    focusSearch: () => searchRef.current?.focus(),
    focusList: () => listPanelRef.current?.focus(),
    focusDetails: () => detailsPanelRef.current?.focus(),
  });
  const { height: listWrapperHeight } = useElementSize(listWrapperRef);

  return (
    <>
      <a
        href="#list-panel"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
      >
        Skip to list
      </a>
      <a
        href="#details-panel"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-44 focus:z-50 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1 text-white focus:outline-none focus:ring-2 focus:ring-primary/60"
      >
        Skip to details
      </a>
      <ErrorBoundary
        name="header"
        fallback={(error, reset) => (
          <div className="p-3">
            <ErrorBanner message={error.message || 'Header failed to render'} />
            <button
              type="button"
              onClick={reset}
              className="mt-2 inline-flex items-center rounded-md bg-slate-800 hover:bg-slate-700 text-slate-100 px-3 py-1 text-xs"
            >
              Retry
            </button>
          </div>
        )}
      >
        <Header />
      </ErrorBoundary>
      <PageLayout>
        <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-4.5rem)] min-h-0">
          <section className="lg:w-[45%] h-full flex flex-col gap-3 min-h-0">
            <ErrorBoundary
              name="toolbar"
              fallback={(error, reset) => (
                <div className="p-3">
                  <ErrorBanner message={error.message || 'Toolbar failed to render'} />
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-2 inline-flex items-center rounded-md bg-slate-800 hover:bg-slate-700 text-slate-100 px-3 py-1 text-xs"
                  >
                    Retry
                  </button>
                </div>
              )}
            >
              <div className="flex items-center gap-3">
                <SearchBar ref={searchRef} value={searchTerm} onChange={setSearchTerm} />
                <FavoritesFilterToggle
                  checked={showFavoritesOnly}
                  onChange={setShowFavoritesOnly}
                />
              </div>
            </ErrorBoundary>
            <div
              className="flex-1 h-full min-h-0 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg shadow-black/40 p-2 overflow-hidden focus:outline-none"
              onKeyDown={onKeyDown}
              ref={listWrapperRef}
            >
              <ErrorBoundary
                name="list"
                fallback={(error, reset) => (
                  <div className="p-3">
                    <ErrorBanner message={error.message || 'List failed to render'} />
                    <button
                      type="button"
                      onClick={reset}
                      className="mt-2 inline-flex items-center rounded-md bg-slate-800 hover:bg-slate-700 text-slate-100 px-3 py-1 text-xs"
                    >
                      Retry
                    </button>
                  </div>
                )}
              >
                <PokemonList focusRef={listPanelRef} height={listWrapperHeight} />
              </ErrorBoundary>
            </div>
          </section>

          <section
            ref={detailsPanelRef}
            className="lg:flex-1 hidden lg:block h-full min-h-0"
            id="details-panel"
            tabIndex={-1}
          >
            <ErrorBoundary
              name="details"
              fallback={(error, reset) => (
                <div className="p-3">
                  <ErrorBanner message={error.message || 'Details failed to render'} />
                  <button
                    type="button"
                    onClick={reset}
                    className="mt-2 inline-flex items-center rounded-md bg-slate-800 hover:bg-slate-700 text-slate-100 px-3 py-1 text-xs"
                  >
                    Retry
                  </button>
                </div>
              )}
            >
              <PokemonDetailPanel />
            </ErrorBoundary>
          </section>
        </div>
      </PageLayout>
    </>
  );
};
