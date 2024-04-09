'use client'

import Link from 'next/link'
import { HeroBackground } from '@/components/sections/homepage/hero-background'
import { HeroTokenator } from '@/components/sections/homepage/hero-tokenator'

export function Hero() {
	return (
		<div className="relative mt-[calc(-1*var(--header-height))] flex min-h-svh grow flex-col pt-[--header-height]">
			<HeroBackground />
			<div className="relative z-1 grid grow grid-cols-2 items-center gap-x-30 px-4">
				<div className="pointer-events-none relative mt-12 self-stretch">
					<HeroTokenator />
				</div>
				<div className="pb-6">
					<h1 className="text-[64px]/[80px] text-[#FDFDFD]">
						Vara <br /> Meme&shy;coins
					</h1>
					<p className="mt-6 font-silkscreen text-xl text-[#FDFDFD]">
						Create your own memecoin in # minutes
					</p>
					<Link
						href={'/create-token'}
						className="mt-10 inline-flex cursor-pointer rounded-lg bg-primary p-5 px-7 text-xs font-bold text-[#242424]"
					>
						Create now
					</Link>
				</div>
			</div>
		</div>
	)
}
