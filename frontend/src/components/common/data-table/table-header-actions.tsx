// import {
// 	DropdownMenu,
// 	DropdownMenuContent,
// 	DropdownMenuItem,
// 	DropdownMenuLabel,
// 	DropdownMenuSeparator,
// 	DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Header } from '@tanstack/table-core'
// import {
// 	ChevronsUpDownIcon,
// 	ListXIcon,
// 	ArrowUpZAIcon,
// 	ArrowDownZAIcon,
// } from 'lucide-react'
import { useState } from 'react'
// import { ButtonNew } from '@/components/ui/button-new'

type TableHeaderActionsProps<T> = BaseComponentProps & {
	header: Header<T, unknown>
}

export function TableHeaderActions<TData>({
	header,
	children,
}: TableHeaderActionsProps<TData>) {
	const [open, setOpen] = useState(false)
	const currentActive = header.column.getIsSorted()

	return (
		// <DropdownMenu open={open} onOpenChange={setOpen}>
		// 	<DropdownMenuTrigger asChild>
		// 		<ButtonNew
		// 			size={'sm'}
		// 			variant={'ghost'}
		// 			className={cn(
		// 				'group flex items-center py-0 px-2 -mx-2 space-x-1.5 uppercase text-black/40 text-[11px]/6 tracking-normal font-bold text-left bg-transparent hover:bg-black/5 active:bg-black/10',
		// 				open && 'bg-black/5'
		// 			)}
		// 		>
		// 			<span>{children}</span>
		// 			<span className={cn(currentActive && '')}>
		// 				{{
		// 					asc: <ArrowUpZAIcon className="size-3.5 text-brand-600" />,
		// 					desc: <ArrowDownZAIcon className="size-3.5 text-brand-600" />,
		// 				}[header.column.getIsSorted() as string] ?? (
		// 					<ChevronsUpDownIcon className="size-3.5" />
		// 				)}
		// 			</span>
		// 		</ButtonNew>
		// 	</DropdownMenuTrigger>
		// 	<DropdownMenuContent>
		// 		<DropdownMenuLabel>Sorting</DropdownMenuLabel>
		// 		<DropdownMenuItem
		// 			onClick={() => header.column.toggleSorting(false)}
		// 			data-state={currentActive === 'asc' ? 'active' : undefined}
		// 		>
		// 			<ArrowUpZAIcon className="size-4 mr-2" />
		// 			Ascending
		// 		</DropdownMenuItem>
		// 		<DropdownMenuItem
		// 			onClick={() => header.column.toggleSorting(true)}
		// 			data-state={currentActive === 'desc' ? 'active' : undefined}
		// 		>
		// 			<ArrowDownZAIcon className="size-4 mr-2" />
		// 			Descending
		// 		</DropdownMenuItem>
		// 		<DropdownMenuSeparator />
		// 		<DropdownMenuItem onClick={() => header.column.clearSorting()}>
		// 			<ListXIcon className="size-4 mr-2" />
		// 			Clear sort
		// 		</DropdownMenuItem>
		// 	</DropdownMenuContent>
		// </DropdownMenu>
		<></>
	)
}
