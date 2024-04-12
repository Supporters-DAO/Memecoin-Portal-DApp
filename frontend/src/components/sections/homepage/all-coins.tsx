import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { ILastCoin } from '@/lib/requests'

type Props = {
	coins?: ILastCoin[] | null
	className?: string
}

export function AllCoins({ coins, className }: Props) {
	return (
		<section
			className={cn(
				'container mx-auto w-full max-w-[608px] space-y-5 md:space-y-8',
				className
			)}
		>
			<h2 className="text-center text-[22px] leading-none text-[#242424] sm:text-[32px]">
				All memecoins
			</h2>
			<div className="">
				<input
					type="text"
					className="block w-full select-none rounded-lg bg-[#0F1B34]/[4%] px-6 py-3 font-silkscreen text-[16px]/5 text-[#242424] ring-2 ring-inset ring-[#0F1B34]/[6%] placeholder:text-[#242424]/70 focus:outline-none"
					placeholder="Search"
				/>
			</div>
			<div className="">
				<ul className="space-y-2 md:space-y-4">
					{coins?.map((coin, i) => (
						<li key={coin.id}>
							<Link
								href={`/tokens/${coin.id}`}
								className="flex select-none items-center space-x-3 rounded-lg bg-[#FDFDFD] py-2 pl-5 pr-6 ring-2 ring-inset ring-primary transition-shadow hocus:ring-4 md:space-x-10 md:rounded-2xl"
							>
								<div className="relative size-10 overflow-hidden rounded-full bg-[#8B2786] md:size-25">
									<Image src={coin.image} alt="Coin Image" fill />
								</div>
								<div className="grow space-y-1 md:space-y-3">
									<h3 className="flex items-center space-x-4 text-[14px]/[22px] text-[#242424] md:text-[20px]/[22px]">
										<span>{coin.name}</span>{' '}
										<span className="inline-flex font-silkscreen text-[12px]/[22px] opacity-80 md:text-[18px]/[1.4]">
											{coin.symbol}
										</span>
									</h3>
									<p className="font-silkscreen text-[12px]/[15px] text-[#8B2786] md:text-[18px]/[1.4]">
										Distributed: {coin.distributed}
									</p>
								</div>
								<div className="size-6 md:size-8">
									<Image
										src="/images/coin.gif"
										alt={coin.symbol}
										width={32}
										height={32}
										className="size-full"
									/>
								</div>
							</Link>
						</li>
					))}
				</ul>
				<div className="mt-4 md:mt-6">
					<Link href="/tokens" className="btn btn--white w-full">
						Show all
					</Link>
				</div>
			</div>
		</section>
	)
}
