'use client'

import Link from 'next/link'
import { WalletLazy } from '@/components/common/wallet-lazy'
import { Sprite } from '@/components/ui/sprite'
import { cn } from '@/lib/utils'
import { HeaderMenu } from '@/components/layouts/base/header-menu'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useState } from 'react'
import { useWalletOpenState } from '@/components/common/wallet-new/components/wallet/wallet.atoms'

export function Header() {
	const [hidden, setHidden] = useState<boolean>(false)
	const [scrolling, setScrolling] = useState<boolean>(false)

	const { scrollY } = useScroll()

	useMotionValueEvent(scrollY, 'change', (latest) => {
		const previous = scrollY.getPrevious() || 0
		setHidden(latest > previous && latest > window.innerHeight / 2)
		setScrolling(latest > 0)
	})

	const [isWalletOpen] = useWalletOpenState()

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
					scrolling && !isWalletOpen && 'before:opacity-100'
				)}
				data-scroll-active={scrolling}
			>
				<div className="container flex items-center justify-between">
					<Link href="/" className="transition-opacity hocus:opacity-80">
						<span className="sr-only">Tokenator Logo</span>
						<Sprite
							name="logo-tokenator"
							className="h-[49px] w-[68px] sm:h-[55px] sm:w-[98px] lg:h-[86px] lg:w-[156px]"
						/>
					</Link>

					<div className="flex items-center space-x-2 text-primary md:space-x-4">
						<WalletLazy />
						<HeaderMenu />
					</div>
				</div>
			</div>
		</motion.header>
	)
}
