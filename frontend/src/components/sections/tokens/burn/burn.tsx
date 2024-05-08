'use client'

import React, { useState } from 'react'
import { HexString } from '@gear-js/api'

import { Input } from '@/components/ui/input'
import { BackButton } from '@/components/common/back-button'

import { useMessages } from '@/lib/sails/use-send-message-ft'
import { useFetchBalances } from '@/lib/hooks/use-fetch-balances'
import { useAuth } from '@/lib/hooks/use-auth'
import { Hero404 } from '../../404/hero'
import action from '@/app/actions'
import { useRouter } from 'next/navigation'
import { TooltipContainer } from '@/components/ui/tooltip'
import { Sprite } from '@/components/ui/sprite'

export interface IToken {
	admins: HexString[]
	id: HexString
	name: string
	symbol: string
	createdBy: HexString
}

type Props = {
	token: IToken
}

export const BurnCoin = ({ token }: Props) => {
	const router = useRouter()
	const { walletAccount } = useAuth()
	const [isPending, setIsPending] = useState(false)
	const { balances } = useFetchBalances(isPending)

	const [inputAmount, setInputAmount] = useState<number | undefined>(undefined)
	const sendMessage = useMessages()

	const tokenBalance = balances.find((b) => b.coin.id === token.id)?.balance

	const isAdmin = walletAccount?.decodedAddress === token.createdBy

	if (!isAdmin) return <Hero404 />

	const onSendCoins = async () => {
		if (inputAmount) {
			setIsPending(true)

			const sendMessageResult = await sendMessage('burn', token.id, {
				value: inputAmount,
				from: walletAccount.decodedAddress,
			}).finally(() => {
				setInputAmount(undefined)
				setIsPending(false)
			})

			if (sendMessageResult) {
				action('token')
				action('balance')
				router.push(`/tokens/${token.id}`)
			}
		}
	}

	const disableBurnButton =
		!inputAmount ||
		inputAmount <= 0 ||
		isPending ||
		(tokenBalance && parseFloat(tokenBalance) <= 0)

	return (
		<div className="ju my-10 flex items-start">
			<BackButton />
			<div className="flex flex-col items-center gap-3">
				<div className="flex items-center justify-between">
					<h1 className="text-[28px] text-primary">Burn</h1>
				</div>

				<div className="flex w-[660px] flex-col gap-6 rounded-[40px] bg-blue-light p-10">
					<h3 className="text-center uppercase">{token.name}</h3>
					<p className="text-center font-poppins text-[16px] font-medium text-primary">
						{tokenBalance && parseFloat(tokenBalance).toLocaleString('us')}{' '}
						{token.symbol}
					</p>

					<div className="flex flex-col gap-3 font-poppins">
						<div className="">
							<div className="flex items-center gap-1">
								Amount
								<TooltipContainer
									trigger={
										<>
											<Sprite
												name="question"
												className="size-4 text-[#FDFDFD]/[40%]"
											/>
										</>
									}
								>
									<p className="max-w-60 text-center">
										Сan`t be greater than total supply
									</p>
								</TooltipContainer>
							</div>
							<div className="flex gap-3">
								<Input
									label=""
									placeholder="Set amount"
									type="number"
									onChange={(e) => setInputAmount(Number(e.target.value))}
									className="w-full"
									value={inputAmount || ''}
								/>
								{/* {tokenBalance && (
									<button
										className="mt-1 rounded-lg bg-[#2E3B55] px-6 py-3"
										onClick={() => {
											setInputAmount(Number(tokenBalance))
										}}
									>
										All
									</button>
								)} */}
							</div>
						</div>
					</div>
					<button
						className="btn mx-25 py-4 disabled:bg-[#D0D3D9]"
						disabled={!!disableBurnButton}
						onClick={onSendCoins}
					>
						{isPending ? (
							<span className="mx-auto flex w-1/2">
								Pending
								<span className="w-full after:flex after:animate-dots after:content-['']"></span>
							</span>
						) : (
							'Burn'
						)}
					</button>
				</div>
			</div>
		</div>
	)
}
