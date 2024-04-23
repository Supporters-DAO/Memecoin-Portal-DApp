import clsx from 'clsx'
import styles from './Input.module.scss'

type Props = {
	label: string
	placeholder?: string
	type?: string
	error?: string | undefined
	className?: string
	onChange?: (e: any) => void
	value?: string
	onBlur?: (e: any) => void
	autoFocus?: boolean
}

export function Input({
	error,
	label,
	placeholder,
	type = 'text',
	className,
	value,
	onBlur,
	autoFocus = false,
	...props
}: Props) {
	return (
		<div className={className}>
			<span className={styles.label}>{label}</span>
			<div className={clsx(styles.wrapper, error && styles.error)}>
				<label className="w-full">
					<input
						type={type}
						className={clsx(styles.input, error && styles.inputError)}
						placeholder={placeholder}
						onBlur={onBlur}
						autoFocus
						{...props}
					/>
				</label>
			</div>
			{error && <p className={styles.error}>{error}</p>}
		</div>
	)
}
