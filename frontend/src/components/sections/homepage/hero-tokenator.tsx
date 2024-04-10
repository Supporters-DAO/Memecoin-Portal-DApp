import HeroT from '@/components/assets/homepage/hero/hero-t.webp'
import HeroT2 from '@/components/assets/homepage/hero/hero-t.png'
import Image from 'next/image'
import { cn } from '@/lib/utils'

type Props = {
	className?: string
}

export function HeroTokenator({ className }: Props) {
	return (
		<div className={cn('absolute -bottom-15 -left-4 top-0 flex', className)}>
			<picture className="flex aspect-[591/784] h-[calc(min(100%,784px))] w-[calc(min(100%,591px))] self-end">
				<source type="image/webp" srcSet={HeroT.src} />
				<source type="image/png" srcSet={HeroT2.src} />
				<Image
					src={HeroT2}
					alt="Tokenator"
					width={591}
					height={784}
					placeholder="blur"
					quality={100}
					className=" h-full object-contain"
				/>
			</picture>
		</div>
	)
}
