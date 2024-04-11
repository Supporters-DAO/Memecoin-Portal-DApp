import { Sprite } from '@/components/ui/sprite'
import { cn } from '@/lib/utils'

type Props = {
	className?: string
}

export function HeaderMenu({ className }: Props) {
	return (
		<div className={cn('relative flex flex-col', className)}>
			<button
				type="button"
				className="link-primary -mr-1.5 inline-flex p-1.5 sm:m-0 sm:p-0"
			>
				<Sprite name="header-menu" className="size-6" />
			</button>
		</div>
	)
}
