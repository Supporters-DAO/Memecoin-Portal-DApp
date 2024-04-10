'use client'

import Link from 'next/link'
import { WalletLazy } from '@/components/common/wallet-lazy'
import { Sprite } from '@/components/ui/sprite'
import { useScrollLock } from '@/lib/hooks/use-scroll-prevent'
import { cn } from '@/lib/utils'
import { HeaderMenu } from '@/components/layouts/base/header-menu'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'

export function Header() {
	const [hidden, setHidden] = useState<boolean>(false)
	const [scrolling, setScrolling] = useState<boolean>(false)

	const { state } = useScrollLock()
	const { scrollY } = useScroll()

	useMotionValueEvent(scrollY, 'change', (latest) => {
		const previous = scrollY.getPrevious() || 0
		setHidden(latest > previous && latest > window.innerHeight / 2)
		setScrolling(latest > 0)
	})

	return (
		<motion.header
			variants={{ visible: { y: 0 }, hidden: { y: '-100%' } }}
			animate={hidden ? 'hidden' : 'visible'}
			transition={{ duration: 0.35, ease: 'easeInOut' }}
			className="sticky inset-x-0 top-0 z-40"
		>
			<div
				className={cn(
					'group grid min-h-[--header-height] items-center',
					'before:absolute before:inset-0 before:-z-1 before:border-b before:border-[#FDFDFD]/10 before:bg-[#0F1B34] before:opacity-0 before:transition-opacity',
					scrolling && 'before:opacity-100'
				)}
				data-scroll-active={scrolling}
				data-menu-open={state}
			>
				<div className="container flex items-center justify-between">
					<Link href="/" className="transition-opacity hocus:opacity-80">
						<span className="sr-only">Tokenator Logo</span>
						<Sprite name="logo-tokenator" className="h-[86px] w-[156px]" />
					</Link>

					<div className="flex items-center space-x-6 text-primary">
						<WalletLazy />
						<HeaderMenu />
					</div>
				</div>
			</div>
		</motion.header>
	)
}
