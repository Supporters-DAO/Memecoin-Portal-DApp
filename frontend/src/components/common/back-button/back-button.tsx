import React from 'react'

import { Sprite } from '@/components/ui/sprite'
import { useRouter } from 'next/navigation'

export const BackButton = () => {
	const router = useRouter()

	return (
		<button
			onClick={router.back}
			className="mr-40 flex items-center gap-3 text-xl"
		>
			<Sprite name="arrow-left" className="size-6 " />
			Back
		</button>
	)
}
