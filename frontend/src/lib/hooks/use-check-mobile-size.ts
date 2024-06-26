import { useState, useEffect } from 'react'

export const useCheckMobileSize = () => {
	const [width, setWidth] = useState<number>(window.innerWidth)

	function handleWindowSizeChange() {
		setWidth(window.innerWidth)
	}

	useEffect(() => {
		window.addEventListener('resize', handleWindowSizeChange)
		return () => {
			window.removeEventListener('resize', handleWindowSizeChange)
		}
	}, [])

	return width <= 768
}
