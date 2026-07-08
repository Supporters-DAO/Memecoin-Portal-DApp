import { Github, Code2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { HeroBackground } from '@/components/sections/homepage/hero-background'
import { HeroTokenator } from '@/components/sections/homepage/hero-tokenator'
import logo from '@/../public/images/logo-tokenator.svg'

const repositoryUrl = 'https://github.com/Supporters-DAO/VFT-Portal-DApp'

export default async function Page() {
	return (
		<div className="relative flex min-h-svh overflow-hidden bg-[#0F1B34]">
			<HeroBackground />
			<div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,27,52,0.08)_0%,rgba(15,27,52,0.1)_44%,rgba(15,27,52,0.92)_100%)]" />
			<div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-[#0F1B34]" />

			<header className="absolute inset-x-0 top-0 z-20">
				<div className="container flex min-h-[--header-height] items-center justify-between gap-4">
					<Link href="/" className="transition-opacity hocus:opacity-80">
						<span className="sr-only">Tokenator</span>
						<Image
							src={logo}
							alt=""
							width={156}
							height={86}
							priority
							className="h-[49px] w-[68px] sm:h-[55px] sm:w-[98px] lg:h-[86px] lg:w-[156px]"
						/>
					</Link>
					<Link
						href={repositoryUrl}
						target="_blank"
						rel="noreferrer"
						className="btn btn--primary gap-2 px-4 py-3 text-[10px] shadow-[0_5px_0_#242424] md:px-6 md:py-4 md:text-[12px]"
					>
						<Github className="size-4" aria-hidden />
						<span className="hidden sm:inline">GitHub</span>
					</Link>
				</div>
			</header>

			<section className="container relative z-10 grid min-h-svh grow gap-8 pt-[--header-height] lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.88fr)] lg:items-center">
				<div className="relative z-10 flex flex-col items-center pb-10 pt-12 text-center sm:pt-20 lg:items-start lg:pb-18 lg:text-left">
					<p className="inline-flex items-center gap-2 rounded-lg border-2 border-[#FDFDFD]/30 bg-[#0F1B34]/72 px-4 py-3 font-silkscreen text-[11px]/none text-primary shadow-[0_4px_0_#242424] backdrop-blur md:text-[14px]">
						<Code2 className="size-4" aria-hidden />
						Open source archive
					</p>

					<h1 className="mt-8 max-w-[840px] text-balance text-[34px]/[46px] text-[#FDFDFD] drop-shadow-[0_6px_0_#242424] sm:text-[48px]/[64px] lg:text-[64px]/[80px]">
						Build Your Own Mem Coin Portal
					</h1>

					<p className="mt-6 max-w-[720px] font-silkscreen text-[16px]/[1.55] text-[#FDFDFD] drop-shadow-[0_2px_0_#242424] md:text-[22px]/[1.45]">
						Tokenator is no longer operated as a hosted product. You can use
						the open source code to launch, adapt, and build a mem coin portal
						for your own Vara projects.
					</p>

					<div className="mt-9 flex w-full max-w-[320px] flex-col sm:w-auto sm:max-w-none">
						<Link
							href={repositoryUrl}
							target="_blank"
							rel="noreferrer"
							className="btn btn--primary gap-3 px-6 py-5 text-[12px] shadow-[0_7px_0_#242424] md:px-8 md:text-[14px]"
						>
							<Github className="size-5" aria-hidden />
							Open Repository
						</Link>
					</div>
				</div>

				<div className="pointer-events-none relative hidden min-h-[560px] lg:block">
					<HeroTokenator className="lg:-left-18" />
				</div>
			</section>
		</div>
	)
}
