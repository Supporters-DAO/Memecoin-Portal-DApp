import { cn } from '@/lib/utils'
import Link from 'next/link'

type Props = {
	className?: string
}

export function CreateTokenBanner({ className }: Props) {
	return (
		<section className={cn('container', className)}>
			<div className="flex min-h-[400px] items-center rounded-2xl bg-[#0F1B34] px-15 py-10">
				<div className="">
					<h2 className="normal text-[32px] leading-none">
						Make your own memecoin
					</h2>
					<div className="mt-4 font-silkscreen text-[20px]">
						<p>Add a new one to Vara Memecoins collection</p>
					</div>
					<div className="mt-12">
						<Link href={'/create-token'} className="btn btn--primary">
							Create now
						</Link>
					</div>
				</div>
			</div>
		</section>
	)
}
