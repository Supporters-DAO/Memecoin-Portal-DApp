import React from 'react' // Добавляем импорт React
import styles from './Input.module.scss'
import { cn } from '@/lib/utils'

type Props = {
	name: string
	label: string
	placeholder?: string
	type?: string
	error?: string | undefined
}

const Input: React.FC<Props> = ({
	error,
	label,
	placeholder,
	type = 'text',
}) => {
	return (
		<>
			<span className={styles.label}>{label}</span>
			<div className={cn(styles.wrapper, error && styles.error)}>
				<label className="w-full">
					<input
						type={type}
						className={cn(styles.input, error && styles.inputError)}
						placeholder={placeholder}
					/>
				</label>
			</div>
			{error && <p className={styles.error}>{error}</p>}
		</>
	)
}

export { Input }
