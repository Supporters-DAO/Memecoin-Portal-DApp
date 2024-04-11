import hero from '@/components/sections/homepage/assets/hero-t.png'
import heroWebp from '@/components/sections/homepage/assets/hero-t.webp'
import heroMobile from '@/components/sections/homepage/assets/hero-t-mobile.png'
import heroMobile2x from '@/components/sections/homepage/assets/hero-t-mobile@2x.png'
import heroWebpMobile from '@/components/sections/homepage/assets/hero-t-mobile.webp'
import heroWebpMobile2x from '@/components/sections/homepage/assets/hero-t-mobile@2x.webp'
import Image from 'next/image'
import { cn } from '@/lib/utils'

type Props = {
	className?: string
}

export function HeroTokenator({ className }: Props) {
	return (
		<div
			className={cn(
				'absolute inset-y-0 -bottom-9 flex sm:-bottom-15 lg:-left-4',
				'[--h]:[586px] lg:[--h]:[784px]',
				'[--w]:[447px] lg:[--w]:[591px]',
				className
			)}
		>
			<picture className="flex aspect-[var(--w)/var(--h)] h-[calc(min(100%,var(--h)))] w-[calc(min(100%,var(--2)))] self-end">
				<source
					media="(max-width: 1023px)"
					type="image/webp"
					srcSet={`${heroWebpMobile.src} 1x, ${heroWebpMobile2x.src} 2x`}
				/>
				<source
					media="(max-width: 1023px)"
					type="image/png"
					srcSet={`${heroMobile.src} 1x, ${heroMobile2x.src} 2x`}
				/>
				<source
					media="(min-width: 1024px)"
					type="image/webp"
					srcSet={heroWebp.src}
				/>
				<source
					media="(min-width: 1024px)"
					type="image/png"
					srcSet={hero.src}
				/>
				<Image
					src={hero}
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
