'use client'

import Link from 'next/link'
import Image from 'next/image'

import { Sprite } from '@/components/ui/sprite'
import { copyToClipboard, prettyWord } from '@/lib/utils'
import { useAlert } from '@gear-js/react-hooks'
import { BackButton } from '@/components/common/back-button'

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
	telegram?: string
	twitter?: string
	website?: string
	discord?: string
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
	const alert = useAlert()

	const onCopyLink = async () => {
		if (window) {
			await copyToClipboard({ value: window.location.href, alert })
		}
	}
	return (
		<section>
			<div className="ju my-10 flex flex-col gap-8">
				<BackButton />
			</div>
			<div className="flex gap-19">
				<div className="flex w-[70%] justify-between gap-12">
					<div className="relative">
						<Image
							src={token.image}
							alt={`Logo ${token.name}`}
							width={160}
							height={160}
							className="relative size-max max-h-40 max-w-40 rounded-full object-cover"
							unoptimized={true}
						/>
					</div>
					<div className="flex flex-col gap-5 font-poppins">
						<div className="flex items-end gap-3">
							<h2 className="font-ps2p text-[32px] text-primary">
								{token.name}
							</h2>
							<span className="font-poppins text-[24px] font-semibold text-white/[80%]">
								{token.symbol}
							</span>
						</div>
						<div className="flex items-center gap-8">
							<div className="flex items-center gap-2">
								<Sprite name="copy" color="#B4FF69" className="size-4" />
								{prettyWord(id)}
							</div>
							<button className="flex items-center gap-2" onClick={onCopyLink}>
								<Sprite name="link" color="#B4FF69" className="size-4" />
								Share link
							</button>
							{/* <div className="flex items-center gap-2">
								<Sprite name="tokenomics" color="#B4FF69" className="size-4" />
								Tokenomics
							</div> */}
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
						<div>
							<Link href={`/tokens/my/send/${id}`}>
								<button className="rounded-md border-2 border-[#2E3B55] px-[47px] py-[10px] font-medium text-white outline-[#2E3B55]">
									Send
								</button>
							</Link>
						</div>
					</div>
				</div>
				<div className="ml-auto flex w-[30%]  flex-col items-end justify-between rounded-lg border-2 border-[#2E3B55]">
					<div className="w-full">
						<div className="flex w-full justify-between p-3">
							<span className="font-poppins text-[12px] font-semibold text-[#FDFDFD]/[80%]">
								Holders
							</span>{' '}
							<p className="text-[12px]"></p>
						</div>
					</div>
					<div className="w-full bg-[#FDFDFD]/[2%]">
						<div className="flex w-full justify-between p-3">
							<span className="font-poppins text-[12px] font-semibold text-[#FDFDFD]/[80%]">
								Circulating supply
							</span>{' '}
							<p className="text-[12px]"></p>
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
							<p className="text-[12px]"></p>
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
