import { createSignal, onCleanup, onMount } from 'solid-js';
import { variables } from './variables';

export function initializeTheme() {
  const [isDarkMode, setIsDarkMode] = createSignal(false);
  const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(isDark: boolean) {
    if (isDark) {
      document.body.classList.add('dark-mode');
      document.body.style.background = variables['--bg-dark'] as string;
      document.body.style.color = variables['--text-dark'] as string;
    } else {
      document.body.classList.remove('dark-mode');
      document.body.style.background = variables['--bg-light'] as string;
      document.body.style.color = variables['--text-light'] as string;
    }
  }

  // Initialize from system preference
  function handleSystemThemeChange(e: MediaQueryListEvent) {
    setIsDarkMode(e.matches);
    applyTheme(e.matches);
  }

  // Setup initial theme
  onMount(() => {
    const savedTheme = localStorage.getItem('theme');
    const initialDarkMode = savedTheme === 'dark' || 
      (!savedTheme && systemDarkMode.matches);
    
    setIsDarkMode(initialDarkMode);
    applyTheme(initialDarkMode);

    // Listen for system theme changes
    systemDarkMode.addEventListener('change', handleSystemThemeChange);
  });

  // Cleanup
  onCleanup(() => {
    systemDarkMode.removeEventListener('change', handleSystemThemeChange);
  });

  // Theme toggle function
  const toggleTheme = () => {
    const newDarkMode = !isDarkMode();
    setIsDarkMode(newDarkMode);
    applyTheme(newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  // Background color change on scroll for light mode
  function updateBackgroundOnScroll() {
    if (!isDarkMode()) {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      const scrollPercentage = window.scrollY / maxScroll;
      
      document.body.style.background = `linear-gradient(135deg, 
        hsl(${220 + scrollPercentage * 30}, 80%, 90%), 
        hsl(${240 + scrollPercentage * 30}, 80%, 85%))`;
    }
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateBackgroundOnScroll);
  });

  onCleanup(() => {
    window.removeEventListener('scroll', updateBackgroundOnScroll);
  });

  return {
    isDarkMode,
    toggleTheme,
    updateBackgroundOnScroll,
  };
}