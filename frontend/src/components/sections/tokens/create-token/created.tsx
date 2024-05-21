'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimationCoins } from '@/components/common/animation-coins'

interface Props {
	name: string
	image: string
}

export const Created = ({ name, image }: Props) => {
	return (
		<>
			<AnimationCoins />
			<h3 className="text-center uppercase max-sm:text-center max-sm:text-[16px]">Memecoin is created</h3>
			<div className="flex flex-col gap-5 font-poppins max-sm:text-center">
				<div className="mx-auto flex flex-col items-center justify-center gap-3 rounded-[42px] border-2 border-[#2E3B55] bg-[#172542] p-7 max-sm:p-5">
					<div className="font-ps2p uppercase text-primary max-sm:text-[10px]">{name}</div>
					<Image
						src={image}
						alt={`Logo ${name}`}
						width={100}
						height={100}
						unoptimized={true}
						className="h-25 w-25 rounded-full object-cover max-sm:size-20"
						onError={(e) => {
							const target = e.target as HTMLImageElement
							target.onerror = null // prevents looping
							target.src = '/images/no-token.png'
						}}
					/>
				</div>

				<p className="mx-auto w-2/3 text-center max-sm:w-full">
					You will find your memecoin in the portfolio. Now you can share your
					art with friends
				</p>
				<div className="mt-7 flex gap-3 font-ps2p">
					<Link href="/tokens/my" className="mx-auto">
						<button className="rounded-lg bg-primary px-15 py-3 text-black max-sm:text-[12px]">
							My Memecoins
						</button>
					</Link>
				</div>
			</div>
		</>
	)
}
