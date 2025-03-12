// Global Styles
import './index.css';

// Core Components
export * from './components/core/Button';
export * from './components/core/Card';
export * from './components/core/Input';
export * from './components/core/Chart';
export * from './components/core/Form';
export * from './components/core/CircularProgress';
export * from './components/core/LineChart';

// Hooks
export {
  createAnimation,
  createThemeEffect,
  createMorphEffect,
  withReducedMotion,
  type AnimationOptions
} from './hooks';

// Styles
import {
  variables,
  type Variables,
  type VariableKey,
  createCssVariables
} from './styles/variables';

import {
  animations,
  type Animations,
  type AnimationKey,
  initializeAnimations
} from './styles/animations';

export {
  variables,
  animations,
  type Variables,
  type VariableKey,
  type Animations,
  type AnimationKey
};

// Auto-initialize the theme system
const cleanupVariables = createCssVariables();
const cleanupAnimations = initializeAnimations();

// Cleanup when hot module reloaded
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    cleanupVariables();
    cleanupAnimations();
  });
}

// Export cleanup function for manual control if needed
export const cleanup = () => {
  cleanupVariables();
  cleanupAnimations();
};