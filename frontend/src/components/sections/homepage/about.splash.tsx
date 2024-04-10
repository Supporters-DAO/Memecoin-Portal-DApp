'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

type Props = {
	className?: string
}

export function AboutSplash({}: Props) {
	return (
		<motion.div
			className="absolute inset-0"
			initial={{ opacity: 1 }}
			whileInView={{ opacity: 0 }}
			viewport={{ once: true, amount: 'some' }}
			transition={{ duration: 0.35, delay: 5 }}
		>
			<Image
				src="/images/splash.gif"
				alt="Coin Image"
				width={720}
				height={540}
				className="size-full object-cover"
			/>
		</motion.div>
	)
}
