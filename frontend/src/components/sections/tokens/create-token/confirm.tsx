'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useAtom } from 'jotai'

import { ICreateTokenForm } from './schema'
import { useAccount } from '@gear-js/react-hooks'
import { stepAtom } from '.'
import { Created } from './created'
import { cn } from '@/lib/utils'
import { useMessages } from '@/lib/sails/use-send-message-factory'

interface Props {
	data: ICreateTokenForm | undefined
}

export const ConfirmCreate = ({ data }: Props) => {
	const [isPending, setIsPending] = useState(false)
	const [step, setStep] = useAtom(stepAtom)
	const [isCreated, setIsCreated] = useState(false)
	const { account } = useAccount()
	const sendMessage = useMessages()

	const onCreate = async () => {
		setIsPending(true)

		if (account && data) {
			try {
				const sendMessageResult = await sendMessage('createFungibleProgram', {
					name: data.name,
					symbol: data.symbol,
					decimals: data.decimals || 0,
					description: data.description,
					external_links: {
						image: data?.external_links?.image,
						website: data?.external_links?.website || null,
						telegram: data?.external_links?.telegram || null,
						twitter: data?.external_links?.twitter || null,
						discord: data?.external_links?.discord || null,
						tokenomics: data?.external_links?.tokenomics || null,
					},
					initial_supply: data.initial_supply || 0,
					max_supply: data.total_supply || 0,
					admin_id: account.decodedAddress,
				})

				if (sendMessageResult) {
					setIsCreated(true)
				}
			} catch (error) {
				console.error('Error sending message:', error)
			} finally {
				setIsPending(false)
			}
		}
	}

	return (
		<div className="flex flex-col items-center gap-3 overflow-hidden">
			<h1 className="text-[28px] text-primary">Memecoin Creator</h1>
			<div className="flex w-[660px] flex-col gap-6 rounded-[40px] bg-blue-light p-10">
				<div className="mx-auto w-2/5">
					<ol className="flex w-full items-center">
						<li className="flex w-full items-center text-[#0F1B34] after:inline-block after:h-1 after:w-full after:border-4 after:border-b after:border-primary after:content-['']">
							<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary">
								1
							</span>
						</li>
						<li
							className={cn(
								"flex w-full items-center text-[#0F1B34] after:inline-block after:h-1 after:w-full after:border-4 after:border-b after:border-[#D0D3D9] after:content-['']",
								isCreated && 'after:border-primary'
							)}
						>
							<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary">
								2
							</span>
						</li>
						<li className="flex w-0 items-center text-[#0F1B34]">
							<span
								className={cn(
									'flex size-10 shrink-0 items-center justify-center rounded-full bg-[#D0D3D9]',
									isCreated && 'bg-primary'
								)}
							>
								3
							</span>
						</li>
					</ol>
				</div>
				{!isCreated ? (
					<>
						<h3 className="text-center uppercase">Confirm Details</h3>
						{data && (
							<div className="flex flex-col gap-5 break-words font-poppins">
								<div className="flex justify-center">
									<Image
										src={data.external_links.image}
										alt={`Logo ${data.name}`}
										width={100}
										height={100}
										unoptimized={true}
										className="h-25 w-25 rounded-full object-cover"
									/>
								</div>

								<div className="flex justify-between">
									<div className="w-1/2">
										<span className="text-sm text-[#A4AAB6]">Name/Symbol</span>
										<p>
											{data.name}
											<span className="text-sm opacity-80"> {data.symbol}</span>
										</p>
									</div>

									<div className="w-1/2">
										<span className="text-sm text-[#A4AAB6]">Decimals</span>
										<p>{data.decimals}</p>
									</div>
								</div>

								<div className="flex justify-between">
									<div className="w-1/2">
										<span className="text-sm text-[#A4AAB6]">
											Initial Supply
										</span>
										<p>{data.initial_supply?.toLocaleString('us')}</p>
									</div>

									<div className="w-1/2">
										<span className="text-sm text-[#A4AAB6]">Total Supply</span>
										<p>{data.total_supply?.toLocaleString('us')}</p>
									</div>
								</div>

								{(data.external_links.website ||
									data.external_links.twitter) && (
									<div className="flex justify-between">
										{data.external_links.website && (
											<div className="w-1/2">
												<span className="text-sm text-[#A4AAB6]">Website</span>
												<p className="">{data.external_links.website}</p>
											</div>
										)}

										{data.external_links.twitter && (
											<div className="w-1/2">
												<span className="text-sm text-[#A4AAB6]">Twitter</span>
												<p>{data.external_links.twitter}</p>
											</div>
										)}
									</div>
								)}

								{(data.external_links.telegram ||
									data.external_links.discord) && (
									<div className="flex justify-between">
										{data.external_links.website && (
											<div className="w-1/2">
												<span className="text-sm text-[#A4AAB6]">Telegram</span>
												<p>{data.external_links.telegram}</p>
											</div>
										)}

										{data.external_links.discord && (
											<div className="w-1/2">
												<span className="text-sm text-[#A4AAB6]">Discord</span>
												<p>{data.external_links.discord}</p>
											</div>
										)}
									</div>
								)}

								<div className="break-words">
									<span className="text-sm text-[#A4AAB6]">Description</span>
									<p>{data.description}</p>
								</div>
							</div>
						)}

						<div className="mt-7 flex gap-3">
							<button
								className="mx-auto w-full rounded-lg bg-[#0F1B34] py-3 text-white"
								onClick={() => setStep('create')}
								disabled={isPending}
							>
								Back
							</button>
							<button
								className="mx-auto w-full rounded-lg bg-primary py-3 text-black disabled:bg-[#D0D3D9]"
								onClick={onCreate}
								disabled={isPending}
							>
								{isPending ? (
									<span className="mx-auto flex w-1/2">
										Pending
										<span className="w-full after:flex after:animate-dots after:content-['']"></span>
									</span>
								) : (
									'Confirm'
								)}
							</button>
						</div>
					</>
				) : (
					<Created name={data!.name} image={data!.external_links!.image} />
				)}
			</div>
		</div>
	)
}
