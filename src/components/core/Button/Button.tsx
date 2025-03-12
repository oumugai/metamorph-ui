import { Component, JSX, createSignal } from 'solid-js';
import { useStyles } from '../../../hooks/useStyles';
import moduleStyles from './Button.module.css';

interface ButtonProps {
  children: JSX.Element;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  class?: string;
  style?: JSX.CSSProperties;
}

export const Button: Component<ButtonProps> = (props) => {
  const styles = useStyles(moduleStyles);
  const [buttonRef, setButtonRef] = createSignal<HTMLButtonElement>();

  const handleClick: JSX.EventHandler<HTMLButtonElement, MouseEvent> = (event) => {
    const button = buttonRef();
    if (button) {
      // クリック時のアニメーション
      button.style.transform = 'translateY(2px) scale(0.98)';
      button.style.transition = 'transform 0.15s cubic-bezier(0.25, 0.1, 0.25, 1)';

      // 150ms後に元の状態に戻す
      setTimeout(() => {
        button.style.transform = '';
        button.style.transition = '';
      }, 150);
    }

    // 元のonClickハンドラを呼び出す
    if (typeof props.onClick === 'function') {
      props.onClick(event);
    }
  };

  return (
    <button
      ref={setButtonRef}
      class={`
        ${styles.button}
        ${props.variant ? styles[props.variant] : styles.primary}
        ${props.size ? styles[props.size] : styles.md}
        ${props.disabled ? styles.disabled : ''}
        ${props.class || ''}
      `}
      type={props.type || 'button'}
      disabled={props.disabled}
      onClick={handleClick}
      style={props.style}
    >
      {props.children}
    </button>
  );
};

// 既にコンポーネントは直接エクスポートされているため、
// この行は不要になります