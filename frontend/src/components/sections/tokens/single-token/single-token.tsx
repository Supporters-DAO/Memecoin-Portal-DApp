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
	id: string
	name: string
	symbol: string
	initialSupply: string
	maxSupply: string
	createdBy: HexString
	burned: string
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
			<div className="ju my-10 flex flex-col gap-8">
				<BackButton />
			</div>
			<div className="flex gap-19">
				<div className="flex justify-between gap-12">
					<div className="relative">
						<Image
							src={token.image}
							alt={`Logo ${token.name}`}
							width={160}
							height={160}
							className="relative size-max h-40 max-w-40 rounded-full object-cover"
							unoptimized={true}
						/>
					</div>
					<div className="flex flex-col gap-5 font-poppins">
						<div className="flex items-end gap-3">
							<h2 className="font-ps2p text-[32px] text-primary">
								{token.name}
							</h2>
							<div className="flex gap-2 font-poppins text-[24px] font-semibold text-white/[80%]">
								{tokenBalance && (
									<span>{parseFloat(tokenBalance).toLocaleString('us')}</span>
								)}
								<span>{token.symbol}</span>
							</div>
						</div>
						<div className="flex items-center gap-8">
							<button
								className="flex items-center gap-2"
								onClick={onCopyAddress}
							>
								<Sprite name="copy" color="#B4FF69" className="size-4" />
								{prettyWord(id)}
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
						{tokenBalance && parseFloat(tokenBalance) > 0 && walletAccount && (
							<div className="flex gap-3">
								<Link href={`/tokens/${id}/send/`}>
									<button className="btn py-3 font-medium">Send</button>
								</Link>
								{isAdmin && (
									<>
										{availableMint > 0 && (
											<button
												onClick={() => setIsOpenMintModal(true)}
												className="btn border-2 !border-[#2E3B55] bg-[#0F1B34] py-3 font-medium text-[#FDFDFD]"
											>
												Mint Tokens
											</button>
										)}
										<Link href={`/tokens/${id}/burn/`}>
											<button className="btn border-2 !border-[#2E3B55] bg-[#0F1B34] py-3 font-medium text-[#FDFDFD]">
												Burn
											</button>
										</Link>
									</>
								)}
							</div>
						)}
					</div>
				</div>
				<div className="ml-auto flex h-max w-[30%] flex-col items-end rounded-lg border-2 border-[#2E3B55]">
					<div className="w-full">
						<div className="flex w-full justify-between p-3">
							<span className="font-poppins text-[12px] font-semibold text-[#FDFDFD]/[80%]">
								Holders
							</span>{' '}
							<p className="text-[12px]">{token.holders}</p>
						</div>
					</div>
					<div className="w-full bg-[#FDFDFD]/[2%]">
						<div className="flex w-full justify-between p-3">
							<span className="font-poppins text-[12px] font-semibold text-[#FDFDFD]/[80%]">
								Circulating supply
							</span>{' '}
							<p className="text-[12px]">{token.circulatingSupply}</p>
						</div>
					</div>
					<div className="w-full">
						<div className="flex w-full justify-between p-3">
							<span className="font-poppins text-[12px] font-semibold text-[#FDFDFD]/[80%]">
								Distributed
							</span>{' '}
							<p className="text-[12px]">
								{(
									(Number(token.distributed) / Number(token.maxSupply)) *
									100
								).toFixed(2)}
								%
							</p>
						</div>
					</div>
					<div className="w-full bg-[#FDFDFD]/[2%]">
						<div className="flex w-full justify-between p-3">
							<span className="font-poppins text-[12px] font-semibold text-[#FDFDFD]/[80%]">
								Burned
							</span>{' '}
							<p className="text-[12px]">{token.burned}</p>
						</div>
					</div>
					<div className="w-full">
						<div className="flex w-full justify-between p-3">
							<span className="font-poppins text-[12px] font-semibold text-[#FDFDFD]/[80%]">
								Initial Supply
							</span>{' '}
							<p className="text-[12px]">{token.initialSupply}</p>
						</div>
					</div>
					<div className="w-full bg-[#FDFDFD]/[2%]">
						<div className="flex w-full justify-between p-3">
							<span className="font-poppins text-[12px] font-semibold text-[#FDFDFD]/[80%]">
								Total Suppply
							</span>{' '}
							<p className="text-[12px]">{token.maxSupply}</p>
						</div>
					</div>
					<div className="w-full">
						<div className="flex w-full justify-between p-3">
							<span className="font-poppins text-[12px] font-semibold text-[#FDFDFD]/[80%]">
								Decimals
							</span>{' '}
							<p className="text-[12px]">{token.decimals}</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
