import { TableCell2, TableRow2 } from '@/components/ui/table'
import { cn } from '@/lib/utils'
import { Table as ITable } from '@tanstack/table-core/build/lib/types'
// import { SkeletonSingle } from '@/components/skeletons/skeleton-single'

type TableRowSkeletonProps<T> = BaseComponentProps & {
	table: ITable<T>
}

export function TableRowSkeleton<TData>({
	table,
	className,
}: TableRowSkeletonProps<TData>) {
	return Array.from({ length: table.getState().pagination.pageSize }).map(
		(row, i) => (
			<TableRow2 key={i} className={cn('animate-pulse', className)}>
				{Array.from({
					length: table.getIsAllColumnsVisible()
						? table.getAllColumns().length
						: table.getVisibleFlatColumns().length,
				}).map((row, i) => (
					<TableCell2
						key={i}
						className={cn(
							'w-25',
							i === 0 && 'w-[500px]',
							i === table.getAllColumns().length - 1 && 'w-12'
						)}
					>
						{/* <SkeletonSingle className="rounded-lg bg-black/[7%] h-6 w-full" /> */}
					</TableCell2>
				))}
			</TableRow2>
		)
	)
}
