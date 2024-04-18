'use client'

import React, { useState } from 'react'
import { HexString } from '@gear-js/api'

import { Input } from '@/components/ui/input'
import { isValidHexString } from '@/lib/utils'
import { useMessageToken } from '@/lib/hooks/use-message-token'
import { redirect, useRouter } from 'next/navigation'

type Props = {
	id: HexString
	from: HexString
}

export const SendUser = ({ id, from }: Props) => {
	const router = useRouter()

	const handleMessage = useMessageToken(id)
	const [isPending, setIsPending] = useState(false)
	const [address, setAddress] = useState<HexString>()
	const [inputAmount, setInputAmount] = useState<number>(0)

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAddress(e.target.value as HexString)
	}

	const onSendCoins = () => {
		if (address && inputAmount && isValidHexString(address)) {
			setIsPending(true)
			handleMessage({
				payload: {
					Transfer: {
						from,
						to: address,
						amount: inputAmount,
					},
				},
				onSuccess: () => {
					setIsPending(false)
					setAddress(undefined)
					setInputAmount(0)
					router.push(`/tokens/${id}`)
				},
				onError: () => {
					setIsPending(false)
				},
			})
		}
	}

	return (
		<>
			<Input
				label=""
				placeholder="Add one address"
				onChange={handleInputChange}
			/>
			<div className="mt-3">
				<Input
					label="Amount"
					placeholder="Set amount"
					type="number"
					onChange={(e) => setInputAmount(Number(e.target.value))}
				/>
			</div>
			<button
				className="btn mx-auto mt-5 w-1/2 py-4 disabled:bg-[#D0D3D9]"
				disabled={
					address?.length === 0 ||
					!inputAmount ||
					inputAmount <= 0 ||
					isPending ||
					(address && !isValidHexString(address))
				}
				onClick={onSendCoins}
			>
				{isPending ? (
					<span className="mx-auto flex w-max">
						Pending
						<span className="w-full after:flex after:animate-dots after:content-['']"></span>
					</span>
				) : (
					'Send'
				)}
			</button>
		</>
	)
}
