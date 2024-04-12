import { TableGoToPage } from '@/components/common/data-table/table-go-to-page'
import { TablePageSizing } from '@/components/common/data-table/table-page-sizing'
import { TablePagination } from '@/components/common/data-table/table-pagination'
import { Table } from '@tanstack/react-table'

type TableNavigationProps<T> = BaseComponentProps & {
	table: Table<T>
	total?: number
}

export function TableNavigation<TData>({
	table,
	total,
}: TableNavigationProps<TData>) {
	const limit = 10
	const pageMax = limit && total ? Math.ceil(total / limit) : 0
	const showPagination = pageMax > 1

	return showPagination ? (
		<div className="flex justify-between max-md:flex-col max-md:space-y-5 md:items-center md:space-x-5">
			<TableGoToPage
				table={table}
				pageMax={pageMax}
				className="max-lg:hidden md:mr-auto"
			/>
			<TablePageSizing table={table} />
			<div className="flex space-x-5">
				<div className="flex items-center gap-1 text-sm">
					<span>Page</span>
					<span>
						{table.getState().pagination.pageIndex + 1} of{' '}
						{table.getPageCount()}
					</span>
				</div>
				<TablePagination table={table} />
			</div>
		</div>
	) : null
}
