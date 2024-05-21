'use client'

import React, { useState } from 'react'
import { HexString, decodeAddress } from '@gear-js/api'

import { Input } from '@/components/ui/input'
import { isValidHexString } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import action from '@/app/actions'
import { useMessages } from '@/lib/sails/use-send-message-ft'

type Props = {
	id: HexString
	from: HexString
}

export const SendUser = ({ id, from }: Props) => {
	const router = useRouter()

	const [isPending, setIsPending] = useState(false)
	const [address, setAddress] = useState<string | HexString>()
	const [inputAmount, setInputAmount] = useState<number>(0)

	const sendMessage = useMessages()

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAddress(e.target.value as string)
	}

	const onSendCoins = async () => {
		if (address && inputAmount && isValidHexString(decodeAddress(address))) {
			setIsPending(true)
			const sendMessageResult = await sendMessage('transfer', id, {
				value: inputAmount,
				to: decodeAddress(address),
			}).finally(() => setIsPending(false))

			if (sendMessageResult) {
				setAddress(undefined)
				setInputAmount(0)
				action('token')
				action('balance')
				router.push(`/tokens/${id}`)
			}
		}
	}

	return (
		<>
			<Input
				label=""
				value={address}
				placeholder="Add one address"
				onChange={handleInputChange}
			/>
			<div className="mt-3">
				<Input
					value={inputAmount}
					label="Amount"
					placeholder="Set amount"
					type="number"
					onChange={(e) => setInputAmount(Number(e.target.value))}
				/>
			</div>
			<button
				className="btn mx-auto mt-5 w-1/2 py-4 font-ps2p disabled:bg-[#D0D3D9]"
				disabled={
					address?.length === 0 || !inputAmount || inputAmount <= 0 || isPending
				}
				onClick={onSendCoins}
			>
				{isPending ? (
					<span className="mx-auto flex w-max">
						Pending
						<span className="w-6 after:flex after:animate-dots after:content-['']"></span>
					</span>
				) : (
					'Send'
				)}
			</button>
		</>
	)
}
