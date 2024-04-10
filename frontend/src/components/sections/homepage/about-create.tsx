import { AboutCreateSlider } from '@/components/sections/homepage/about-create-slider'

type Props = {
	className?: string
}

export function AboutCreate({ className }: Props) {
	return (
		<section className="-mb-17.5 mt-50">
			<h2 className="text-center text-[32px] leading-none text-primary">
				How to create
			</h2>
			<p className="mx-auto mt-6 max-w-[420px] text-center font-silkscreen text-[20px] leading-normal">
				Make memecoins easy and fast with Vara Memecoins Creator
			</p>
			<div className="mt-15">
				<AboutCreateSlider />
			</div>
		</section>
	)
}
