import { flexRender, Table as ITable } from '@tanstack/react-table'
import {
	TableBody,
	TableBody2,
	TableCell,
	TableCell2,
	TableRow,
	TableRow2,
} from '@/components/ui/table'
import { TableWrapper } from '@/components/common/data-table/table-wrapper'
import { TableDefaultHeader } from '@/components/common/data-table/table-header'
import { TableRowNoResults } from '@/components/common/data-table/table-row-no-results'
import { TableRowSkeleton } from '@/components/common/data-table/table-row-skeleton'

type TableLayoutProps<T> = BaseComponentProps & {
	table: ITable<T>
	isLoading?: boolean
}

export function TableLayout<TData>({
	table,
	isLoading,
	className,
}: TableLayoutProps<TData>) {
	return (
		<TableWrapper className={className}>
			<TableDefaultHeader
				table={table}
				isLoading={isLoading}
				className="text-[14px]/[1.5] text-white [&_th]:pb-2"
			/>

			<TableBody className="border-t border-[#FDFDFD]/[4%] text-[16px]/[1.5] [&_td:first-child]:pl-4 lg:[&_td:last-child]:pr-4">
				{isLoading ? (
					<TableRowSkeleton table={table} />
				) : table.getRowModel().rows?.length > 0 ? (
					table.getRowModel().rows.map((row) => (
						<TableRow key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<TableCell
									key={cell.id}
									// className="!bg-[#1D2C4B]"
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</TableCell>
							))}
						</TableRow>
					))
				) : (
					<TableRowNoResults table={table} />
				)}
			</TableBody>
		</TableWrapper>
	)
}
