import { AlertProps } from './alert.types'
import styles from './alert.module.scss'
import { Sprite } from '../sprite'
import { cn } from '@/lib/utils'

export function Alert({ alert, close }: AlertProps) {
	const { content, options } = alert
	const { type, title, style, isClosed } = options

	return (
		<div className={styles.alert} style={style}>
			<div className={cn(styles.header, styles[type])}>
				{title || type}
				{isClosed && (
					<Sprite
						onClick={close}
						name="close"
						className="ml-auto size-5 cursor-pointer"
						color="#fff"
					/>
				)}
			</div>
			<div className={styles.body}>{content}</div>
		</div>
	)
}

export { styles as alertStyles }
