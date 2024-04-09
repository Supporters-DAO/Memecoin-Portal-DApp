import Link from 'next/link'
import { WalletLazy } from '@/components/common/wallet-lazy'
import { Sprite } from '@/components/ui/sprite'

export function Header() {
	return (
		<header className="sticky top-0 z-40 grid min-h-[--header-height]">
			<div className="container flex items-center justify-between">
				<Link href="/" className="">
					<span className="sr-only">Tokenator Logo</span>
					<Sprite name="logo-tokenator" className="h-[86px] w-[156px]" />
				</Link>

				<WalletLazy />
			</div>
		</header>
	)
}
