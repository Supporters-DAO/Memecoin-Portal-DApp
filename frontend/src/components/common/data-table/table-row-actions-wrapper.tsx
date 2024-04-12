import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
// import { ButtonNew } from '@/components/ui/button-new'
import { MoreHorizontal } from 'lucide-react'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

type TableRowActionsProps = BaseComponentProps & {
	open?: boolean
	setOpen?(state: boolean): void
}

export function TableRowActionsWrapper({
	children,
	open,
	setOpen,
}: TableRowActionsProps) {
	return (
		<DropdownMenu open={open} onOpenChange={setOpen}>
			<DropdownMenuTrigger asChild>
				<button type="button" className="size-6 p-0 data-open:bg-black/5">
					<span className="sr-only">Open menu</span>
					<MoreHorizontal className="size-4" />
				</button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>Actions</DropdownMenuLabel>
				{children}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
