'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { GearApiProvider } from '@/components/providers'

const LazyWallet = dynamic(
	() => import('@/components/common/wallet-new').then((mod) => mod.Wallet),
	{ ssr: false }
)

export function WalletLazy() {
	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setIsReady(true)
		}
	}, [])

	if (!isReady) return null

	return (
		<GearApiProvider>
			<LazyWallet />
		</GearApiProvider>
	)
}
