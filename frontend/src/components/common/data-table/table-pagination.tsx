import React, { useState } from 'react'
import { ButtonHTMLAttributes } from 'react'
import { Sprite } from '@/components/ui/sprite'
import { Table } from '@tanstack/react-table'

type TablePaginationProps<T> = {
	table: Table<T>
}

export function TablePagination<TData>({ table }: TablePaginationProps<TData>) {
	const pageIndex = table.getState().pagination.pageIndex
	const pageCount = table.getPageCount()

	const [inputPage, setInputPage] = useState('')
	const [showInput, setShowInput] = useState(false)

	const pageRange = getPageRange(pageIndex, pageCount)

	const handleGoToPage = () => {
		const page = Number(inputPage) - 1
		if (page >= 0 && page < pageCount) {
			table.setPageIndex(page)
		}
		setShowInput(false)
		setInputPage('')
	}

	return (
		<div className="m-3 flex items-center gap-2">
			<PaginationItem
				onClick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				<Sprite name="arrow-left" className="size-4" />
			</PaginationItem>

			{pageRange.map((page: number | string) => {
				if (page === '...') {
					return (
						<button
							key={page}
							onClick={() => setShowInput(true)}
							className="px-4 py-2"
						>
							{showInput ? (
								<div>
									<input
										type="number"
										value={inputPage}
										onChange={(e) => setInputPage(e.target.value)}
										onBlur={handleGoToPage}
										autoFocus
										className="w-8 border-none bg-transparent outline-none"
									/>
								</div>
							) : (
								'...'
							)}
						</button>
					)
				}
				return (
					<button
						key={page}
						className={`px-4 py-2 ${pageIndex + 1 === page ? 'rounded-lg bg-[#1D2C4B]' : ''}`}
						onClick={() => table.setPageIndex(Number(page) - 1)}
						disabled={pageIndex + 1 === page}
					>
						{page}
					</button>
				)
			})}

			<PaginationItem
				onClick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				<Sprite name="arrow-right" className="size-4" />
			</PaginationItem>
		</div>
	)
}

function PaginationItem({
	children,
	...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
	return (
		<button
			className="flex items-center justify-center rounded p-1.5 disabled:cursor-not-allowed disabled:text-[#FDFDFD]/[40%]"
			{...props}
		>
			{children}
		</button>
	)
}

function getPageRange(currentPage: number, pageCount: number) {
	if (pageCount <= 6) {
		return Array.from({ length: pageCount }, (_, i) => i + 1)
	}

	let pages = []
	const startPages = [1, 2, 3]
	const endPages = [pageCount - 2, pageCount - 1, pageCount].filter(
		(page) => page > 3
	)

	const nearStart = currentPage <= 3
	const nearEnd = currentPage >= pageCount - 3

	pages.push(...startPages)

	if (!nearStart) {
		pages.push('...')
	}

	if (!nearStart && !nearEnd) {
		const rangeStart = Math.max(4, currentPage - 1)
		const rangeEnd = Math.min(pageCount - 3, currentPage + 1)

		for (let i = rangeStart; i <= rangeEnd; i++) {
			pages.push(i)
		}
	}

	if (!nearEnd) {
		pages.push('...')
	}

	pages.push(...endPages)

	return pages
}
