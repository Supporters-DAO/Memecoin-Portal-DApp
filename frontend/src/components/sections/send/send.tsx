'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Sprite } from '@/components/ui/sprite'
import { ScrollArea } from '@/components/common/scroll-area'
import { Input } from '@/components/ui/input'
import { HexString } from '@gear-js/api'
import { isValidHexString } from '@/lib/utils'

export const SendCoin = () => {
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

	return (
		<div className="ju my-10 flex items-start">
			<Link href="/tokens" className="mr-20 flex items-center gap-3 text-xl">
				<Sprite name="arrow-left" className="size-6 " />
				My Coin - My Rules
			</Link>
			<div className="flex flex-col items-center gap-3">
				<div className="flex items-center justify-between">
					<h1 className="text-[28px] text-primary">Send</h1>
				</div>

				<div className="flex w-[660px] flex-col gap-6 rounded-[40px] bg-blue-light p-10">
					<h3 className="text-center uppercase">HUMSTER$</h3>
					<p className="text-center font-poppins text-[16px] font-medium text-primary">
						4 121 HUM
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
					>
						Send
					</button>
				</div>
			</div>
		</div>
	)
}
