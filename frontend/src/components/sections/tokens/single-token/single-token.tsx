'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import { Sprite } from '@/components/ui/sprite'
import { copyToClipboard, prettyWord } from '@/lib/utils'
import { useAlert } from '@gear-js/react-hooks'
import { BackButton } from '@/components/common/back-button'
import { HexString } from '@gear-js/api'
import { useFetchBalances } from '@/lib/hooks/use-fetch-balances'
import { useAuth } from '@/lib/hooks/use-auth'
import { Mint } from '@/components/common/token-mint'

export interface IToken {
	description: string
	decimals: number
	distributed: string
	image: string
	id: `0x${string}`
	name: string
	symbol: string
	initialSupply: string
	maxSupply: string
	createdBy: HexString
	burned: string
	minted: string
	circulatingSupply: string
	holders: string
	telegram?: string
	twitter?: string
	website?: string
	discord?: string
	tokenomics?: string
}

type Props = {
	token: IToken
}

function SocialLink({ platform, href }: { platform: string; href: string }) {
	return (
		<Link href={href} target="_blank">
			<Sprite name={platform} color="#B4FF69" className="size-[26px]" />
		</Link>
	)
}

export function Token({ token: { id, ...token } }: Props) {
	console.log('token', token)
	const [isOpenMintModal, setIsOpenMintModal] = useState(false)
	const { walletAccount } = useAuth()
	const { balances } = useFetchBalances(isOpenMintModal)

	const alert = useAlert()

	const onCopyLink = async () => {
		if (window) {
			await copyToClipboard({ value: window.location.href, alert })
		}
	}
	const onCopyAddress = async () => {
		await copyToClipboard({ value: id, alert })
	}

	const isAdmin = walletAccount?.decodedAddress === token.createdBy

	const tokenBalance = balances?.find(
		(balance) => balance.coin.id === id
	)?.balance

	console.log('token.maxSupply', token.maxSupply)
	console.log('token.circulatingSupply', token.circulatingSupply)

	const availableMint =
		parseFloat(token.maxSupply) - parseFloat(token.circulatingSupply)

	return (
		<section>
			<Mint
				isMintModalOpen={isOpenMintModal}
				available={availableMint}
				id={id}
				mintModalHandler={setIsOpenMintModal}
			/>
			<div className="ju my-10 flex flex-col gap-8 max-sm:my-5">
				<BackButton />
			</div>

			<div className="grid h-[250px] grid-cols-4 grid-rows-1 gap-10 max-sm:h-auto max-sm:grid-cols-none">
				<div className="">
					<Image
						src={token.image}
						alt={`Logo ${token.name}`}
						width={160}
						height={160}
						className="relative size-max h-40 w-full max-w-40 rounded-full object-cover max-sm:size-20"
						unoptimized={true}
						onError={(e) => {
							const target = e.target as HTMLImageElement
							target.onerror = null // prevents looping
							target.src = '/images/no-token.png'
						}}
					/>
				</div>
				<div className="max-sm:col-span-1 max-sm:col-start-2 max-sm:w-full max-sm:content-center md:w-max">
					<div className="gap-0 sm:flex sm:flex-col sm:items-baseline sm:gap-4">
						<h2 className="font-ps2p text-[32px] text-primary max-sm:text-[16px]">
							{token.name}
						</h2>
						<div className="mt-2 flex flex-col gap-0 font-poppins text-[24px] font-semibold text-white/[80%] max-sm:text-[14px] md:mt-0 md:flex-row md:gap-2">
							{tokenBalance && (
								<span>{parseFloat(tokenBalance).toLocaleString('us')}</span>
							)}
							<span>{token.symbol}</span>
						</div>
					</div>
				</div>
				<div className="col-span-2 col-start-2 row-start-4 max-sm:col-span-3 max-sm:col-start-1 max-sm:row-start-2 max-sm:text-[14px]">
					<div className="flex items-center gap-3 font-poppins">
						<button className="flex items-center gap-2" onClick={onCopyAddress}>
							<Sprite name="copy" color="#B4FF69" className="size-4" />
							{prettyWord(id, 4)}
						</button>
						<button className="flex items-center gap-2" onClick={onCopyLink}>
							<Sprite name="link" color="#B4FF69" className="size-4" />
							Share link
						</button>
						{token.tokenomics && (
							<Link href={token.tokenomics} target="_blank">
								<div className="flex items-center gap-2">
									<Sprite
										name="tokenomics"
										color="#B4FF69"
										className="size-4"
									/>
									Tokenomics
								</div>
							</Link>
						)}
					</div>
				</div>

				<div className="col-span-2 col-start-4 max-sm:col-span-3 max-sm:text-[14px]">
					<div className="flex h-max min-w-[30%] flex-col items-end rounded-lg border-2 border-[#2E3B55]">
						<div className="w-full">
							<div className="flex w-full items-center justify-between p-3">
								<span className="font-poppins text-[12px] font-semibold text-[#FDFDFD]/[80%]">
									Holders
								</span>{' '}
								<p className="ml-2 text-[x-small]">
									{Number(token.holders).toLocaleString('us')}
								</p>
							</div>
						</div>
						<div className="w-full bg-[#FDFDFD]/[2%]">
							<div className="flex w-full items-center justify-between p-3">
								<span className="font-poppins text-[12px] font-semibold text-[#FDFDFD]/[80%]">
									Circulating supply
								</span>{' '}
								<p className="ml-2 text-[x-small]">
									{Number(token.circulatingSupply).toLocaleString('us')}
								</p>
							</div>
						</div>
						<div className="w-full">
							<div className="flex w-full items-center justify-between p-3">
								<span className="font-poppins text-[12px] font-semibold text-[#FDFDFD]/[80%]">
									Distributed
								</span>{' '}
								<p className="ml-2 text-[x-small]">
									{(
										(Number(token.distributed) / Number(token.maxSupply)) *
										100
									).toFixed(2)}
									%
								</p>
							</div>
						</div>
						<div className="w-full bg-[#FDFDFD]/[2%]">
							<div className="flex w-full items-center justify-between p-3">
								<span className="font-poppins text-[12px] font-semibold text-[#FDFDFD]/[80%]">
									Minted
								</span>{' '}
								<p className="ml-2 text-[x-small]">
									{Number(token.minted).toLocaleString('us')}
								</p>
							</div>
						</div>
						<div className="w-full">
							<div className="flex w-full items-center justify-between p-3">
								<span className="font-poppins text-[12px] font-semibold text-[#FDFDFD]/[80%]">
									Burned
								</span>{' '}
								<p className="ml-2 text-[x-small]">
									{Number(token.burned).toLocaleString('us')}
								</p>
							</div>
						</div>
						<div className="w-full bg-[#FDFDFD]/[2%]">
							<div className="flex w-full items-center justify-between p-3">
								<span className="font-poppins text-[12px] font-semibold text-[#FDFDFD]/[80%]">
									Initial Supply
								</span>{' '}
								<p className="ml-2 text-[x-small]">
									{Number(token.initialSupply).toLocaleString('us')}
								</p>
							</div>
						</div>
						<div className="w-full">
							<div className="flex w-full items-center justify-between p-3">
								<span className="font-poppins text-[12px] font-semibold text-[#FDFDFD]/[80%]">
									Max Supply
								</span>{' '}
								<p className="ml-2 text-[x-small]">
									{Number(token.maxSupply).toLocaleString('us')}
								</p>
							</div>
						</div>
						<div className="w-full bg-[#FDFDFD]/[2%]">
							<div className="flex w-full items-center justify-between p-3">
								<span className="font-poppins text-[12px] font-semibold text-[#FDFDFD]/[80%]">
									Decimals
								</span>{' '}
								<p className="ml-2 text-[x-small]">
									{Number(token.decimals).toLocaleString('us')}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="col-span-2 col-start-2 row-start-5 font-poppins max-sm:col-span-3 max-sm:row-start-4 max-sm:text-[14px]">
					<div className="flex flex-col gap-3 break-all">
						<div>
							<p>{token.description}</p>
						</div>
						<div className="flex items-center gap-6">
							{token.website && (
								<SocialLink platform="web" href={token.website} />
							)}
							{token.twitter && (
								<SocialLink platform="twitter" href={token.twitter} />
							)}
							{token.discord && (
								<SocialLink platform="discord" href={token.discord} />
							)}
							{token.telegram && (
								<SocialLink platform="telegram" href={token.telegram} />
							)}
						</div>
					</div>
					<div className="my-5 flex items-center gap-3 max-sm:w-full  max-sm:justify-between max-sm:gap-1">
						{tokenBalance && parseFloat(tokenBalance) > 0 && walletAccount && (
							<Link href={`/tokens/${id}/send/`}>
								<button className="btn items-center py-3 font-medium max-sm:w-25 max-sm:px-2">
									Send
								</button>
							</Link>
						)}
						{isAdmin && (
							<>
								{availableMint > 0 && (
									<button
										onClick={() => setIsOpenMintModal(true)}
										className="btn items-center border-2 !border-[#2E3B55] bg-[#0F1B34] py-3 font-medium text-[#FDFDFD] max-sm:w-25 max-sm:px-2"
									>
										Mint Tokens
									</button>
								)}
								{tokenBalance && parseFloat(tokenBalance) > 0 && (
									<Link href={`/tokens/${id}/burn/`}>
										<button className="btn items-center border-2 !border-[#2E3B55] bg-[#0F1B34] py-3 font-medium text-[#FDFDFD] max-sm:w-25 max-sm:px-2">
											Burn
										</button>
									</Link>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</section>
	)
}
