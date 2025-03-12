import { Component, JSX, onCleanup, onMount } from 'solid-js';

// スタイルをキャッシュするためのMap
const styleCache = new Map<string, HTMLStyleElement>();

// スタイルを注入する関数
function injectStyles(css: string, id: string): void {
  if (styleCache.has(id)) {
    return; // 既に注入済みの場合は何もしない
  }

  const style = document.createElement('style');
  style.textContent = css;
  style.dataset.metamorphId = id;
  document.head.appendChild(style);
  styleCache.set(id, style);
}

// スタイルを削除する関数
function removeStyles(id: string): void {
  const style = styleCache.get(id);
  if (style) {
    style.remove();
    styleCache.delete(id);
  }
}

// HOCの型定義
type WithStylesOptions = {
  memoise?: boolean; // スタイルをメモ化するかどうか
};

/**
 * コンポーネントにスタイルを統合するための高階コンポーネント
 * @param Component ラップするコンポーネント
 * @param styles CSSモジュールのスタイル
 * @param options オプション設定
 */
export function withStyles<T extends Record<string, unknown>>(
  Component: Component<T>,
  styles: { [key: string]: string },
  options: WithStylesOptions = { memoise: true }
): Component<T & JSX.HTMLAttributes<any>> {
  // CSSモジュールのクラス名からCSSの内容を抽出
  const cssContent = Object.values(styles).join('\n');
  const styleId = `metamorph-${Math.random().toString(36).slice(2)}`;

  return (props: T) => {
    onMount(() => {
      injectStyles(cssContent, styleId);
    });

    // メモ化しない場合は、アンマウント時にスタイルを削除
    if (!options.memoise) {
      onCleanup(() => {
        removeStyles(styleId);
      });
    }

    return <Component {...props} />;
  };
}

// 型のエクスポート
export type { WithStylesOptions };