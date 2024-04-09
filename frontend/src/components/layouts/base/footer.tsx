import Link from 'next/link'
import { Sprite } from '@/components/ui/sprite'
import { SOCIALS } from '@/lib/data/socials'

export function Footer() {
	return (
		<footer className="container pb-12 pt-25 font-poppins">
			<div className="flex justify-between gap-x-10">
				<div className="">
					<Link href="/" className="transition-opacity hocus:opacity-80">
						<span className="sr-only">Tokenator Logo</span>
						<Sprite name="logo-tokenator" className="h-[86px] w-[156px]" />
					</Link>
				</div>
				{LINKS.map((link, index) => (
					<div key={index} className="space-y-5">
						<p className="text-[22px] font-semibold leading-normal">
							{link.title}
						</p>
						<ul className="space-y-5 text-[18px] leading-normal">
							{link.menu.map((item, i) => (
								<li key={i}>
									<Link
										href={item.url}
										className="link-white"
										target={item.url.includes('http') ? '_blank' : '_self'}
										rel={item.url.includes('http') ? 'noreferrer' : undefined}
									>
										{item.title}
									</Link>
								</li>
							))}
						</ul>
					</div>
				))}
				<div className="">
					<ul className="flex items-center justify-between space-x-4 md:space-x-8">
						{Object.values(SOCIALS).map((item, i) => (
							<li key={i}>
								<Link
									href={item.url}
									className="link-primary"
									target="_blank"
									rel="noreferrer"
								>
									<span className="sr-only">{item.title}</span>
									<Sprite
										name={item.icon}
										className="inline-block size-5 md:size-9"
										aria-hidden
									/>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</div>
		</footer>
	)
}

const LINKS = [
	{
		title: 'Vara Memecoins',
		menu: [
			{
				title: 'All Memecoins',
				url: '/all-coins',
			},
			{
				title: 'My Coins – My Rules',
				url: '/my-coins',
			},
			{
				title: 'Memecoin Creator',
				url: '/create-token',
			},
		],
	},
	{
		title: 'Resources',
		menu: [
			{
				title: 'Vara Network',
				url: 'https://vara.network',
			},
			{
				title: 'Vara Wiki',
				url: 'https://wiki.vara.network',
			},
			{
				title: 'IDEA',
				url: 'https://idea.gear-tech.io',
			},
		],
	},
]
