'use client'

import Link from 'next/link'
import { HeroTokenator } from '@/components/sections/404/hero-tokenator'

export function Hero404() {
	return (
		<div className="relative mt-[calc(-1*var(--header-height))] flex min-h-svh grow flex-col pt-[--header-height]">
			<div className="relative z-1 grid grow grid-cols-2 items-center gap-x-30 px-4 max-sm:grid-cols-none">
				<div className="pointer-events-none relative mt-12 self-stretch max-sm:row-start-2 max-sm:mt-0">
					<HeroTokenator />
				</div>
				<div className="px-16 pb-6 max-sm:pb-0">
					<h1 className="text-[100px] leading-none text-[#FDFDFD] drop-shadow-[0_6px_0_#242424] max-sm:text-[50px]">
						404
					</h1>
					<p className="mt-6 font-silkscreen text-[40px]/[1.25] text-[#FDFDFD] drop-shadow-[0_2px_0_#242424] max-sm:text-[20px]">
						Page not found
					</p>
					<div className="mt-10">
						<Link href="/" className="btn btn--primary">
							Back to Main Page
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}
