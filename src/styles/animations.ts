export const animations = {
  // Base transitions
  '--transition-base': 'all 0.3s ease',
  '--transition-smooth': 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
  '--transition-bounce': 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
  '--transition-gpu': 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',

  // Morph transitions
  '--morph-duration': '0.6s',
  '--morph-easing': 'cubic-bezier(0.34, 1.56, 0.64, 1)',

  // Keyframe animations
  floatAnimation: `
    @keyframes float {
      0% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
      100% {
        transform: translateY(0);
      }
    }
  `,

  pulseAnimation: `
    @keyframes pulse {
      0% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.05);
        opacity: 0.8;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
  `,

  rotateAnimation: `
    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  `,

  shimmerAnimation: `
    @keyframes shimmer {
      0% {
        background-position: -200% center;
      }
      100% {
        background-position: 200% center;
      }
    }
  `,

  morphInAnimation: `
    @keyframes morphIn {
      0% {
        opacity: 0;
        transform: scale(0.8) translateY(20px);
        filter: blur(10px);
      }
      100% {
        opacity: 1;
        transform: scale(1) translateY(0);
        filter: blur(0);
      }
    }
  `,

  morphOutAnimation: `
    @keyframes morphOut {
      0% {
        opacity: 1;
        transform: scale(1) translateY(0);
        filter: blur(0);
      }
      100% {
        opacity: 0;
        transform: scale(0.8) translateY(20px);
        filter: blur(10px);
      }
    }
 `,

 dataUpdateAnimation: `
   @keyframes dataUpdate {
     0% {
       opacity: 0.5;
       transform: scale(0.95);
     }
     100% {
       opacity: 1;
       transform: scale(1);
     }
   }
 `,

 // Animation presets
  float: {
    animation: 'float 3s ease-in-out infinite',
  },

  pulse: {
    animation: 'pulse 2s ease-in-out infinite',
  },

  rotate: {
    animation: 'rotate 2s linear infinite',
  },

  shimmer: {
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s linear infinite',
  },

  morphIn: {
    animation: 'morphIn var(--morph-duration) var(--morph-easing) forwards',
  },

  morphOut: {
    animation: 'morphOut var(--morph-duration) var(--morph-easing) forwards',
  },

  dataUpdate: {
    animation: 'dataUpdate 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

export type Animations = typeof animations;
export type AnimationKey = keyof Animations;

// Initialize animations
export function initializeAnimations() {
  const style = document.createElement('style');
  const keyframes = Object.values(animations)
    .filter(value => typeof value === 'string' && value.includes('@keyframes'))
    .join('\n');
  
  style.textContent = keyframes;
  document.head.appendChild(style);

  return () => {
    document.head.removeChild(style);
  };
}