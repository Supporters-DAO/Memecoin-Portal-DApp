'use client'

import HeroBG from '@/components/assets/hero-bg.png'
import Link from 'next/link'
import Image from 'next/image'

export function Hero() {
	return (
		<>
			{/*<HeroBackground />*/}
			<div className="container relative z-1">
				<div className="">
					<h1 className="text-[64px] text-[#FDFDFD]">Vara Memecoins</h1>
					<p className="text-xl text-[#FDFDFD]">
						Create your own memecoin in # minutes
					</p>
					<Link
						href={'/create-token'}
						className="mt-5 cursor-pointer rounded-lg bg-primary p-5 px-7 text-xs font-bold text-[#242424]"
					>
						Create now
					</Link>
				</div>
			</div>
		</>
	)
}

function HeroBackground() {
	return (
		<div className="pointer-events-none absolute inset-0 -z-1">
			<Image
				src={HeroBG}
				alt={'Background image'}
				placeholder={'blur'}
				width={1440}
				height={934}
				className="size-full object-cover"
			/>
		</div>
	)
}
