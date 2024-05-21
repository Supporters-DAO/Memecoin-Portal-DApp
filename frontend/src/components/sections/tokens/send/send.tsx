'use client'

import React, { useEffect, useState } from 'react'
import { HexString } from '@gear-js/api'

import { BackButton } from '@/components/common/back-button'

import { useFetchBalances } from '@/lib/hooks/use-fetch-balances'
import { useAuth } from '@/lib/hooks/use-auth'
import { SendAdmin } from './send-admin'
import { SendUser } from './send-user'

export interface IToken {
	admins: HexString[]
	decimals: number
	id: HexString
	initialSupply: string
	maxSupply: string
	name: string
	symbol: string
}

export type Props = {
	token: IToken
}

export const SendCoin = ({ token }: Props) => {
	const { balances } = useFetchBalances()

	const { walletAccount } = useAuth()

	const tokenBalance =
		balances.find((b) => b.coin.id === token.id)?.balance || '0'

	const isAdmin = token.admins.find(
		(admin) => admin === walletAccount?.decodedAddress
	)
	return (
		<div className="ju my-10 flex items-start max-sm:flex-col">
			<BackButton />
			<div className="flex flex-col items-center gap-3 max-sm:w-full">
				<div className="flex items-center justify-between">
					<h1 className="text-[28px] text-primary max-sm:text-[16px]">Send</h1>
				</div>

				<div className="flex w-[660px] flex-col gap-6 rounded-[40px] bg-blue-light p-10 max-sm:py-10 max-sm:px-4 max-sm:w-full max-sm:rounded-[20px]">
					<h3 className="text-center uppercase">{token.name}</h3>
					<p className="text-center font-poppins text-[16px] font-medium text-primary">
						{parseFloat(tokenBalance).toLocaleString('us')} {token.symbol}
					</p>

					<div className="flex flex-col gap-3 font-poppins">
						Send to
						{isAdmin ? (
							<SendAdmin id={token.id} tokenBalance={tokenBalance} />
						) : (
							<>
								{walletAccount && (
									<SendUser
										id={token.id}
										from={walletAccount?.decodedAddress}
									/>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
