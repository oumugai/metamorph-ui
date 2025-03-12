import { Component, createEffect, createSignal, onCleanup } from 'solid-js';
import styles from './CircularProgress.module.css';
import { animations } from '../../../styles/animations';

export interface CircularProgressProps {
  value: number;
  maxValue?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  animated?: boolean;
  responsive?: boolean;
  maintainAspectRatio?: boolean;
}

export const CircularProgress: Component<CircularProgressProps> = (props) => {
  const [containerRef, setContainerRef] = createSignal<HTMLDivElement>();
  const [calculatedSize, setCalculatedSize] = createSignal(120);
  const [animationState, setAnimationState] = createSignal<'enter' | 'update' | 'none'>('enter');
  
  const defaultSize = 120;

  // 初期アニメーションの制御
  createEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState('none');
    }, 600);

    onCleanup(() => {
      clearTimeout(timer);
    });
  });
  const isResponsive = props.responsive !== false;
  const shouldMaintainAspectRatio = props.maintainAspectRatio !== false;
  const strokeWidth = props.strokeWidth || 8;
  const maxValue = props.maxValue || 100;
  const viewBoxSize = props.size || defaultSize;
  const radius = (viewBoxSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const animated = props.animated !== false;

  const calculateSize = () => {
    const container = containerRef();
    if (!container) return;

    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;
    const size = shouldMaintainAspectRatio
      ? Math.min(containerWidth, containerHeight)
      : containerWidth;

    setCalculatedSize(size);
  };

  // レスポンシブサイズの管理
  createEffect(() => {
    if (isResponsive) {
      const resizeObserver = new ResizeObserver(() => {
        calculateSize();
      });

      const container = containerRef();
      if (container) {
        resizeObserver.observe(container);
        calculateSize();
      }

      onCleanup(() => {
        if (container) {
          resizeObserver.unobserve(container);
        }
      });
    }
  });

  // 値の変更を監視して更新アニメーションを制御
  createEffect((prevValue) => {
    const currentValue = props.value;
    if (prevValue !== undefined && prevValue !== currentValue) {
      setAnimationState('update');
      setTimeout(() => setAnimationState('none'), 600);
    }
    return currentValue;
  });

  const normalizedValue = Math.min(Math.max(props.value, 0), maxValue);
  const percentage = (normalizedValue / maxValue) * 100;
  const offset = circumference - (percentage / 100) * circumference;

  const containerStyle = {
    "width": `${props.size || defaultSize}px`,
    "height": `${props.size || defaultSize}px`,
    '--stroke-width': `${strokeWidth}px`,
    '--radius': `${radius}px`,
    '--circumference': `${circumference}px`,
    '--offset': `${offset}px`,
    '--calculated-size': `${calculatedSize()}px`
  };

  createEffect(() => {
    const circle = document.querySelector(`.${styles.progressCircle}`);
    if (circle) {
      if (animated) {
        circle.classList.add(styles.animated);
      } else {
        circle.classList.remove(styles.animated);
      }
    }
  });

  return (
    <div
      class={styles.circularProgress}
      style={containerStyle}
      ref={setContainerRef}
    >
      <svg
        viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          class={styles.backgroundCircle}
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={radius}
          fill="none"
          stroke-width={strokeWidth}
        />
        <circle
          class={styles.progressCircle}
          cx={viewBoxSize / 2}
          cy={viewBoxSize / 2}
          r={radius}
          fill="none"
          stroke-width={strokeWidth}
          stroke-dasharray={String(circumference)}
          stroke-dashoffset={String(offset)}
          data-animation={animationState()}
        />
      </svg>
      <div class={styles.content}>
        <span class={styles.value} data-animation={animationState()}>{Math.round(percentage)}%</span>
        {props.label && <span class={styles.label}>{props.label}</span>}
      </div>
    </div>
  );
};

export default CircularProgress;