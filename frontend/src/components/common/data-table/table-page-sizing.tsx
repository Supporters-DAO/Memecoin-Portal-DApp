import { Table } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'

type TablePageSizingProps<T> = BaseComponentProps & {
	table: Table<T>
	limit: number
}

export function TablePageSizing<TData>({
	table,
	className,
	limit,
}: TablePageSizingProps<TData>) {
	return (
		<div
			className={cn(
				'ml-auto flex w-fit items-center space-x-5 font-poppins',
				className
			)}
		>
			<div className="w-fit whitespace-nowrap rounded-lg bg-[#1D2C4B]">
				<Select
					value={`${table.getState().pagination.pageSize}`}
					onValueChange={(value) => {
						table.setPageSize(Number(value))
					}}
				>
					<SelectTrigger className="min-h-min px-4 py-3">
						<SelectValue className="font-poppins" />
					</SelectTrigger>
					<SelectContent side="bottom">
						{[limit, limit * 2, limit * 3, limit * 5, limit * 10].map(
							(option) => (
								<SelectItem value={String(option)} key={option}>
									{option} per page
								</SelectItem>
							)
						)}
					</SelectContent>
				</Select>
			</div>
		</div>
	)
}
