import { cn } from '@/lib/utils'
import { CreateTokenBannerAnimation } from '@/components/banners/create-token.animation'
import { CreateButtonLazy } from '../common/create-button-lazy'

type Props = {
	className?: string
}

export function CreateTokenBanner({ className }: Props) {
	return (
		<>
			<section className={cn('container', className)}>
				<div className="relative flex items-center rounded-2xl bg-[#0F1B34] px-4 py-10 md:min-h-[400px] lg:px-15">
					<CreateTokenBannerAnimation className="max-lg:hidden" />
					<div className="relative text-center lg:text-left">
						<h2 className="normal text-[18px] leading-loose drop-shadow-[0_6px_0_#242424] md:text-[32px] lg:leading-none">
							Make your own memecoin
						</h2>
						<div className="mt-5 font-silkscreen text-[16px] drop-shadow-[0_2px_0_#242424] md:mt-4 md:text-[20px]">
							<p>Add a new one to Vara Memecoins collection</p>
						</div>
						<CreateButtonLazy />
					</div>
				</div>
			</section>
			<CreateTokenBannerAnimation className="relative mx-auto mt-25 aspect-[574/564] max-h-[564px] w-full px-4 sm:mt-37.5 md:px-15 lg:hidden" />
		</>
	)
}
