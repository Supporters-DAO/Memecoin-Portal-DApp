'use client'

import Image from 'next/image'
import { type Easing, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type Props = {
	className?: string
}

const duration = 12
const times = [0, 0.05, 0.5, 0.65, 0.8, 1]
const ease: Easing = 'easeIn'
// const repeatType: Repeat['repeatType'] = 'loop'
// const repeatDelay: Repeat['repeatDelay'] = 1

export function CreateTokenBannerAnimation({ className }: Props) {
	return (
		<div className={className} aria-hidden>
			{/*Left*/}
			<motion.div
				className="pointer-events-none absolute -bottom-2.5 -left-5 select-none max-lg:top-0 sm:bottom-0 lg:left-0"
				initial={{ opacity: 0 }}
				transition={{
					duration,
					ease,
					// times,
					repeat: Infinity,
					// repeatDelay: duration / 2,
					// repeatType,
					// delay: duration / 2,
				}}
				whileInView={{
					opacity: [0, 0, 0, 0, 1, 1, 0, 0],
				}}
			>
				<picture>
					<source
						media="(max-width: 1023px)"
						type="image/webp"
						srcSet="/images/banner-t-l-mobile.webp 1x, /images/banner-t-l-mobile@2x.webp 2x"
					/>
					<source
						media="(max-width: 1023px)"
						type="image/png"
						srcSet="/images/banner-t-l-mobile.png 1x, /images/banner-t-l-mobile@2x.png 2x"
					/>
					<source
						media="(min-width: 1024px)"
						type="image/webp"
						srcSet="/images/banner-t-l.webp 1x, /images/banner-t-l@2x.webp 2x"
					/>
					<source
						media="(min-width: 1024px)"
						type="image/png"
						srcSet="/images/banner-t-l.png 1x, /images/banner-t-l@2x.png 2x"
					/>
					<Image
						src="/images/banner-t-l.png"
						alt="Tokenator"
						width={458}
						height={505}
						className="aspect-[574/564] object-left max-lg:size-full max-lg:object-contain lg:aspect-[458/505]"
					/>
				</picture>
			</motion.div>
			{/*Right*/}
			<motion.div
				className="pointer-events-none absolute -bottom-2.5 right-2.5 select-none max-lg:top-0 sm:bottom-0 lg:-right-10 xl:-right-15"
				initial={{ opacity: 1 }}
				transition={{
					duration,
					ease,
					// times,
					repeat: Infinity,
					// repeatType,
				}}
				whileInView={{
					opacity: [1, 1, 0, 0, 0, 0, 0, 0],
				}}
			>
				<picture>
					<source
						media="(max-width: 1023px)"
						type="image/webp"
						srcSet="/images/banner-t-r-mobile.webp 1x, /images/banner-t-r-mobile.webp 2x"
					/>
					<source
						media="(max-width: 1023px)"
						type="image/png"
						srcSet="/images/banner-t-r-mobile.png 1x, /images/banner-t-r-mobile.png 2x"
					/>
					<source
						media="(min-width: 1024px)"
						type="image/webp"
						srcSet="/images/banner-t-r.webp 1x, /images/banner-t-r@2x.webp 2x"
					/>
					<source
						media="(min-width: 1024px)"
						type="image/png"
						srcSet="/images/banner-t-r.png 1x, /images/banner-t-r@2x.png 2x"
					/>
					<Image
						src="/images/banner-t-r.png"
						alt="Tokenator"
						width={575}
						height={502}
						className="aspect-[574/564] max-lg:size-full max-lg:object-contain lg:aspect-[575/502]"
					/>
				</picture>
			</motion.div>
		</div>
	)
}
