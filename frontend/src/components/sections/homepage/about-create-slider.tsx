'use client'

import { ReactNode, useCallback, useEffect, useState } from 'react'
import {
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import Slide1 from '@/components/sections/homepage/assets/create-01.jpeg'
import Slide1x2 from '@/components/sections/homepage/assets/create-01@2x.jpeg'
import Slide1Webp from '@/components/sections/homepage/assets/create-01.webp'
import Slide1x2Webp from '@/components/sections/homepage/assets/create-01@2x.webp'
import Slide2 from '@/components/sections/homepage/assets/create-02.jpeg'
import Slide2x2 from '@/components/sections/homepage/assets/create-02@2x.jpeg'
import Slide2Webp from '@/components/sections/homepage/assets/create-02.webp'
import Slide2x2Webp from '@/components/sections/homepage/assets/create-02@2x.webp'
import Slide3 from '@/components/sections/homepage/assets/create-03.jpeg'
import Slide3x2 from '@/components/sections/homepage/assets/create-03@2x.jpeg'
import Slide3Webp from '@/components/sections/homepage/assets/create-03.webp'
import Slide3x2Webp from './assets/create-03@2x.webp'
import Image, { StaticImageData } from 'next/image'

export function AboutCreateSlider() {
	const [selectedIndex, setSelectedIndex] = useState(0)
	const [canScroll, setCanScroll] = useState(true)
	const [api, setApi] = useState<CarouselApi>()
	const [thumbsApi, setThumbsApi] = useState<CarouselApi>()

	const onThumbClick = useCallback(
		(index: number) => {
			if (!api || !thumbsApi) return
			api.scrollTo(index)
		},
		[api, thumbsApi]
	)

	const onSelect = useCallback(
		(index?: number) => {
			if (!api || !thumbsApi) return
			setSelectedIndex(
				typeof index === 'number' ? index : api.selectedScrollSnap()
			)
			thumbsApi.scrollTo(
				typeof index === 'number' ? index : api.selectedScrollSnap()
			)
			if (typeof index === 'number') api.scrollTo(index)
		},
		[api, thumbsApi, setSelectedIndex]
	)

	useEffect(() => {
		if (!api) return

		onSelect()
		api.on('select', () => onSelect())
		api.on('reInit', () => onSelect())
	}, [api, onSelect])

	useEffect(() => {
		if (!thumbsApi) return

		setCanScroll(thumbsApi.canScrollNext())
		thumbsApi.on('reInit', () => {
			setCanScroll(thumbsApi.canScrollNext())
		})
	}, [thumbsApi])

	return (
		<>
			{/*Controls*/}
			<Carousel
				setApi={setThumbsApi}
				opts={{
					watchDrag: canScroll,
					breakpoints: {
						'(min-width: 1280px)': {
							active: false,
						},
					},
				}}
				className="overflow-hidden"
			>
				<div className="whitespace-nowrap px-4 py-2 text-[12px] leading-7 sm:py-0 sm:text-[16px]">
					<CarouselContent
						classNameWrapper="overflow-visible"
						className="-ml-8 touch-pan-y md:ml-0 xl:justify-center"
					>
						{dataBullets.map((bullet, i) => (
							<CarouselItem
								key={i}
								className="basis-auto pl-8 transition-opacity md:basis-[425px] md:pl-0"
							>
								<button
									type="button"
									onClick={() => onThumbClick(i)}
									className={cn(
										'mx-auto flex cursor-pointer items-center justify-center transition-all duration-300',
										i === selectedIndex
											? 'opacity-100 sm:text-[20px]'
											: 'opacity-20 hover:opacity-70'
									)}
								>
									{bullet}
								</button>
							</CarouselItem>
						))}
					</CarouselContent>
				</div>
			</Carousel>

			{/*Slider*/}
			<Carousel
				setApi={setApi}
				opts={{
					startIndex: 1,
					align: 'center',
					containScroll: false,
				}}
				className="mt-6 overflow-hidden sm:mt-10"
			>
				<div className="w-full [--img-h:266px] [--img-w:375px] [--offset:2rem] sm:[--img-h:278px] sm:[--img-w:392px] sm:[--offset:6.875rem] md:px-2.5 lg:[--img-h:400px] lg:[--img-w:563px] lg:[--offset:10rem]">
					<CarouselContent
						classNameWrapper="overflow-visible"
						className="ml-[calc(-1*var(--offset))]"
					>
						{dataImages.map(([images, quote], i) => (
							<CarouselItem
								className="relative shrink-0 grow-0 basis-[calc(var(--img-w)+var(--offset))] pb-30 pl-[--offset] sm:pb-17.5 lg:pb-14"
								key={i}
							>
								<div className="flex aspect-[var(--img-w)/var(--img-h)] items-center justify-center">
									<picture>
										<source
											type="image/webp"
											srcSet={`${images[2].src} 1x, ${images[3].src} 2x`}
										/>
										<source
											type="image/jpeg"
											srcSet={`${images[0].src} 1x, ${images[1].src} 2x`}
										/>
										<Image
											src={images[0]}
											alt="Tokenator"
											width={563}
											height={400}
											placeholder="blur"
											quality={100}
											className="size-full object-cover sm:rounded-lg"
										/>
									</picture>
								</div>
								<div className="absolute bottom-0 left-[calc(var(--offset)+1rem)] right-4 max-w-[400px] rounded-lg bg-primary p-5 sm:left-[calc(var(--offset)/2)] sm:right-0">
									<p className="font-silkscreen text-[15px] leading-[1.4] text-[#242424] sm:text-[18px]">
										{quote}
									</p>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
				</div>
			</Carousel>
		</>
	)
}

const dataBullets = [
	'Create a name',
	'Set symbol & decimals',
	'Add an image link',
]

const dataImages: [StaticImageData[], ReactNode][] = [
	[
		[Slide1, Slide1x2, Slide1Webp, Slide1x2Webp],
		'Dream up a catchy moniker, as viral as your currency! Craft it to resonate, embedding in the human psyche like the ultimate viral strain.',
	],
	[
		[Slide2, Slide2x2, Slide2Webp, Slide2x2Webp],
		'Pick a symbol that screams "cool" and decide on decimals like a pro. This is where the magic happens – so choose wisely!',
	],
	[
		[Slide3, Slide3x2, Slide3Webp, Slide3x2Webp],
		<>
			Find an image that&apos;s as iconic as your memecoin. Whether it&apos;s
			a&nbsp;laughing emoji or a wacky doodle, make it stand out in
			the&nbsp;crowd!
		</>,
	],
]
