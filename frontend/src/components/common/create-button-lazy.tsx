'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { GearApiProvider } from '@/components/providers/gear-api'
import { useWalletOpenState } from '@/components/common/wallet-new/components/wallet/wallet.atoms'

const LazyCreateButton = dynamic(
	() =>
		import('@/components/common/create-button').then((mod) => mod.CreateButton),
	{ ssr: false }
)

export function CreateButtonLazy() {
	const [openState, setOpenState] = useWalletOpenState()

	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setIsReady(true)
		}
	}, [])

	if (!isReady) return null

	return (
		<GearApiProvider>
			<LazyCreateButton walletModalHandler={setOpenState} />
		</GearApiProvider>
	)
}
