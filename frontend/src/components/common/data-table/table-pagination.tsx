import { Table } from '@tanstack/react-table'
// import { ChevronLeft, ChevronsLeft } from 'lucide-react'
import { ButtonHTMLAttributes, HTMLAttributes } from 'react'

type TablePaginationProps<T> = {
	table: Table<T>
}

export function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
	return (
		<div className="flex items-center gap-2">
			<PaginationItem
				onClick={() => table.setPageIndex(0)}
				disabled={!table.getCanPreviousPage()}
			>
				{/* <ChevronsLeft className="size-4" /> */}
			</PaginationItem>
			<PaginationItem
				onClick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				{/* <ChevronLeft className="size-4" /> */}
			</PaginationItem>
			<PaginationItem
				onClick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				{/* <ChevronLeft className="size-4 rotate-180" /> */}
			</PaginationItem>
			<PaginationItem
				onClick={() => table.setPageIndex(table.getPageCount() - 1)}
				disabled={!table.getCanNextPage()}
			>
				{/* <ChevronsLeft className="size-4 rotate-180" /> */}
			</PaginationItem>
		</div>
	)
}

export function PaginationItem({
	children,
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className="flex items-center justify-center rounded border border-black/10 bg-white p-1.5 transition-colors enabled:hover:bg-black/5 enabled:hover:text-black/80 disabled:cursor-not-allowed disabled:text-black/20"
			{...props}
		>
			{children}
		</button>
	)
}
