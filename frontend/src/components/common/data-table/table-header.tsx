import { flexRender, Table as ITable } from '@tanstack/react-table'
import { TableHeaderActions } from '@/components/common/data-table/table-header-actions'
import {
	TableHead,
	TableHead2,
	TableHeader,
	TableHeader2,
	TableRow,
	TableRow2,
} from '@/components/ui/table'
import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props<T> = BaseComponentProps & {
	table: ITable<T>
	isLoading?: boolean
	prefix?: ReactNode
	postfix?: ReactNode
}

export function TableDefaultHeader<TData>({
	table,
	isLoading,
	className,
	prefix,
	postfix,
}: Props<TData>) {
	return (
		<TableHeader2
			className={cn(
				'whitespace-nowrap [&_th:first-child]:pl-4 lg:[&_th:last-child]:pr-4',
				className
			)}
		>
			{table.getHeaderGroups().map((headerGroup) => (
				<TableRow2 key={headerGroup.id}>
					{prefix}
					{headerGroup.headers.map((header) => (
						<TableHead2
							key={header.id}
							colSpan={header.colSpan}
							scope="col"
							className="font-medium"
							style={{
								width: header.getSize() !== 150 ? header.getSize() : undefined,
							}}
						>
							{header.isPlaceholder ? null : (
								<>
									{header.column.getCanSort() ? (
										<TableHeaderActions header={header}>
											{flexRender(
												header.column.columnDef.header,
												header.getContext()
											)}
										</TableHeaderActions>
									) : (
										flexRender(
											header.column.columnDef.header,
											header.getContext()
										)
									)}
								</>
							)}
						</TableHead2>
					))}
					{postfix}
				</TableRow2>
			))}
		</TableHeader2>
	)
}
