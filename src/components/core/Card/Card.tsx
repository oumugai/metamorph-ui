import { Component, JSX, onCleanup } from 'solid-js';
import styles from './Card.module.css';

export interface CardProps {
  children: JSX.Element;
  variant?: 'elevated' | 'outlined' | 'filled';
  interactive?: boolean;
  tilt?: boolean;  // Add tilt property to control 3D rotation effect
  class?: string;
  style?: { [key: string]: string | number };
}

export const Card: Component<CardProps> = ({ tilt = true, ...props }) => {
  let cardRef: HTMLDivElement | undefined;
  let requestId: number;
  let resizeObserver: ResizeObserver;

  // Calculate maximum rotation based on card size
  const calculateMaxRotation = (width: number, height: number) => {
    // Base rotation angles
    const MAX_ROTATION = 12;
    const MIN_ROTATION = 4;
    
    // Use the largest dimension for calculation
    const size = Math.max(width, height);
    // Reference sizes for scaling (in pixels)
    const MIN_SIZE = 200;
    const MAX_SIZE = 800;
    
    // Calculate scale factor (1 for smallest size, 0 for largest size)
    const scaleFactor = Math.max(0, Math.min(1, 
      1 - (size - MIN_SIZE) / (MAX_SIZE - MIN_SIZE)
    ));
    
    // Return interpolated rotation value
    return MIN_ROTATION + (MAX_ROTATION - MIN_ROTATION) * scaleFactor;
  };

  const clamp = (value: number, min: number, max: number) => {
    return Math.min(Math.max(value, min), max);
  };

  // Track current maximum rotation
  let currentMaxRotation = 7.5;

  const handleMouseMove = (e: MouseEvent) => {
    if (!cardRef || !props.interactive || !tilt) return;

    const rect = cardRef.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate normalized position (-1 to 1)
    const normalizedX = -(x - centerX) / centerX;
    const normalizedY = -(y - centerY) / centerY;

    // Calculate rotation angles with dynamic maximum rotation
    const angleX = clamp(-normalizedY * currentMaxRotation, -currentMaxRotation, currentMaxRotation);
    const angleY = clamp(normalizedX * currentMaxRotation, -currentMaxRotation, currentMaxRotation);

    cancelAnimationFrame(requestId);
    requestId = requestAnimationFrame(() => {
      if (cardRef) {
        if (tilt) {
          cardRef.style.setProperty('--rotate-x', `${angleX}deg`);
          cardRef.style.setProperty('--rotate-y', `${angleY}deg`);
        }
      }
    });
  };

  const handleMouseLeave = () => {
    cancelAnimationFrame(requestId);
    requestId = requestAnimationFrame(() => {
      if (cardRef) {
        cardRef.style.setProperty('--rotate-x', '0deg');
        cardRef.style.setProperty('--rotate-y', '0deg');
      }
    });
  };

  const cleanup = () => {
    if (cardRef && props.interactive) {
      cardRef.removeEventListener('mousemove', handleMouseMove);
      cardRef.removeEventListener('mouseleave', handleMouseLeave);
    }
    if (resizeObserver) {
      resizeObserver.disconnect();
    }
    cancelAnimationFrame(requestId);
  };

  const setup = (element: HTMLDivElement) => {
    cardRef = element;
    if (props.interactive) {
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('mouseleave', handleMouseLeave);

      // Setup ResizeObserver only if tilt is enabled
      if (tilt) {
        resizeObserver = new ResizeObserver((entries) => {
          for (const entry of entries) {
            const { width, height } = entry.contentRect;
            currentMaxRotation = calculateMaxRotation(width, height);
          }
        });
        resizeObserver.observe(element);
      }
    }
  };

  onCleanup(cleanup);

  return (
    <div
      ref={setup}
      class={`
        ${styles.card}
        ${props.variant ? styles[props.variant] : styles.elevated}
        ${props.interactive ? styles.interactive : ''}
        ${tilt ? styles.tilt : ''}
        ${props.class || ''}
      `}
      style={props.style}
    >
      <div class={styles.content}>
        {props.children}
      </div>
    </div>
  );
};