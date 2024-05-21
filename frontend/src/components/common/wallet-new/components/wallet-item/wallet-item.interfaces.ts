import { StaticImageData } from 'next/image'

export type WalletItemProps = {
	icon: StaticImageData
	name: string
	size?: number
	className?: string
}
