import { InputProps } from '@gear-js/ui';
import clsx from 'clsx';
// import { ReactComponent as SearchSVG } from '@/assets/images/icons/search.svg';
import styles from './Input.module.scss';

function Input({ error, value, onChange, label, placeholder, type = "text" }: InputProps) {
  return (
    <>
      <span className={styles.label}>{label}</span>
      <div className={clsx(styles.wrapper, error && styles.error)}>
        <label className='w-full'>
          <input type={type} className={clsx(styles.input, error && styles.inputError)} placeholder={placeholder} onChange={onChange} value={value} />
        </label>
      </div>
      {error && <p className={styles.error}>{error}</p>}
    </>
  );
}

export { Input };