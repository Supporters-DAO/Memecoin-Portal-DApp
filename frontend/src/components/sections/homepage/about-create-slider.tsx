'use client'

import { useCallback, useEffect, useState } from 'react'
import {
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel'
import { Sprite } from '@/components/ui/sprite'
import { cn } from '@/lib/utils'
import Slide1 from '@/components/assets/homepage/create-01.png'
import Slide1x2 from '@/components/assets/homepage/create-01@2x.png'
import Slide1Webp from '@/components/assets/homepage/create-01.webp'
import Slide1x2Webp from '@/components/assets/homepage/create-01@2x.webp'
import Slide2 from '@/components/assets/homepage/create-02.png'
import Slide2x2 from '@/components/assets/homepage/create-02@2x.png'
import Slide2Webp from '@/components/assets/homepage/create-02.webp'
import Slide2x2Webp from '@/components/assets/homepage/create-02@2x.webp'
import Slide3 from '@/components/assets/homepage/create-03.png'
import Slide3x2 from '@/components/assets/homepage/create-03@2x.png'
import Slide3Webp from '@/components/assets/homepage/create-03.webp'
import Slide3x2Webp from '@/components/assets/homepage/create-03@2x.webp'
import Image from 'next/image'

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
				<div className="whitespace-nowrap px-4 text-[16px] leading-7">
					<CarouselContent
						classNameWrapper="overflow-visible"
						className="ml-0 touch-pan-y xl:justify-center"
					>
						{dataBullets.map((bullet, i) => (
							<CarouselItem
								key={i}
								className="basis-full pl-0 transition-opacity md:basis-[425px]"
							>
								<button
									type="button"
									onClick={() => onThumbClick(i)}
									className={cn(
										'mx-auto flex cursor-pointer items-center justify-center transition-all duration-300',
										i === selectedIndex
											? 'text-[20px] opacity-100'
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
				className="mt-10 overflow-hidden"
			>
				<div className="w-full md:px-2.5">
					<CarouselContent
						classNameWrapper="overflow-visible"
						className="-ml-20"
					>
						{dataImages.map((row, i) => (
							<CarouselItem
								className="shrink-0 grow-0 basis-[643px] pl-20"
								key={i}
							>
								<div className="flex aspect-[643/457] items-center justify-center">
									<picture>
										<source
											type="image/webp"
											srcSet={`${row[2].src} 1x, ${row[3].src} 2x`}
										/>
										<source
											type="image/jpeg"
											srcSet={`${row[0].src} 1x, ${row[1].src} 2x`}
										/>
										<Image
											src={row[0]}
											alt="Tokenator"
											width={643}
											height={457}
											placeholder="blur"
											quality={100}
											className="aspect-[643/457] size-full object-contain"
										/>
									</picture>
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

const dataImages = [
	[Slide1, Slide1x2, Slide1Webp, Slide1x2Webp],
	[Slide2, Slide2x2, Slide2Webp, Slide2x2Webp],
	[Slide3, Slide3x2, Slide3Webp, Slide3x2Webp],
]
