import clsx from 'clsx'
import { AlertProps } from './alert.types'
import styles from './alert.module.scss'
import { Sprite } from '../sprite'
// import { Button } from '../button';
// import { CrossIcon } from '@/assets/images';

export function Alert({ alert, close }: AlertProps) {
	const { content, options } = alert
	const { type, title, style, isClosed } = options

	return (
		<div className={styles.alert} style={style}>
			<div className={clsx(styles.header, styles[type])}>
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
