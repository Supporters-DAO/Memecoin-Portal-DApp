import React from 'react'

import { Sprite } from '@/components/ui/sprite'
import { useRouter } from 'next/navigation'

export const BackButton = () => {
	const router = useRouter()

	return (
		<button
			onClick={router.back}
			className="mr-40 flex items-center gap-3 text-xl max-sm:mb-5 max-sm:text-sm"
		>
			<Sprite name="arrow-left" className="size-6 max-sm:size-4 " />
			Back
		</button>
	)
}
