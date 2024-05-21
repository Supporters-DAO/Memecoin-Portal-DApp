'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
	PaginationState,
	getCoreRowModel,
	useReactTable,
} from '@tanstack/react-table'
import { Input } from '@/components/ui/input'
import { coinsTypesTableColumns } from './table.columns'
import { DataTable } from '@/components/common/data-table'
import { BackButton } from '@/components/common/back-button'
import { useFetchMyCoins } from '@/lib/hooks/use-fetch-my-coins'
import { fuzzyFilter } from '@/components/common/data-table/fuzzy-filter'

export const MyCoins = () => {
	const router = useRouter()
	const [globalFilter, setGlobalFilter] = useState('')

	const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	})

	const pagination = useMemo(
		() => ({
			pageIndex,
			pageSize,
		}),
		[pageIndex, pageSize]
	)

	const { tokenData, totalCoins } = useFetchMyCoins(
		pagination.pageSize,
		pagination.pageIndex * pagination.pageSize,
		globalFilter
	)

	useEffect(() => {
		if (globalFilter) {
			setPagination({ pageIndex: 0, pageSize: pagination.pageSize })
		}
	}, [globalFilter, totalCoins])

	const table = useReactTable({
		data: tokenData,
		columns: coinsTypesTableColumns,
		getCoreRowModel: getCoreRowModel(),
		filterFns: {
			fuzzy: fuzzyFilter,
		},
		state: {
			globalFilter,
		},
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: fuzzyFilter,
	})

	const handleRowClick = (row: any) => {
		router.push(`/tokens/${row.original.id}`)
	}

	return (
		<div className="ju my-10 flex flex-col gap-8">
			<BackButton />

			<DataTable
				table={table}
				onRowClick={handleRowClick}
				nameTable="My Coins - My Rules"
				setGlobalFilter={setGlobalFilter}
				globalFilter={globalFilter}
				total={totalCoins}
				limit={pagination.pageSize}
			/>
		</div>
	)
}
