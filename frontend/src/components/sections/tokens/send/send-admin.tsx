'use client'

import React, { useState } from 'react'
import { HexString } from '@gear-js/api'

import { Sprite } from '@/components/ui/sprite'
import { ScrollArea } from '@/components/common/scroll-area'
import { Input } from '@/components/ui/input'
import { isValidHexString } from '@/lib/utils'

import { useMessageToken } from '@/lib/hooks/use-message-token'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/use-auth'
import action from '@/app/actions'

type Props = {
	id: HexString
}

export const SendAdmin = ({ id }: Props) => {
	const { walletAccount } = useAuth()
	const handleMessage = useMessageToken(id)
	const router = useRouter()

	const [isPending, setIsPending] = useState(false)
	const [addresses, setAddresses] = useState<HexString[]>([])
	const [inputValue, setInputValue] = useState<HexString | ''>('')
	const [inputAmount, setInputAmount] = useState<number>()

	const isScrollable = (addresses?.length || 0) > 6

	const handleAddAddress = () => {
		if (inputValue && isValidHexString(inputValue)) {
			if (!addresses.includes(inputValue)) {
				setAddresses([...addresses, inputValue])
				setInputValue('')
			}
		}
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value as HexString)
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			handleAddAddress()
		}
	}

	const handleDeleteAddress = (index: number) => {
		setAddresses((currentAddresses) =>
			currentAddresses.filter((_, i) => i !== index)
		)
	}

	const onSendCoins = () => {
		if (inputAmount && walletAccount) {
			setIsPending(true)
			handleMessage({
				payload: {
					TransferToUsers: {
						amount: inputAmount,
						to_users: [...addresses],
					},
				},
				onSuccess: () => {
					setIsPending(false)
					setAddresses([])
					setInputAmount(undefined)
					action('token')
					action('balance')
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
			<div className="flex max-h-[354px] flex-col gap-2 rounded-lg border-2 border-[#2E3B55] bg-[#0F1B34]/[40%] px-4 py-3">
				<ScrollArea className="pr-4" type={isScrollable ? 'always' : undefined}>
					<div className="grid gap-2">
						{addresses.map((address, index) => (
							<div
								key={index}
								className="flex items-center justify-between truncate rounded-lg border-2 border-[#2E3B55] bg-[#0F1B34]/[40%] px-4 py-2"
							>
								<span className="inline-grid truncate">
									<span className="truncate">{address}</span>
								</span>
								<Sprite
									name="close"
									size={15}
									onClick={() => handleDeleteAddress(index)}
								/>
							</div>
						))}
						<input
							value={inputValue}
							placeholder="Add one or more addresses"
							className="border-none bg-transparent outline-none"
							onChange={handleInputChange}
							onKeyDown={handleKeyDown}
						/>
					</div>
				</ScrollArea>
			</div>
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
					addresses.length === 0 ||
					!inputAmount ||
					inputAmount <= 0 ||
					isPending
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
