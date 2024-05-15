import { flexRender, Table as ITable } from '@tanstack/react-table'
import { TableBody, TableCell, TableRowClickable } from '@/components/ui/table'
import { TableWrapper } from '@/components/common/data-table/table-wrapper'
import { TableDefaultHeader } from '@/components/common/data-table/table-header'
import { TableRowNoResults } from '@/components/common/data-table/table-row-no-results'
import { TableRowSkeleton } from '@/components/common/data-table/table-row-skeleton'

type TableLayoutProps<T> = BaseComponentProps & {
	table: ITable<T>
	isLoading?: boolean
	onRowClick?: any
}

export function TableLayout<TData>({
	table,
	isLoading,
	className,
	onRowClick,
}: TableLayoutProps<TData>) {
	return (
		<TableWrapper className={className}>
			<TableDefaultHeader
				table={table}
				isLoading={isLoading}
				className="text-[14px]/[1.5] text-white [&_th]:pb-2"
			/>

			<TableBody className="border-t border-[#FDFDFD]/[4%] text-[16px]/[1.5] [&_td:first-child]:px-4 lg:[&_td:last-child]:pr-4">
				{isLoading ? (
					<TableRowSkeleton table={table} />
				) : table.getRowModel().rows?.length > 0 ? (
					table.getRowModel().rows.map((row) => (
						<TableRowClickable
							key={row.id}
							onRowClick={() => onRowClick && onRowClick(row)}
							className=" hover:bg-[#FDFDFD]/[5%]"
						>
							{row.getVisibleCells().map((cell) => (
								<TableCell
									key={cell.id}
									className="first:rounded-l-2xl last:rounded-r-2xl"
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRowClickable>
					))
				) : (
					<TableRowNoResults table={table} />
				)}
			</TableBody>
		</TableWrapper>
	)
}
