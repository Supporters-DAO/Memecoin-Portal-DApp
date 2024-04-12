// import {
// 	Select,
// 	SelectContent,
// 	SelectItem,
// 	SelectTrigger,
// 	SelectValue,
// } from '@/components/ui/select'
// import { PaginationConstants } from '@/lib/constants'
import { Table } from '@tanstack/react-table'
import { cn } from '@/lib/utils'

type TablePageSizingProps<T> = BaseComponentProps & {
	table: Table<T>
}

export function TablePageSizing<TData>({
	table,
	className,
}: TablePageSizingProps<TData>) {
	return (
		<div className={cn('flex items-center space-x-5 w-fit', className)}>
			<p className="text-sm/5 basis-full">Rows per page</p>
			<div className="w-fit whitespace-nowrap">
				{/* <Select
					value={`${table.getState().pagination.pageSize}`}
					onValueChange={(value) => {
						table.setPageSize(Number(value))
					}}
				>
					<SelectTrigger className="min-h-min py-1.5 px-3 ring-1 ring-inset ring-black/10">
						<SelectValue className="text-base" />
					</SelectTrigger>
					<SelectContent side="top">
						{[
							PaginationConstants.posts,
							PaginationConstants.posts * 2,
							PaginationConstants.posts * 3,
							PaginationConstants.posts * 4,
							PaginationConstants.posts * 5,
						].map((option) => (
							<SelectItem value={String(option)} key={option}>
								{option}
							</SelectItem>
						))}
					</SelectContent>
				</Select> */}
			</div>
		</div>
	)
}
