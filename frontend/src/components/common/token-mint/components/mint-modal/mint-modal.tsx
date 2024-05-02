import React, { useState } from 'react'

import { Sprite } from '@/components/ui/sprite'
import { Dialog } from '@headlessui/react'
import { AnimatePresence, motion } from 'framer-motion'
import { variantsOverlay, variantsPanel } from './mint-modal.variants'

import styles from './mint-modal.module.scss'
import { Input } from '@/components/ui/input'
import { useMessageToken } from '@/lib/hooks/use-message-token'
import { useAuth } from '@/lib/hooks/use-auth'
import action from '@/app/actions'

export const MintModal = ({ onClose, open, setOpen, id, available }: any) => {
	const { walletAccount } = useAuth()
	const handleMessage = useMessageToken(id)
	const [isPending, setIsPending] = useState(false)
	const [inputAmount, setInputAmount] = useState<number>()

	const onMintTokens = () => {
		if (inputAmount && walletAccount) {
			setIsPending(true)
			handleMessage({
				payload: {
					Mint: {
						amount: inputAmount,
						to: walletAccount.decodedAddress,
					},
				},
				onSuccess: () => {
					action('token')
					setIsPending(false)
					setInputAmount(undefined)
					onClose()
				},
				onError: () => {
					setInputAmount(undefined)
					setIsPending(false)
				},
			})
		}
	}

	const disableBurnButton =
		!inputAmount || inputAmount <= 0 || isPending || inputAmount > available

	return (
		<div>
			<AnimatePresence initial={false}>
				{open && (
					<Dialog
						as={motion.div}
						initial="closed"
						animate="open"
						exit="closed"
						static
						className={styles.modal}
						open={open}
						onClose={onClose}
					>
						<motion.div
							variants={variantsOverlay}
							className={styles.backdrop}
						/>

						<div className={styles.wrapper}>
							<div className={styles.container}>
								<Dialog.Panel
									as={motion.div}
									variants={variantsPanel}
									className={styles.modalContent}
								>
									<div className={styles.header}>
										<Dialog.Title as="h2" className={styles.title}>
											Mint tokens
										</Dialog.Title>
										<button className={styles.close} onClick={onClose}>
											<Sprite
												name="close"
												size={24}
												className={styles.svgIcon}
											/>
										</button>
									</div>
									<div className={styles.body}>
										<Input
											label="Amount"
											placeholder="Set amount"
											type="number"
											onChange={(e) => setInputAmount(Number(e.target.value))}
										/>
										<div className={styles.available}>
											Available:
											<span className={styles.availableCount}>{available}</span>
										</div>
									</div>
									<div className={styles.button}>
										<button
											className="btn w-full py-4 font-ps2p disabled:bg-[#D0D3D9]"
											disabled={disableBurnButton}
											onClick={onMintTokens}
										>
											{isPending ? (
												<span className="flex w-full">
													Pending
													<span className="w-full after:flex after:animate-dots after:content-['']"></span>
												</span>
											) : (
												'Mint'
											)}
										</button>
									</div>
								</Dialog.Panel>
							</div>
						</div>
					</Dialog>
				)}
			</AnimatePresence>
		</div>
	)
}
