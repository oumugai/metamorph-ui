import { onCleanup, onMount } from 'solid-js';

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

interface UseStylesOptions {
  memoise?: boolean;
}

/**
 * スタイルを管理するためのカスタムフック
 * @param styles CSSモジュールのスタイル
 * @param options オプション設定
 */
export function useStyles(
  styles: { [key: string]: string },
  options: UseStylesOptions = { memoise: true }
): { [key: string]: string } {
  const cssContent = Object.values(styles).join('\n');
  const styleId = `metamorph-${Math.random().toString(36).slice(2)}`;

  onMount(() => {
    injectStyles(cssContent, styleId);
  });

  if (!options.memoise) {
    onCleanup(() => {
      removeStyles(styleId);
    });
  }

  return styles;
}