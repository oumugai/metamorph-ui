import { render } from 'solid-js/web';
import App from './App';
import { initialize } from './index';
import './index.css';

// Initialize MetaMorph UI system
const cleanup = initialize;

// Application rendering
const root = document.getElementById('root');

if (root) {
  const dispose = render(() => <App />, root);

  // Register cleanup
  window.__METAMORPH_CLEANUP__ = () => {
    cleanup();
    dispose();
  };
}

// Hot Module Replacement
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    window.__METAMORPH_CLEANUP__?.();
  });
}
