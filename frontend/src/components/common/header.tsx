'use client'

import Link from 'next/link'
import { WalletLazy } from '@/components/common/wallet-lazy'
import { Sprite } from '@/components/ui/sprite'
import { useScrollDirection } from '@/lib/hooks/use-scroll-direction'
import { useScrollLock } from '@/lib/hooks/use-scroll-prevent'
import { cn } from '@/lib/utils'

export function Header() {
	const [basicDown, basicScroll] = useScrollDirection()
	const { state } = useScrollLock()

	const isDown = basicDown
	const isScroll = basicScroll

	return (
		<header
			className={cn(
				'sticky inset-x-0 top-0 z-40 transform-gpu transition-transform duration-300',
				isDown && 'pointer-events-none -translate-y-full'
			)}
		>
			<div
				className={cn(
					'group grid min-h-[--header-height] items-center',
					'before:absolute before:inset-0 before:-z-1 before:border-b before:border-[#FDFDFD]/10 before:bg-[#0F1B34] before:opacity-0 before:transition-opacity',
					isScroll && 'before:opacity-100'
				)}
				data-scroll-active={isScroll}
				data-menu-open={state}
			>
				<div className="container flex items-center justify-between">
					<Link href="/" className="">
						<span className="sr-only">Tokenator Logo</span>
						<Sprite name="logo-tokenator" className="h-[86px] w-[156px]" />
					</Link>

					<WalletLazy />
				</div>
			</div>
		</header>
	)
}
