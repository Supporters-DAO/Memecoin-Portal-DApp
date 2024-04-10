'use client'

import Ticker from 'framer-motion-ticker'
// import { Ticker2 } from '@/components/ui/ticker2'
// import { Ticker as TickerC } from '@/components/ui/ticker'

type Props = {
	className?: string
}

export function HeroTicker({}: Props) {
	return (
		<>
			<div className="relative z-1 bg-[#C3C5EA] py-5 text-[20px]/5 text-[#242424]">
				<Ticker duration={20}>
					{Array.from({ length: 10 }).map((_, i) => (
						<p key={i} className="ml-12.5">
							What is memecoin?
						</p>
					))}
				</Ticker>
			</div>
			{/*<TickerC*/}
			{/*	duration={20}*/}
			{/*	className="whitespace-nowrap bg-[#C3C5EA] py-5 text-[20px]/5 text-[#242424]"*/}
			{/*	classNameContainer="space-x-12.5"*/}
			{/*>*/}
			{/*	{Array.from({ length: 10 }).map((_, i) => (*/}
			{/*		<p key={i}>What is memecoin?</p>*/}
			{/*	))}*/}
			{/*</TickerC>*/}

			{/*<div className="bg-[#C3C5EA] py-5 text-[20px]/5 text-[#242424]">*/}
			{/*	<Ticker2 className="min-h-5">*/}
			{/*		<div className="flex space-x-12">*/}
			{/*			{Array.from({ length: 10 }).map((_, i) => (*/}
			{/*				<p key={i} className="">*/}
			{/*					What is memecoin?*/}
			{/*				</p>*/}
			{/*			))}*/}
			{/*		</div>*/}
			{/*	</Ticker2>*/}
			{/*</div>*/}
		</>
	)
}
