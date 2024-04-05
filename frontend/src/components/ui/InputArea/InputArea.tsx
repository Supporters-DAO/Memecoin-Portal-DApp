import cx from 'clsx';
import styles from './InputArea.module.scss';
import { InputProps } from './InputArea.interfaces';

function InputArea({ size = 'medium', error, label, ...props }: InputProps) {
  return (
    <>
      <span className={styles.label}>{label}</span>
      <div className={cx(styles.wrapper, styles[`size-${size}`], error && styles.error)}>
        <textarea {...props} className={cx(styles.input, error && styles.inputError)} />
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </>


  );
}

export { InputArea };
