import { Component, JSX, createSignal, createEffect } from 'solid-js';
import styles from './Form.module.css';
import { Button } from '../Button';

export interface FormProps {
  onSubmit?: (e: Event) => void;
  children?: JSX.Element;
  class?: string;
}

export const Form: Component<FormProps> = (props) => {
  return (
    <form 
      class={`${styles.formCard} ${props.class || ''}`}
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit?.(e);
      }}
    >
      {props.children}
    </form>
  );
};

export interface FormSectionProps {
  title?: string;
  subtitle?: string;
  children?: JSX.Element;
  class?: string;
}

export const FormSection: Component<FormSectionProps> = (props) => {
  return (
    <div class={`${styles.formSection} ${props.class || ''}`}>
      {props.title && <h2 class="futuristic-text">{props.title}</h2>}
      {props.subtitle && <p>{props.subtitle}</p>}
      <div class={styles.formGrid}>
        {props.children}
      </div>
    </div>
  );
};

// export interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
// }

// export const Input: Component<InputProps> = (props) => {
//   const { label, ...inputProps } = props;
//   return (
//     <div>
//       {label && <label>{label}</label>}
//       <input
//         {...inputProps}
//         class={`${styles.input} ${props.class || ''}`}
//       />
//     </div>
//   );
// };

export interface TextAreaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const TextArea: Component<TextAreaProps> = (props) => {
  const { label, ...textareaProps } = props;
  return (
    <div>
      {label && <label>{label}</label>}
      <textarea
        {...textareaProps}
        class={`${styles.input} ${props.class || ''}`}
      />
    </div>
  );
};

export interface CheckboxProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  onClick?: JSX.EventHandlerUnion<HTMLInputElement, MouseEvent>;
}

export const Checkbox: Component<CheckboxProps> = (props) => {
  const { label, checked, onChange, ...checkboxProps } = props;
  
  // 親コンポーネントから渡されるcheckedプロパティを監視するシグナルを作成
  const [isChecked, setIsChecked] = createSignal(checked || false);
  
  // 親コンポーネントからcheckedプロパティが変更された場合も内部状態を更新
  createEffect(() => {
    if (checked !== undefined) {
      setIsChecked(checked);
    }
  });
  
  // チェック状態が変更された時の処理
  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setIsChecked(target.checked);
    // 親コンポーネントに変更を通知
    if (onChange && typeof onChange === 'function') {
      onChange(e as Event & { currentTarget: HTMLInputElement; target: HTMLInputElement });
    }
  };

  return (
    <label class={styles.checkboxLabel}>
      <span class={styles.checkboxContainer}>
        <input
          type="checkbox"
          checked={isChecked()}
          onChange={handleChange}
          {...checkboxProps}
          class={`${styles.checkbox} ${props.class || ''}`}
        />
        <span class={styles.checkmark} />
      </span>
      {label}
    </label>
  );
};