import { useEffect, useState } from 'react'

type DirectionProps = 'down' | 'up'

export function useScrollDirection() {
	const [isScrolled, setIsScrolled] = useState(false)
	const [scrollDirection, setScrollDirection] = useState<boolean>(false)

	useEffect(() => {
		setIsScrolled(window.scrollY > 0)
	}, [])

	useEffect(() => {
		let lastScrollY = window.scrollY

		const updateScrollDirection = () => {
			setIsScrolled(window.scrollY > 0)
			if (window.scrollY > window.innerHeight / 2) {
				const scrollY = window.scrollY
				const direction: DirectionProps = scrollY > lastScrollY ? 'down' : 'up'
				const directionDown = direction === 'down'
				if (
					directionDown !== scrollDirection &&
					(scrollY - lastScrollY > 1 || scrollY - lastScrollY < -1)
				) {
					setScrollDirection(directionDown)
				}
				lastScrollY = scrollY > 0 ? scrollY : 0
			} else {
				setScrollDirection(false)
			}
		}
		window.addEventListener('scroll', updateScrollDirection)
		return () => {
			window.removeEventListener('scroll', updateScrollDirection)
		}
	}, [scrollDirection])

	return [scrollDirection, isScrolled]
}
