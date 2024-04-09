import { Sprite } from '@/components/ui/sprite'
import { cn } from '@/lib/utils'

type Props = {
	className?: string
}

export function HeaderMenu({ className }: Props) {
	return (
		<div className={cn('relative flex flex-col', className)}>
			<button type="button" className="link-primary inline-flex">
				<Sprite name="header-menu" className="size-6" />
			</button>
		</div>
	)
}
