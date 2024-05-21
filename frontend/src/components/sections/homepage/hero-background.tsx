import bg from '@/components/sections/homepage/assets/hero-bg.jpg'
import bgWebp from '@/components/sections/homepage/assets/hero-bg.webp'
import bgMobile from '@/components/sections/homepage/assets/hero-bg-mobile.jpg'
import bgMobile2x from '@/components/sections/homepage/assets/hero-bg-mobile@2x.jpg'
import bgWebpMobile from '@/components/sections/homepage/assets/hero-bg-mobile.webp'
import bgWebpMobile2x from '@/components/sections/homepage/assets/hero-bg-mobile@2x.webp'
import Image from 'next/image'
import { cn } from '@/lib/utils'

type Props = {
	className?: string
}

export function HeroBackground({ className }: Props) {
	return (
		<div className={cn('pointer-events-none absolute inset-0 -z-1', className)}>
			<picture>
				<source
					media="(max-width: 1023px)"
					type="image/webp"
					srcSet={`${bgWebpMobile.src} 1x, ${bgWebpMobile2x.src} 2x`}
				/>
				<source
					media="(max-width: 1023px)"
					type="image/jpg"
					srcSet={`${bgMobile.src} 1x, ${bgMobile2x.src} 2x`}
				/>
				<source
					media="(min-width: 1024px)"
					type="image/webp"
					srcSet={bgWebp.src}
				/>
				<source media="(min-width: 1024px)" type="image/jpg" srcSet={bg.src} />
				<Image
					src={bg}
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
