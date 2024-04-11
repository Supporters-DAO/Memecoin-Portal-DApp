import { cn } from '@/lib/utils'
import Link from 'next/link'

type Props = {
	className?: string
}

export function CreateTokenBanner({ className }: Props) {
	return (
		<section className={cn('container', className)}>
			<div className="flex items-center rounded-2xl bg-[#0F1B34] px-4 py-10 md:min-h-[400px] lg:px-15">
				<div className="text-center lg:text-left">
					<h2 className="normal text-[18px] leading-loose md:text-[32px] lg:leading-none">
						Make your own memecoin
					</h2>
					<div className="mt-5 font-silkscreen text-[16px] md:mt-4 md:text-[20px]">
						<p>Add a new one to Vara Memecoins collection</p>
					</div>
					<div className="mt-10 md:mt-12">
						<Link href={'/create-token'} className="btn btn--primary">
							Create now
						</Link>
					</div>
				</div>
			</div>
		</section>
	)
}
