import { Sprite } from '@/components/ui/sprite'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'

type Props = {
	className?: string
}

export function HeaderMenu({ className }: Props) {
	const [open, setOpen] = useState(false)
	const pathname = usePathname()
	const router = useRouter()

	return (
		<div className={cn('relative flex flex-col', className)}>
			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<button type="button" className="link-primary -mr-2 inline-flex p-2">
						<Sprite name="header-menu" className="size-6" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					side="bottom"
					className="min-w-55 font-poppins text-[14px] leading-none tracking-[0.03em] md:mt-2"
				>
					<DropdownMenuItem onClick={() => router.push('/create-token')}>
						Memecoins Creator
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => router.push('/tokens/my')}>
						My Coins – My Rules
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => router.push('/tokens')}>
						All Memecoins
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
