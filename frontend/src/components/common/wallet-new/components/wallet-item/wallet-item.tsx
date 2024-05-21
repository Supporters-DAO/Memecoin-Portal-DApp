import styles from './wallet-item.module.scss'
import { WalletItemProps } from './wallet-item.interfaces'
import Image from 'next/image'
import { cn } from '@/lib/utils'

function WalletItem({ icon, name, size = 40, className }: WalletItemProps) {
	return (
		<span className={styles.wallet}>
			<Image
				src={icon}
				alt={name}
				width={size}
				height={size}
				className={cn(styles.icon, className)}
			/>
			{name}
		</span>
	)
}

export { WalletItem }
