import { TableCell2, TableRow2 } from '@/components/ui/table'
import { Table } from '@tanstack/react-table'

type TableRowNoResultsProps<T> = BaseComponentProps & {
	table: Table<T>
}

export function TableRowNoResults<TData>({
	children,
	table,
}: TableRowNoResultsProps<TData>) {
	return (
		<TableRow2 className="">
			<TableCell2
				colSpan={table.getAllColumns().length}
				className="h-24 text-center align-middle"
			>
				{children || 'No results.'}
			</TableCell2>
		</TableRow2>
	)
}
