import {
	useRef,
	useEffect,
	type MutableRefObject,
	type ReactNode,
	useCallback,
	useState,
} from 'react'
import {
	AnimationControls,
	AnimationPlaybackControls,
	motion,
	useAnimate,
	useAnimation,
	useInView,
} from 'framer-motion'
import { cn } from '@/lib/utils'

type Props = {
	className?: string
	children: ReactNode
	offset?: number
	speed?: number
}

export function Ticker2({
	children,
	className,
	offset = 50,
	speed = 150,
}: Props) {
	const controls1 = useAnimation()
	const controls2 = useAnimation()
	const ref1 = useRef<HTMLDivElement | null>(null)
	const ref2 = useRef<HTMLDivElement | null>(null)

	const [scope, animate] = useAnimate()
	const [animationControls, setAnimationControls] =
		useState<AnimationPlaybackControls>()
	const isInView = useInView(scope)

	const loop = useCallback(
		(
			control: AnimationControls,
			othersRef: MutableRefObject<HTMLDivElement>
		) => {
			const { left, width } = othersRef.current.getBoundingClientRect()
			const start = left - width - offset
			control.set({ x: start })
			const duration = (window.innerWidth - start) / speed
			control
				.start({
					x: window.innerWidth,
					transition: {
						duration: duration,
						ease: 'linear',
					},
				})
				.then(() => {
					loop(control, othersRef)
				})
		},
		[offset, speed]
	)

	useEffect(() => {
		if (ref1.current && ref2.current) {
			const width = ref1.current.offsetWidth

			const start1 = 0
			const start2 = start1 - width - offset
			controls1.set({ x: start1 })
			controls2.set({ x: start2 })

			const duration1 = (window.innerWidth - start1) / speed
			const duration2 = (window.innerWidth - start2) / speed
			controls1
				.start({
					x: window.innerWidth,
					transition: {
						duration: duration1,
						ease: 'linear',
					},
				})
				.then(() => {
					loop(controls1, ref2 as MutableRefObject<HTMLDivElement>)
				})
			controls2
				.start({
					x: window.innerWidth,
					transition: {
						duration: duration2,
						ease: 'linear',
					},
				})
				.then(() => {
					loop(controls2, ref1 as MutableRefObject<HTMLDivElement>)
				})
		}
	}, [controls1, controls2, loop, offset, speed])

	return (
		<div
			className={cn(
				'relative size-full overflow-hidden whitespace-nowrap',
				className
			)}
		>
			<motion.div ref={ref1} animate={controls1} className="absolute">
				{children}
			</motion.div>
			<motion.div ref={ref2} animate={controls2} className="absolute">
				{children}
			</motion.div>
		</div>
	)
}
