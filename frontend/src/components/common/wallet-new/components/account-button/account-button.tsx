import Identicon from '@polkadot/react-identicon'
import cx from 'clsx'

import styles from './account-button.module.scss'

type Props = {
	name: string | undefined
	address: string | undefined
	className?: string
	onClick: () => void
}

function AccountButton({ address, name, className, onClick }: Props) {
	return (
		<button
			type="button"
			color="dark"
			className={cx(styles.button, className)}
			onClick={onClick}
		>
			<Identicon value={address} size={16} theme="polkadot" />
			<span>{name}</span>
		</button>
	)
}

export { AccountButton }
