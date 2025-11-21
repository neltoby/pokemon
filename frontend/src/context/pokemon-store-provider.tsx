import React, {
  createContext,
  useReducer,
  useMemo,
  ReactNode
} from 'react';
import type { PokemonSummary, PokemonDetails } from '../api/pokemon-api';
import type { Favorite } from '../api/favourite-api';

type Status = 'idle' | 'loading' | 'success' | 'error';

interface PokemonStoreState {
  list: PokemonSummary[];
  listStatus: Status;
  listError: string | null;

  favorites: Favorite[];
  favoritesStatus: Status;
  favoritesError: string | null;

  detailsById: Record<number, PokemonDetails>;
  detailsStatusById: Record<number, Status>;
  detailsErrorById: Record<number, string | null>;

  selectedPokemonId: number | null;

  searchTerm: string;
  showFavoritesOnly: boolean;
}

type Action =
  | { type: 'SET_LIST_LOADING' }
  | { type: 'SET_LIST_SUCCESS'; payload: PokemonSummary[] }
  | { type: 'SET_LIST_ERROR'; payload: string }
  | { type: 'SET_FAVORITES_LOADING' }
  | { type: 'SET_FAVORITES_SUCCESS'; payload: Favorite[] }
  | { type: 'SET_FAVORITES_ERROR'; payload: string }
  | {
      type: 'SET_DETAILS_LOADING';
      payload: { pokemonId: number };
    }
  | {
      type: 'SET_DETAILS_SUCCESS';
      payload: { pokemonId: number; details: PokemonDetails };
    }
  | {
      type: 'SET_DETAILS_ERROR';
      payload: { pokemonId: number; error: string };
    }
  | { type: 'SET_SELECTED_POKEMON'; payload: number | null }
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_SHOW_FAVORITES_ONLY'; payload: boolean };

const initialState: PokemonStoreState = {
  list: [],
  listStatus: 'idle',
  listError: null,

  favorites: [],
  favoritesStatus: 'idle',
  favoritesError: null,

  detailsById: {},
  detailsStatusById: {},
  detailsErrorById: {},

  selectedPokemonId: null,

  searchTerm: '',
  showFavoritesOnly: false
};

function reducer(
  state: PokemonStoreState,
  action: Action
): PokemonStoreState {
  switch (action.type) {
    case 'SET_LIST_LOADING':
      return { ...state, listStatus: 'loading', listError: null };
    case 'SET_LIST_SUCCESS':
      return { ...state, listStatus: 'success', list: action.payload };
    case 'SET_LIST_ERROR':
      return { ...state, listStatus: 'error', listError: action.payload };
    case 'SET_FAVORITES_LOADING':
      return {
        ...state,
        favoritesStatus: 'loading',
        favoritesError: null
      };
    case 'SET_FAVORITES_SUCCESS':
      return {
        ...state,
        favoritesStatus: 'success',
        favorites: action.payload
      };
    case 'SET_FAVORITES_ERROR':
      return {
        ...state,
        favoritesStatus: 'error',
        favoritesError: action.payload
      };
    case 'SET_DETAILS_LOADING':
      return {
        ...state,
        detailsStatusById: {
          ...state.detailsStatusById,
          [action.payload.pokemonId]: 'loading'
        },
        detailsErrorById: {
          ...state.detailsErrorById,
          [action.payload.pokemonId]: null
        }
      };
    case 'SET_DETAILS_SUCCESS':
      return {
        ...state,
        detailsById: {
          ...state.detailsById,
          [action.payload.pokemonId]: action.payload.details
        },
        detailsStatusById: {
          ...state.detailsStatusById,
          [action.payload.pokemonId]: 'success'
        }
      };
    case 'SET_DETAILS_ERROR':
      return {
        ...state,
        detailsStatusById: {
          ...state.detailsStatusById,
          [action.payload.pokemonId]: 'error'
        },
        detailsErrorById: {
          ...state.detailsErrorById,
          [action.payload.pokemonId]: action.payload.error
        }
      };
    case 'SET_SELECTED_POKEMON':
      return { ...state, selectedPokemonId: action.payload };
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_SHOW_FAVORITES_ONLY':
      return { ...state, showFavoritesOnly: action.payload };
    default:
      return state;
  }
}

interface PokemonStoreContextValue {
  state: PokemonStoreState;
  dispatch: React.Dispatch<Action>;
}

export const PokemonStoreContext =
  createContext<PokemonStoreContextValue | null>(null);

export const PokemonStoreProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(
    () => ({ state, dispatch }),
    [state, dispatch]
  );

  return (
    <PokemonStoreContext.Provider value={value}>
      {children}
    </PokemonStoreContext.Provider>
  );
};
