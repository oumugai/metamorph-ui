export const variables = {
  // Colors
  '--color-primary-500-rgb': '58, 134, 255',
  '--color-primary-900-rgb': '131, 56, 236',
  '--color-primary-500': '#3a86ff',
  '--color-primary-900': '#8338ec',
  '--color-error': '#ff4d4f',
  '--color-success': '#52c41a',
  '--color-warning': '#faad14',

  // Text Colors
  '--text-light': '#333',
  '--text-dark': '#f0f0f0',

  // Background Colors
  '--bg-light': 'linear-gradient(135deg, #f0f4ff, #d9e2ff)',
  '--bg-dark': 'linear-gradient(135deg, #121212, #1e1e24)',
  '--card-bg-light': 'rgba(255, 255, 255, 0.8)',
  '--card-bg-dark': 'rgba(30, 30, 30, 0.8)',

  // Spacing
  '--space-1': '0.25rem',
  '--space-2': '0.5rem',
  '--space-3': '0.75rem',
  '--space-4': '1rem',
  '--space-6': '1.5rem',
  '--space-8': '2rem',
  '--space-12': '3rem',
  '--space-16': '4rem',

  // Border Radius
  '--radius-sm': '0.25rem',
  '--radius-md': '0.5rem',
  '--radius-lg': '1rem',
  '--radius-xl': '1.5rem',
  '--radius-full': '9999px',

  // Transitions
  '--transition-smooth': 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
  '--transition-bounce': 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
  '--transition-gpu': 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',

  // Shadows
  '--shadow-sm': `
    5px 5px 10px rgba(0, 0, 0, 0.1),
    -5px -5px 10px rgba(255, 255, 255, 0.8)
  `,
  '--shadow-md': `
    10px 10px 20px rgba(0, 0, 0, 0.15),
    -10px -10px 20px rgba(255, 255, 255, 0.8)
  `,
  '--shadow-lg': `
    15px 15px 30px rgba(0, 0, 0, 0.2),
    -15px -15px 30px rgba(255, 255, 255, 0.8)
  `,
  '--shadow-inner': `
    inset 5px 5px 10px rgba(0, 0, 0, 0.05),
    inset -5px -5px 10px rgba(255, 255, 255, 0.5)
  `,

  // Dark Mode Shadows
  '--shadow-dark-sm': `
    5px 5px 10px rgba(0, 0, 0, 0.3),
    -5px -5px 10px rgba(40, 40, 40, 0.2)
  `,
  '--shadow-dark-md': `
    10px 10px 20px rgba(0, 0, 0, 0.35),
    -10px -10px 20px rgba(40, 40, 40, 0.25)
  `,
  '--shadow-dark-lg': `
    15px 15px 30px rgba(0, 0, 0, 0.4),
    -15px -15px 30px rgba(40, 40, 40, 0.3)
  `,
  '--shadow-dark-inner': `
    inset 5px 5px 10px rgba(0, 0, 0, 0.2),
    inset -5px -5px 10px rgba(60, 60, 60, 0.1)
  `,
} as const;

export type Variables = typeof variables;
export type VariableKey = keyof Variables;

// Initialize CSS variables
export function createCssVariables() {
  const style = document.createElement('style');
  const cssVariables = Object.entries(variables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  style.textContent = `
    :root {
${cssVariables}
    }
  `;

  document.head.appendChild(style);

  return () => {
    document.head.removeChild(style);
  };
}