import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

type Props = {
	className?: string
}

export function AllCoins({ className }: Props) {
	return (
		<section className={cn('mx-auto max-w-[576px] space-y-8', className)}>
			<h2 className="text-center text-[32px] leading-none text-[#242424]">
				All memecoins
			</h2>
			<div className="">
				<input
					type="text"
					className="block w-full select-none rounded-lg bg-[#0F1B34]/[4%] px-6 py-3 font-silkscreen text-[16px]/[1.4] text-[#242424] ring-2 ring-inset ring-[#0F1B34]/[6%] placeholder:text-[#242424]/70 focus:outline-none"
					placeholder="Search"
				/>
			</div>
			<div className="">
				<ul>
					<li>
						<Link
							href="/coin-id"
							className="flex select-none items-center space-x-10 rounded-2xl bg-[#FDFDFD] py-2 pl-5 pr-6 ring-2 ring-inset ring-primary transition-shadow hocus:ring-4"
						>
							<div className="size-25 overflow-hidden rounded-full bg-[#8B2786]" />
							<div className="grow space-y-3">
								<h3 className="flex items-center space-x-4 text-[20px]/[1.1] text-[#242424]">
									<span>Lama Coin</span>{' '}
									<span className="inline-flex font-silkscreen text-[18px]/[1.4] opacity-80">
										LAMA
									</span>
								</h3>
								<p className="font-silkscreen text-[18px]/[1.4] text-[#8B2786]">
									Distributed: 43.71%
								</p>
							</div>
							<div className="size-8">
								<Image
									src="/images/coin.gif"
									alt="Coin Image"
									width={32}
									height={32}
									className="size-full"
								/>
							</div>
						</Link>
					</li>
				</ul>
				<div className="mt-6">
					<Link href="/all-coins" className="btn btn--white w-full">
						Show all
					</Link>
				</div>
			</div>
		</section>
	)
}
