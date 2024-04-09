import HeroT from '@/components/assets/404/hero-t.webp'
import HeroT2 from '@/components/assets/404/hero-t.png'
import Image from 'next/image'
import { cn } from '@/lib/utils'

type Props = {
	className?: string
}

export function HeroTokenator({ className }: Props) {
	return (
		<div className={cn('absolute inset-y-0 -left-4', className)}>
			<picture>
				<source type="image/webp" srcSet={HeroT.src} />
				<source type="image/png" srcSet={HeroT2.src} />
				<Image
					src={HeroT2}
					alt="Tokenator"
					width={1440}
					height={934}
					placeholder="blur"
					quality={100}
					className="size-full object-contain"
				/>
			</picture>
		</div>
	)
}
