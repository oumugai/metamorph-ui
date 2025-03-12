import { Component, createSignal, For, createEffect, onCleanup } from 'solid-js';
import { useStyles } from '../../../hooks/useStyles';
import moduleStyles from './Chart.module.css';
import { animations } from '../../../styles/animations';

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartProps {
  data: ChartDataPoint[];
  width?: number;
  height?: number;
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  aspectRatio?: number;
  onUpdate?: () => void;
  title?: string;
  description?: string;
}

export const Chart: Component<ChartProps> = (props) => {
  const styles = useStyles(moduleStyles);
  const [chartData, setChartData] = createSignal(props.data);
  const [containerRef, setContainerRef] = createSignal<HTMLDivElement>();
  const [size, setSize] = createSignal({ width: 0, height: 0 });
  const [animationStates, setAnimationStates] = createSignal<Record<string, 'enter' | 'update' | 'none'>>({});

  // 初期化時と更新時のアニメーション制御
  createEffect(() => {
    const newData = props.data;
    const currentData = chartData();
    
    if (JSON.stringify(newData) !== JSON.stringify(currentData)) {
      const states: Record<string, 'enter' | 'update' | 'none'> = {};
      
      newData.forEach(point => {
        const isNewPoint = !currentData.find(p => p.label === point.label);
        states[point.label] = isNewPoint ? 'enter' : 'update';
      });

      setAnimationStates(states);
      setChartData(newData);

      // アニメーション完了後にステートをリセット
      setTimeout(() => {
        setAnimationStates({});
      }, 600);

      props.onUpdate?.();
    }
  });

  // Chart.jsと同様のデフォルト設定
  const defaultAspectRatio = 2;
  const isResponsive = props.responsive !== false;
  const shouldMaintainAspectRatio = props.maintainAspectRatio !== false;
  const aspectRatio = props.aspectRatio || defaultAspectRatio;

  const calculateSize = () => {
    const container = containerRef();
    if (!container) return;

    const containerWidth = container.clientWidth;
    let containerHeight = container.clientHeight;

    if (shouldMaintainAspectRatio) {
      containerHeight = containerWidth / aspectRatio;
    }

    setSize({ width: containerWidth, height: containerHeight });
  };

  // レスポンシブ対応
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

  const containerStyle = {
    width: props.width ? `${props.width}px` : '100%',
    height: shouldMaintainAspectRatio ? 'auto' : props.height ? `${props.height}px` : '100%',
    position: 'relative' as const
  };

  const MIN_BAR_HEIGHT = 1;

  return (
    <div class={styles.dataVisualization} style={containerStyle} ref={setContainerRef}>
      {props.title && <h2 class={styles.title}>{props.title}</h2>}
      {props.description && <p class={styles.description}>{props.description}</p>}

      <div
        class={styles.chart}
        style={{
          height: size().height ? `${size().height}px` : '100%',
          'min-height': shouldMaintainAspectRatio ? 'unset' : '200px'
        }}
      >
        <For each={chartData()}>
          {(point) => (
            <div
              class={styles.dataPoint}
              style={{ height: `${Math.max(point.value, MIN_BAR_HEIGHT)}%` }}
              data-animation={animationStates()[point.label] || 'none'}
            >
              <div class={styles.dataTooltip}>{`${point.label}: ${point.value}%`}</div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};

export default Chart;
