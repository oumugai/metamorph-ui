import { createEffect, createSignal, onCleanup } from 'solid-js';
import { animations, initializeAnimations } from '../styles/animations';

export interface AnimationOptions {
  duration?: number;
  delay?: number;
  easing?: string;
  iterations?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

// Create morph effect hook for interactive elements
export function createMorphEffect(element: HTMLElement | null) {
  if (!element) return {};

  const [isHovered, setIsHovered] = createSignal(false);
  const [isPressed, setIsPressed] = createSignal(false);

  createEffect(() => {
    if (!element) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setIsPressed(false);
    };
    const handleMouseDown = () => setIsPressed(true);
    const handleMouseUp = () => setIsPressed(false);

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousedown', handleMouseDown);
    element.addEventListener('mouseup', handleMouseUp);

    onCleanup(() => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousedown', handleMouseDown);
      element.removeEventListener('mouseup', handleMouseUp);
    });
  });

  return {
    isHovered,
    isPressed
  };
}

// Check if the user prefers reduced motion
export function withReducedMotion(animation: string): string {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'none';
  }
  return animation;
}

// Create animation hook
export function createAnimation(
  element: HTMLElement | null,
  animationName: keyof typeof animations,
  options: AnimationOptions = {}
) {
  const [isAnimating, setIsAnimating] = createSignal(false);

  createEffect(() => {
    if (!element) return;

    const {
      duration = 1000,
      delay = 0,
      easing = 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      iterations = 1,
      direction = 'normal',
      fillMode = 'forwards'
    } = options;

    const animation = withReducedMotion(`
      ${animationName} 
      ${duration}ms 
      ${easing} 
      ${delay}ms 
      ${iterations} 
      ${direction} 
      ${fillMode}
    `);

    element.style.animation = animation;
    setIsAnimating(true);

    const animationEndHandler = () => {
      setIsAnimating(false);
    };

    element.addEventListener('animationend', animationEndHandler);

    onCleanup(() => {
      element.removeEventListener('animationend', animationEndHandler);
      element.style.animation = '';
    });
  });

  return isAnimating;
}

// Create theme effect hook
export function createThemeEffect() {
  const [isDarkMode, setIsDarkMode] = createSignal(false);

  createEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const savedTheme = localStorage.getItem('theme');

    const updateTheme = (dark: boolean) => {
      setIsDarkMode(dark);
      document.documentElement.classList.toggle('dark-mode', dark);
    };

    // Initialize theme
    updateTheme(
      savedTheme === 'dark' || 
      (!savedTheme && darkModeQuery.matches)
    );

    // Listen for system theme changes
    const handler = (e: MediaQueryListEvent) => updateTheme(e.matches);
    darkModeQuery.addEventListener('change', handler);

    onCleanup(() => {
      darkModeQuery.removeEventListener('change', handler);
    });
  });

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode();
    setIsDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark-mode', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  return {
    isDarkMode,
    toggleTheme
  };
}

// Initialize animations when the module is imported
const cleanup = initializeAnimations();

// Cleanup animations when the module is disposed
if (import.meta.hot) {
  import.meta.hot.dispose(cleanup);
}