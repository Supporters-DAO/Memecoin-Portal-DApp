import Link from 'next/link'
import { HeroBackground } from '@/components/sections/homepage/hero-background'
import { HeroTokenator } from '@/components/sections/homepage/hero-tokenator'
import { HeroTicker } from '@/components/sections/homepage/hero-ticker'

export function Hero() {
	return (
		<div className="relative mt-[calc(-1*var(--header-height))] flex min-h-svh grow flex-col pt-[--header-height]">
			<HeroBackground />
			<div className="relative z-1 grid grow grid-cols-2 items-center gap-x-30 px-4">
				<div className="pointer-events-none relative mt-12 self-stretch">
					<HeroTokenator />
				</div>
				<div className="pb-6">
					<h1 className="text-[64px]/[80px] text-[#FDFDFD] drop-shadow-[0_6px_0_#242424]">
						Vara <br /> Meme&shy;coins
					</h1>
					<p className="mt-6 font-silkscreen text-xl text-[#FDFDFD] drop-shadow-[0_2px_0_#242424]">
						Create your own memecoin in # minutes
					</p>
					<div className="mt-10">
						<Link href={'/create-token'} className="btn btn--primary">
							Create now
						</Link>
					</div>
				</div>
			</div>
			<HeroTicker />
		</div>
	)
}
