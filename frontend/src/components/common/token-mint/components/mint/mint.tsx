'use client'

import { useAccount } from '@gear-js/react-hooks'
import { useEffect, useState } from 'react'

import { MintModal } from '../mint-modal'

export type ClassNameProps = {
	balance?: string
}
type Props = {
	isMintModalOpen?: boolean
	mintModalHandler?: (bool: boolean) => void
	available: number
	id: `0x${string}`
}

export function Mint({
	isMintModalOpen,
	mintModalHandler,
	available,
	id,
}: Props) {
	const { isAccountReady } = useAccount()

	const [isModalOpen, setIsModalOpen] = useState(isMintModalOpen || false)
	const openModal = () => mintModalHandler?.(true) || setIsModalOpen(true)
	const closeModal = () => mintModalHandler?.(false) || setIsModalOpen(false)

	useEffect(() => {
		if (isMintModalOpen !== undefined) {
			setIsModalOpen(isMintModalOpen)
		}
	}, [isMintModalOpen])

	if (!isAccountReady) return null

	return (
		<>
			<MintModal
				onClose={closeModal}
				open={isModalOpen}
				// setOpen={openModal}
				available={available}
				id={id}
			/>
		</>
	)
}
