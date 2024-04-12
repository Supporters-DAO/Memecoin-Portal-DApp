'use client'

import Image from 'next/image'
import { Easing, motion, Repeat } from 'framer-motion'

type Props = {
	className?: string
}

const duration = 12
const times = [0, 0.05, 0.5, 0.65, 0.8, 1]
const ease: Easing = 'easeIn'
// const repeatType: Repeat['repeatType'] = 'loop'
// const repeatDelay: Repeat['repeatDelay'] = 1

export function CreateTokenBannerAnimation({}: Props) {
	return (
		<>
			{/*Left*/}
			<motion.div
				className="absolute -left-0 bottom-0 select-none xl:-left-0"
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
				<Image
					src="/images/banner-t-l.png"
					alt="Tokenator"
					width={458}
					height={505}
					className=""
				/>
			</motion.div>
			{/*Right*/}
			<motion.div
				className="absolute -right-10 bottom-0 select-none xl:-right-15"
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
				<Image
					src="/images/banner-t-r.png"
					alt="Tokenator"
					width={575}
					height={502}
					className=""
				/>
			</motion.div>
		</>
	)
}
