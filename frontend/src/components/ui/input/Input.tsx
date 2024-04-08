import styles from './Input.module.scss'
import { cn } from '@/lib/utils'

type Props = {
	label: string
	placeholder?: string
	type?: string
	error?: string | undefined
	className?: string
}

export function Input({
	error,
	label,
	placeholder,
	type = 'text',
	className,
	...props
}: Props) {
	return (
		<div className={className}>
			<span className={styles.label}>{label}</span>
			<div className={cn(styles.wrapper, error && styles.error)}>
				<label className="w-full">
					<input
						type={type}
						className={cn(styles.input, error && styles.inputError)}
						placeholder={placeholder}
						{...props}
					/>
				</label>
			</div>
			{error && <p className={styles.error}>{error}</p>}
		</div>
	)
}
