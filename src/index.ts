// Core Components
export * from './components/core/Button';
export * from './components/core/Card';
export * from './components/core/Input';

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

// Initialize the theme system
const themeInit = () => {
  const cleanupVariables = createCssVariables();
  const cleanupAnimations = initializeAnimations();

  return () => {
    cleanupVariables();
    cleanupAnimations();
  };
};

// Initialize theme system
export const initialize = themeInit();

// Cleanup when hot module reloaded
if (import.meta.hot) {
  import.meta.hot.dispose(initialize);
}