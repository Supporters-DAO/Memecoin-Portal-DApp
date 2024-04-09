import { cn } from '@/lib/utils'
import { SVGProps } from 'react'

export type SpriteProps = SVGProps<SVGSVGElement> & {
	name: string
	section?: string
	size?: number
}

export function Sprite({
	name,
	className,
	section = 'icons',
	size,
	...props
}: SpriteProps) {
	return (
		<svg
			className={cn('size-full', className)}
			width={size || props.width}
			height={size || props.height}
			style={{ width: size || props.width, height: size || props.height }}
			{...props}
		>
			<use href={`/sprites/${section}.svg?sprite#${name.toLowerCase()}`} />
		</svg>
	)
}
