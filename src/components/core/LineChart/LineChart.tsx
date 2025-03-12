import { Component, createSignal, createEffect, onCleanup, For } from 'solid-js';
import styles from './LineChart.module.css';
import { animations } from '../../../styles/animations';

export interface DataPoint {
  label: string;
  value: number;
}

export interface LineChartProps {
  data: DataPoint[];
  width?: number | string;
  height?: number | string;
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  aspectRatio?: number;
  onUpdate?: () => void;
  title?: string;
  description?: string;
}

export const LineChart: Component<LineChartProps> = (props) => {
  const [activePoint, setActivePoint] = createSignal<number | null>(null);
  const [containerRef, setContainerRef] = createSignal<HTMLDivElement>();
  const [size, setSize] = createSignal({ width: 800, height: 400 });
  const [animationState, setAnimationState] = createSignal<'enter' | 'update' | 'none'>('enter');
  const [chartData, setChartData] = createSignal(props.data);

  // 初期アニメーションと更新アニメーションの制御
  createEffect(() => {
    const timer = setTimeout(() => {
      setAnimationState('none');
    }, 600);

    onCleanup(() => {
      clearTimeout(timer);
    });
  });

  // Chart.jsと同様のデフォルト設定
  const defaultAspectRatio = 2;
  const isResponsive = props.responsive !== false;
  const shouldMaintainAspectRatio = props.maintainAspectRatio !== false;
  const aspectRatio = props.aspectRatio || defaultAspectRatio;

  const padding = {
    left: 50,   // Y軸のラベル用に余裕を持たせる
    right: 30,
    top: 30,
    bottom: 40
  };

  const calculateSize = () => {
    const container = containerRef();
    if (!container) return;

    const containerWidth = container.clientWidth;
    let containerHeight = shouldMaintainAspectRatio
      ? containerWidth / aspectRatio
      : container.clientHeight;

    setSize({
      width: containerWidth,
      height: containerHeight
    });
  };
// データ変更の監視とアニメーション
createEffect(() => {
  const newData = props.data;
  if (JSON.stringify(newData) !== JSON.stringify(chartData())) {
    setAnimationState('update');
    setChartData(newData);
    
    // アニメーション後にリセット
    setTimeout(() => {
      setAnimationState('none');
    }, 600); // アニメーション時間を統一
    
    props.onUpdate?.();
  }
});

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
    height: shouldMaintainAspectRatio ? 'auto' : (props.height ? `${props.height}px` : '100%'),
    position: 'relative' as const
  };

  const chartWidth = size().width - (padding.left + padding.right);
  const chartHeight = size().height - (padding.top + padding.bottom);

  // データの範囲を計算
  const maxValue = Math.max(...props.data.map(d => d.value));
  const minValue = Math.min(...props.data.map(d => d.value));
  const valueRange = Math.abs(maxValue - minValue);

  // 適切な目盛り間隔を計算
  const getTickInterval = (range: number) => {
    const rough = range / 4; // 4分割を目標
    const power = Math.floor(Math.log10(rough));
    const unit = Math.pow(10, power);
    const options = [1, 2, 5, 10].map(x => x * unit);
    return options.find(x => x >= rough) || unit * 10;
  };

  const tickInterval = getTickInterval(valueRange);
  // Y軸の範囲を設定（最小値は0または負の値がある場合は最小値）
  const yAxisMin = minValue >= 0 ? 0 : Math.floor(minValue / tickInterval) * tickInterval;
  const yAxisMax = Math.ceil(maxValue / tickInterval) * tickInterval;
  const numTicks = Math.floor((yAxisMax - yAxisMin) / tickInterval) + 1;

  const getX = (index: number) => {
    // データポイントが1つしかない場合の対応
    if (props.data.length === 1) {
      return padding.left + chartWidth / 2;
    }
    const initialOffset = 10; // Y軸からの初期オフセット
    return padding.left + initialOffset + (index * ((chartWidth - initialOffset) / Math.max(1, props.data.length - 1)));
  };

  const getY = (value: number) => {
    // 値範囲がゼロの場合（すべての値が同じ）の対応
    if (yAxisMax === yAxisMin) {
      return padding.top + chartHeight / 2;
    }
    return padding.top + chartHeight - ((value - yAxisMin) / (yAxisMax - yAxisMin)) * chartHeight;
  };

  const generatePath = () => {
    if (props.data.length === 0) return '';

    return props.data.map((point, index) => {
      const x = getX(index);
      const y = getY(point.value);
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');
  };

  const updateData = () => {
    if (props.onUpdate) {
      props.onUpdate();
    } else {
      setAnimationState('update');
      // デフォルトの更新動作：ランダムな値で更新
      const newData = props.data.map(point => ({
        ...point,
        value: Math.floor(Math.random() * 100)
      }));
      setChartData(newData);

      // アニメーション後に更新状態をリセット
      setTimeout(() => {
        setAnimationState('none');
      }, 600);
    }
  };

  return (
    <div
      class={styles.lineChart}
      style={containerStyle}
      ref={setContainerRef}
    >
      {props.title && <h2 class={styles.title}>{props.title}</h2>}
      {props.description && <p class={styles.description}>{props.description}</p>}

      <div class={styles.chartContainer}>
        <svg
          class={styles.chart}
          viewBox={`0 0 ${size().width} ${size().height}`}
          preserveAspectRatio={shouldMaintainAspectRatio ? "xMidYMid" : "none"}
        >
          {/* グリッド線 */}
          <g class={styles.grid}>
            <For each={Array.from({ length: numTicks })}>
              {(_, index) => {
                const value = yAxisMin + (index() * tickInterval);
                const y = getY(value);
                const isZeroLine = Math.abs(value) < 0.0001; // 0との比較
                return (
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={size().width - padding.right}
                    y2={y}
                    class={isZeroLine ? styles.zeroLine : styles.gridLine}
                  />
                );
              }}
            </For>
          </g>

          {/* 縦軸（Y軸） */}
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={size().height - padding.bottom}
            class={styles.axis}
          />

          {/* 横軸（X軸） */}
          <line
            x1={padding.left}
            y1={getY(0)}
            x2={size().width - padding.right}
            y2={getY(0)}
            class={styles.axis}
          />

          {/* Y軸のラベル */}
          <For each={Array.from({ length: numTicks })}>
            {(_, index) => {
              const value = yAxisMin + (index() * tickInterval);
              const y = getY(value);
              return (
                <text
                  x={padding.left - 10}
                  y={y}
                  class={styles.axisLabel}
                  text-anchor="end"
                  dominant-baseline="middle"
                >
                  {value}
                </text>
              );
            }}
          </For>

          {/* X軸のラベル */}
          <For each={props.data}>
            {(point, index) => {
              const x = getX(index());
              return (
                <text
                  x={x}
                  y={size().height - (padding.bottom - 25)}
                  class={styles.axisLabel}
                  text-anchor="middle"
                >
                  {point.label}
                </text>
              );
            }}
          </For>

          {/* メインのライン */}
          <path
            d={generatePath()}
            class={styles.line}
            fill="none"
            data-animation={animationState()}
          />

          {/* データポイント */}
          <For each={chartData()}>
            {(point, index) => {
              const x = getX(index());
              const y = getY(point.value);
              return (
                <g
                  onMouseEnter={() => setActivePoint(index())}
                  onMouseLeave={() => setActivePoint(null)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r="6"
                    class={styles.point}
                    classList={{
                      [styles.active]: activePoint() === index()
                    }}
                    data-animation={animationState()}
                  />
                  {activePoint() === index() && (
                    <g class={styles.tooltip}>
                      <rect
                        x={x - 40}
                        y={y - 40}
                        width="80"
                        height="30"
                        rx="4"
                      />
                      <text
                        x={x}
                        y={y - 20}
                        text-anchor="middle"
                      >
                        {`${point.label}: ${point.value}`}
                      </text>
                    </g>
                  )}
                </g>
              );
            }}
          </For>
        </svg>

        {props.onUpdate && (
          <button class={styles.updateButton} onClick={updateData}>
            Update Data
          </button>
        )}
      </div>
    </div>
  );
};

export default LineChart;