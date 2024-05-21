import { WALLET } from './consts'
import { StaticImageData } from 'next/image'

export type WalletValue = {
	name: string
	SVG: StaticImageData
}

type WalletId = keyof typeof WALLET

type Wallets = [WalletId, WalletValue][]

export type { WalletId, Wallets }
