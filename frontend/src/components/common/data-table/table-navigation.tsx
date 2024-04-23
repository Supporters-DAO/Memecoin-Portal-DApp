import { TableGoToPage } from '@/components/common/data-table/table-go-to-page'
import { TablePageSizing } from '@/components/common/data-table/table-page-sizing'
import { TablePagination } from '@/components/common/data-table/table-pagination'
import { Table } from '@tanstack/react-table'

type TableNavigationProps<T> = BaseComponentProps & {
	table: Table<T>
	total?: number
	limit: number
}

export function TableNavigation<TData>({
	table,
	total,
	limit,
}: TableNavigationProps<TData>) {
	const pageMax = limit && total ? Math.ceil(total / limit) : 0
	const showPagination = pageMax > 1

	return (
		<div className="flex justify-between font-poppins max-md:flex-col max-md:space-y-5 md:items-center md:space-x-5">
			{showPagination && <TablePagination table={table} />}
			<TablePageSizing table={table} limit={limit} />
		</div>
	)
}
