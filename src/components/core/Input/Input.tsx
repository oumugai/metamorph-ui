import { Component, JSX, createSignal } from 'solid-js';
import { useStyles } from '../../../hooks/useStyles';
import moduleStyles from './Input.module.css';

type InputEventHandler = JSX.EventHandler<HTMLInputElement, FocusEvent>;

export interface InputProps {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onInput?: JSX.EventHandlerUnion<HTMLInputElement, InputEvent>;
  onChange?: JSX.EventHandlerUnion<HTMLInputElement, Event>;
  onFocus?: InputEventHandler;
  onBlur?: InputEventHandler;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  icon?: JSX.Element;
  class?: string;
  style?: JSX.CSSProperties;
}

export const Input: Component<InputProps> = (props) => {
  const styles = useStyles(moduleStyles);
  const [isHovered, setIsHovered] = createSignal(false);
  const [isFocused, setIsFocused] = createSignal(false);
  const [transform, setTransform] = createSignal('translateY(0)');

  const updateTransform = () => {
    if (isFocused()) {
      setTransform('translateY(-2px)');
    } else if (isHovered()) {
      setTransform('translateY(-1px)');
    } else {
      setTransform('translateY(0)');
    }
  };

  const handleFocus: InputEventHandler = (e) => {
    setIsFocused(true);
    updateTransform();
    props.onFocus?.(e);
  };

  const handleBlur: InputEventHandler = (e) => {
    setIsFocused(false);
    updateTransform();
    props.onBlur?.(e);
  };

  const handleMouseEnter: JSX.EventHandler<HTMLInputElement, MouseEvent> = () => {
    setIsHovered(true);
    updateTransform();
  };

  const handleMouseLeave: JSX.EventHandler<HTMLInputElement, MouseEvent> = () => {
    setIsHovered(false);
    updateTransform();
  };

  return (
    <div
      class={`
        ${styles.inputContainer}
        ${props.error ? styles.error : ''}
        ${props.disabled ? styles.disabled : ''}
        ${props.class || ''}
      `}
      style={props.style}
    >
      {props.label && (
        <label class={styles.label}>
          {props.label}
        </label>
      )}

      <div class={styles.inputWrapper}>
        {props.icon && (
          <div class={styles.icon}>
            {props.icon}
          </div>
        )}
        
        <input
          type={props.type || 'text'}
          class={`
            ${styles.input}
            ${props.size ? styles[props.size] : styles.md}
            ${props.icon ? styles.withIcon : ''}
          `}
          value={props.value}
          placeholder={props.placeholder}
          disabled={props.disabled}
          onInput={props.onInput}
          onChange={props.onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            'transform': transform(),
            'transition': 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)'
          }}
        />
      </div>

      {(props.helperText || props.error) && (
        <div class={styles.helperText}>
          {props.error || props.helperText}
        </div>
      )}
    </div>
  );
};