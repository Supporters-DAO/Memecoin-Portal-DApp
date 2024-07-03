'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { GearApiProvider } from '@/components/providers/gear-api'
import { useWalletOpenState } from '@/components/common/wallet-new/components/wallet/wallet.atoms'
import { useAuth } from '@/lib/hooks/use-auth'

const LazyCreateButton = dynamic(
	() =>
		import('@/components/common/create-button').then((mod) => mod.CreateButton),
	{ ssr: false }
)

export function CreateButtonLazy() {
	const [openState, setOpenState] = useWalletOpenState()
	const { isLoadingWallet } = useAuth()
	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setIsReady(true)
		}
	}, [])

	if (!isReady || isLoadingWallet) return null

	return (
		<GearApiProvider>
			<LazyCreateButton walletModalHandler={setOpenState} />
		</GearApiProvider>
	)
}
