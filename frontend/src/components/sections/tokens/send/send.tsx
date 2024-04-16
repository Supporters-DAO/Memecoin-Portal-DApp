'use client'

import React, { useState } from 'react'
import { HexString } from '@gear-js/api'

import { Sprite } from '@/components/ui/sprite'
import { ScrollArea } from '@/components/common/scroll-area'
import { Input } from '@/components/ui/input'
import { BackButton } from '@/components/common/back-button'
import { isValidHexString } from '@/lib/utils'
import { useMessageToken } from './hooks/use-message'

export interface IToken {
	admins: HexString[]
	decimals: number
	id: HexString
	initialSupply: string
	maxSupply: string
	name: string
	symbol: string
}

type Props = {
	token: IToken
}

export const SendCoin = ({ token }: Props) => {
	const [addresses, setAddresses] = useState<HexString[]>([])
	const [inputValue, setInputValue] = useState<HexString | ''>('')
	const [inputAmount, setInputAmount] = useState<number>()
	const isScrollable = (addresses?.length || 0) > 6
	const handleMessage = useMessageToken(token.id)

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
		if (inputAmount) {
			handleMessage({
				payload: {
					TransferToUsers: {
						amount: inputAmount,
						to_users: [...addresses],
					},
				},
				onInBlock: () => {
					console.log('onInBlock')
				},
				onSuccess: () => {
					// setIsCreated(true)
					console.log('onSuccess')
				},
				onError: () => {
					// setIsPending(false);
				},
			})
		}
	}

	return (
		<div className="ju my-10 flex items-start">
			<BackButton />
			<div className="flex flex-col items-center gap-3">
				<div className="flex items-center justify-between">
					<h1 className="text-[28px] text-primary">Send</h1>
				</div>

				<div className="flex w-[660px] flex-col gap-6 rounded-[40px] bg-blue-light p-10">
					<h3 className="text-center uppercase">{token.name}</h3>
					<p className="text-center font-poppins text-[16px] font-medium text-primary">
						{token.initialSupply} {token.symbol}
					</p>

					<div className="flex flex-col gap-3 font-poppins">
						Send to
						<div className="flex max-h-[354px] flex-col gap-2 rounded-lg border-2 border-[#2E3B55] bg-[#0F1B34]/[40%] px-4 py-3">
							<ScrollArea
								className="pr-4"
								type={isScrollable ? 'always' : undefined}
							>
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
					</div>
					<button
						className="btn mx-25 py-4 disabled:bg-[#D0D3D9]"
						disabled={
							addresses.length === 0 || !inputAmount || inputAmount <= 0
						}
						onClick={onSendCoins}
					>
						Send
					</button>
				</div>
			</div>
		</div>
	)
}
