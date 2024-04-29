'use client'

import React, { useEffect, useRef, useState } from 'react'
import { HexString, decodeAddress } from '@gear-js/api'

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

	const textAreaRef = useRef<HTMLTextAreaElement>(null)
	const [textAreaHeight, setTextAreaHeight] = useState('auto')
	const [parentHeight, setParentHeight] = useState('auto')

	useEffect(() => {
		setParentHeight(`${textAreaRef.current!.scrollHeight}px`)
		setTextAreaHeight(`${textAreaRef.current!.scrollHeight}px`)
	}, [addresses])

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const value = e.target.value
		setInputValue(value as HexString)

		const potentialAddresses = value.split(/\r?\n/)
		const newAddresses: HexString[] = []

		for (const addr of potentialAddresses) {
			try {
				if (
					isValidHexString(addr) ||
					(isValidHexString(decodeAddress(addr)) &&
						!addresses.includes(decodeAddress(addr)))
				) {
					newAddresses.push(decodeAddress(addr))
				}
			} catch (error) {
				console.error('Error decoding address:', addr, error)
			}
		}

		if (newAddresses.length > 0) {
			setAddresses((prevAddresses: any) => {
				const updatedAddresses = new Set([...prevAddresses, ...newAddresses])
				return Array.from(updatedAddresses)
			})
		} else if (
			potentialAddresses.every(
				(addr) => !isValidHexString(addr) || !decodeAddress(addr)
			)
		) {
			setAddresses([])
		}

		setTextAreaHeight('auto')
		setParentHeight(`${textAreaRef.current!.scrollHeight}px`)
	}

	const onSendCoins = () => {
		if (inputAmount && walletAccount && addresses.length > 0) {
			setIsPending(true)
			handleMessage({
				payload: {
					TransferToUsers: {
						amount: inputAmount,
						to_users: addresses,
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
					<div
						className="relative grid gap-2"
						style={{
							minHeight: parentHeight,
						}}
					>
						<Sprite name="enter" className="absolute bottom-0 right-0 size-4" />
						<textarea
							ref={textAreaRef}
							rows={1}
							style={{
								height: textAreaHeight,
							}}
							value={inputValue}
							placeholder="Add one or more addresses (use new lines for multiple addresses)"
							className="resize-none border-none bg-transparent text-[12px] leading-6 outline-none"
							onChange={handleInputChange}
						/>
					</div>
				</ScrollArea>
			</div>
			<span className="text-[13px]">Each address should be on a new line</span>
			<div className="mt-3">
				<Input
					label="Amount"
					placeholder="Set amount"
					type="number"
					onChange={(e) => setInputAmount(Number(e.target.value))}
				/>
			</div>
			<button
				className="btn mx-auto mt-5 flex w-full justify-center py-4 disabled:bg-[#D0D3D9]"
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
						<span className="w-6 after:flex after:animate-dots after:content-['']"></span>
					</span>
				) : (
					'Send'
				)}
			</button>
		</>
	)
}
