import HeroBG from '@/components/assets/homepage/hero/hero-bg.webp'
import HeroBG2 from '@/components/assets/homepage/hero/hero-bg.jpg'
import Image from 'next/image'
import { cn } from '@/lib/utils'

type Props = {
	className?: string
}

export function HeroBackground({ className }: Props) {
	return (
		<div className={cn('pointer-events-none absolute inset-0 -z-1', className)}>
			<picture>
				<source type="image/webp" srcSet={HeroBG.src} />
				<source type="image/jpg" srcSet={HeroBG2.src} />
				<Image
					src={HeroBG2}
					alt="Clouds in the sky"
					width={1440}
					height={934}
					placeholder="blur"
					quality={100}
					className="size-full object-cover"
				/>
			</picture>
		</div>
	)
}
