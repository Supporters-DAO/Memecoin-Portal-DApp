import EnkryptSVG from './assets/enkrypt.svg?react'
import PolkadotSVG from './assets/polkadot.svg?react'
import SubWalletSVG from './assets/subwallet.svg?react'
import TalismanSVG from './assets/talisman.svg?react'
import NovaSVG from './assets/nova.svg'

import { Wallets } from './types'

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
