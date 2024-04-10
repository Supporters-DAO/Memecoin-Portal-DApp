import About1x from '@/components/sections/homepage/assets/about.jpeg'
import About2x from '@/components/sections/homepage/assets/about@2x.jpg'
import About1xWebp from '@/components/sections/homepage/assets/about@2x.webp'
import About2xWebp from '@/components/sections/homepage/assets/about@2x.webp'
import Image from 'next/image'
import { AboutSplash } from '@/components/sections/homepage/about.splash'

type Props = {
	className?: string
}

export function About({}: Props) {
	return (
		<section className="grid grid-cols-2" id="about-memecoin">
			<div>
				<picture>
					<source
						type="image/webp"
						srcSet={`${About1xWebp.src} 1x, ${About2xWebp.src} 2x`}
					/>
					<source
						type="image/jpeg"
						srcSet={`${About1x.src} 1x, ${About2x.src} 2x`}
					/>
					<Image
						src={About1x}
						alt="Tokenator"
						width={720}
						height={540}
						placeholder="blur"
						quality={100}
						className="aspect-[72/54] size-full object-cover"
					/>
				</picture>
			</div>
			<div className="relative flex items-center justify-center font-silkscreen text-[18px]/[1.5] text-[#FDFDFD]">
				<AboutSplash />
				<div className="m-auto max-w-[480px]">
					<p>
						A memecoin is like a digital pet rock that gains value through
						internet jokes and community hype, where owning one is as much about
						participating in the meme culture as it is about potential financial
						gains
					</p>
				</div>
			</div>
		</section>
	)
}
