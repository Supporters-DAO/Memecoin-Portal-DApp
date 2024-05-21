import styles from './InputArea.module.scss'
import { cn } from '@/lib/utils'
import { TextareaHTMLAttributes } from 'react'

export interface Props
	extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
	size?: 'large' | 'medium' | 'small'
	label?: string
	error?: any
}

function InputArea({ size = 'medium', error, label, ...props }: Props) {
	return (
		<>
			<span className={styles.label}>{label}</span>
			<div
				className={cn(
					styles.wrapper,
					styles[`size-${size}`],
					error && styles.error
				)}
			>
				<textarea
					{...props}
					className={cn(styles.input, error && styles.inputError)}
				/>
			</div>
			{error && <p className={styles.error}>{error}</p>}
		</>
	)
}

export { InputArea }
