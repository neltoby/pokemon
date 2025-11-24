import ReactDOM from 'react-dom/client';
import { App } from './App';
import { PokemonStoreProvider } from './context/pokemon-store-provider';
import './styles/index.css';
import { ErrorBoundary } from './components/layout/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary name="root">
    <PokemonStoreProvider>
      <App />
    </PokemonStoreProvider>
  </ErrorBoundary>
);
