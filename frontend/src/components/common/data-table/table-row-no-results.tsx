import { TableCell2, TableRow2 } from '@/components/ui/table'
import { Table as ITable } from '@tanstack/table-core/build/lib/types'

type TableRowNoResultsProps<T> = BaseComponentProps & {
	table: ITable<T>
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
