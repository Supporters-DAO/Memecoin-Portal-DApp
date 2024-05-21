import EnkryptSVG from './assets/enkrypt.svg'
import PolkadotSVG from './assets/polkadot.svg'
import SubWalletSVG from './assets/subwallet.svg'
import TalismanSVG from './assets/talisman.svg'
import NovaSVG from './assets/nova.svg'

import { Wallets } from './types'

declare global {
	interface Window {
		walletExtension: { isNovaWallet: boolean }
	}
}

const isNovaWallet = !!window?.walletExtension?.isNovaWallet

const WALLET = isNovaWallet
	? {
			'polkadot-js': { name: 'Nova Wallet', SVG: NovaSVG },
			'subwallet-js': { name: 'SubWallet', SVG: SubWalletSVG },
		}
	: {
			'polkadot-js': { name: 'Polkadot JS', SVG: PolkadotSVG },
			'subwallet-js': { name: 'SubWallet', SVG: SubWalletSVG },
			talisman: { name: 'Talisman', SVG: TalismanSVG },
			enkrypt: { name: 'Enkrypt', SVG: EnkryptSVG },
		}

const WALLETS = Object.entries(WALLET) as Wallets

export { WALLET, WALLETS, isNovaWallet }
