'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useAtom } from 'jotai'

import { ICreateTokenForm } from './schema'
import { useMessage } from './hooks/use-message'
import { useAccount } from '@gear-js/react-hooks'
import { stepAtom } from '.'
import { Created } from './created'
import { cn } from '@/lib/utils'

interface Props {
	data: ICreateTokenForm | undefined
}

export const ConfirmCreate = ({ data }: Props) => {
	const [step, setStep] = useAtom(stepAtom)
	const [isCreated, setIsCreated] = useState(false)
	const { account } = useAccount()
	const handleMessage = useMessage()

	const onCreate = () => {
		handleMessage({
			payload: {
				CreateMeme: {
					initConfig: {
						name: data?.name,
						symbol: data?.symbol,
						decimals: data?.decimals,
						description: data?.description,
						externalLinks: {
							image: data?.external_links?.image,
							website: data?.external_links?.website,
							telegram: data?.external_links?.telegram,
							twitter: data?.external_links?.twitter,
							discord: data?.external_links?.discord,
						},
						initialSupply: data?.initial_supply,
						totalSupply: data?.total_supply,
						admin: account?.decodedAddress,
					},
				},
			},
			onInBlock: () => {
				console.log('onInBlock')
			},
			onSuccess: () => {
				setIsCreated(true)
			},
			onError: () => {
				// setIsPending(false);
			},
		})
	}

	return (
		<div className="flex flex-col items-center gap-3">
			<h1 className="text-[28px] text-primary">Memecoin Creator</h1>
			<div className="flex w-[660px] flex-col gap-6 rounded-[40px] bg-blue-light p-10">
				<div className="flex justify-center gap-12">
					<div className="flex w-8  items-center justify-center rounded-full bg-primary">
						<span className="text-sm leading-none text-[#0F1B34]">1</span>
					</div>
					<div className="flex size-8 items-center justify-center rounded-full bg-primary">
						<span className="text-sm leading-none text-[#1D2C4B]">2</span>
					</div>
					<div
						className={cn(
							'flex size-8 items-center justify-center rounded-full bg-[#D0D3D9]',
							isCreated && 'bg-primary'
						)}
					>
						<span className="text-sm leading-none text-[#1D2C4B]">3</span>
					</div>
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
							>
								Back
							</button>
							<button
								className="mx-auto w-full rounded-lg bg-primary py-3 text-black"
								onClick={onCreate}
							>
								Confirm
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
