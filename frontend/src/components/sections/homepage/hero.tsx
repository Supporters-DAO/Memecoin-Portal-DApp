import { HeroBackground } from '@/components/sections/homepage/hero-background'
import { HeroTokenator } from '@/components/sections/homepage/hero-tokenator'
import { HeroTicker } from '@/components/sections/homepage/hero-ticker'
import { CreateButtonLazy } from '@/components/common/create-button-lazy'

export function Hero() {
	return (
		<div className="relative mt-[calc(-1*var(--header-height))] flex min-h-svh grow flex-col pt-[--header-height]">
			<HeroBackground />
			<div className="relative z-1 grid grow gap-x-20 px-4 lg:grid-cols-2 lg:items-center xl:gap-x-30">
				<div className="pointer-events-none absolute inset-0 self-stretch lg:relative lg:inset-0 lg:mt-12">
					<HeroTokenator />
				</div>
				<div className="relative z-1 mt-19 text-center md:mt-32 lg:my-auto lg:pb-6 lg:text-left">
					<h1 className="text-[32px]/[44px] text-[#FDFDFD] drop-shadow-[0_6px_0_#242424] md:text-[64px]/[80px]">
						Vara <br /> Meme&shy;coins
					</h1>
					<p className="mt-5 font-silkscreen text-[16px]/[1.25] text-[#FDFDFD] drop-shadow-[0_2px_0_#242424] sm:mt-6 md:text-[24px]/[1.4]">
						Create your own memecoin in&nbsp;#&nbsp;minutes
					</p>
					<CreateButtonLazy />
				</div>
			</div>
			<HeroTicker />
		</div>
	)
}
