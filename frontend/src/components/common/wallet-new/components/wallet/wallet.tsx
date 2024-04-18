'use client'

import { useAccount } from '@gear-js/react-hooks'
import { useEffect, useState } from 'react'

import { AccountButton } from '../account-button'
import { WalletModal } from '../wallet-modal'
import styles from './wallet.module.scss'
import { VaraBalance } from '@/components/common/wallet-new'
import { useAuth } from '@/lib/hooks/use-auth'

export type ClassNameProps = {
	balance?: string
}
type Props = {
	isWalletModalOpen?: boolean
	walletModalHandler?: (bool: boolean) => void
	className?: ClassNameProps
}

export function Wallet({
	isWalletModalOpen,
	walletModalHandler,
	className,
}: Props) {
	const { setWalletAccount, setsAccountReadyAtom } = useAuth()

	const { account, isAccountReady } = useAccount()

	const [isModalOpen, setIsModalOpen] = useState(isWalletModalOpen || false)
	const openModal = () => walletModalHandler?.(true) || setIsModalOpen(true)
	const closeModal = () => walletModalHandler?.(false) || setIsModalOpen(false)

	useEffect(() => {
		setWalletAccount(account)
	}, [account])

	useEffect(() => {
		setsAccountReadyAtom(isAccountReady)
	}, [isAccountReady])

	useEffect(() => {
		if (isWalletModalOpen !== undefined) {
			setIsModalOpen(isWalletModalOpen)
		}
	}, [isWalletModalOpen])

	if (!isAccountReady) return null

	return (
		<>
			<div className={styles.wallet}>
				<VaraBalance className={className?.balance} />
				{account ? (
					<div className={styles.accountButton}>
						<AccountButton
							address={account.address}
							name={account.meta.name}
							onClick={openModal}
							className="cursor-pointer rounded-lg border-2 border-primary bg-[#0F1B34] p-4 px-6 text-xs font-bold text-primary"
						/>
					</div>
				) : (
					<button
						className="btn btn--outline min-h-11 p-4 text-[9px] leading-none text-primary sm:min-h-0 sm:text-xs md:px-6"
						onClick={openModal}
					>
						Connect Wallet
					</button>
				)}
			</div>

			<WalletModal
				onClose={closeModal}
				open={isModalOpen}
				setOpen={openModal}
			/>
		</>
	)
}
