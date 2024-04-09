import Link from 'next/link'
import { WalletLazy } from '@/components/common/wallet-lazy'
import { Sprite } from '@/components/ui/sprite'

export function Header() {
	return (
		<header className="container flex items-center justify-between py-3">
			<Link href="/" className="">
				<span className="sr-only">Tokenator Logo</span>
				<Sprite name="logo-tokenator" className="h-[86px] w-[156px]" />
			</Link>

			<WalletLazy />
		</header>
	)
}
