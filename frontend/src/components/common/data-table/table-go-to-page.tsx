import { Table } from '@tanstack/react-table'
import { ChangeEvent, useState } from 'react'
import { cn } from '@/lib/utils'
// import { ButtonNew } from '@/components/ui/button-new'
// import { ArrowUp, ChevronUp, Minus, Plus } from 'lucide-react'

type TableGoToPageProps<T> = BaseComponentProps & {
	table: Table<T>
	pageMax: number
}

export function TableGoToPage<TData>({
	table,
	pageMax,
	className,
}: TableGoToPageProps<TData>) {
	const [value, setValue] = useState<number | string>(1)
	const [page, setPage] = useState<number>(
		table.getState().pagination.pageIndex + 1
	)

	function onManualPageChange(e: ChangeEvent<HTMLInputElement>) {
		let candidate = +e.target.value || 0
		setValue(e.target.value)

		if (candidate >= pageMax) {
			candidate = pageMax
		}
		if (candidate < 0) {
			candidate = 1
		}

		table.setPageIndex(candidate - 1)
		setPage(candidate)
	}

	return (
		<div className={cn('whitespace-nowrap text-sm', className)}>
			<label className="flex items-center gap-2">
				<span>Go to page:</span>
				<span className="flex space-x-2 rounded bg-white p-0.5 pl-3 ring-1 ring-inset ring-black/10">
					<input
						type="number"
						value={value}
						min={1}
						max={pageMax}
						onChange={onManualPageChange}
						className="min-w-7 p-0"
						autoComplete={'off'}
					/>
					<span className="inline-flex flex-col justify-center">
						{/* <ButtonNew
							variant={'ghost'}
							className="p-0.5 leading-none"
							onClick={() => {
								if (page >= pageMax) return
								const candidate = table.getState().pagination.pageIndex + 1
								table.setPageIndex(candidate)
								setPage(candidate + 1)
								setValue(candidate + 1)
							}}
							disabled={page >= pageMax}
						>
							<ChevronUp className="size-3" />
						</ButtonNew>
						<ButtonNew
							variant={'ghost'}
							className="p-0 leading-none"
							onClick={() => {
								if (page === 1) return
								const candidate = table.getState().pagination.pageIndex - 1
								table.setPageIndex(candidate)
								setPage(candidate + 1)
								setValue(candidate + 1)
							}}
							disabled={page === 1}
						>
							<ChevronUp className="size-3 rotate-180" />
						</ButtonNew> */}
					</span>
				</span>
			</label>
		</div>
	)
}
