'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'

import { Input } from '@/components/ui/input'
import { DataTable } from '@/components/common/data-table'
import { BackButton } from '@/components/common/back-button'
import { coinsTypesTableColumns } from './table.columns'
import { useFetchCoins } from '@/lib/hooks/use-fetch-coins'

export const AllCoins = () => {
	const { tokenData } = useFetchCoins(20, 0)
	const router = useRouter()

	const table = useReactTable({
		data: tokenData,
		columns: coinsTypesTableColumns,
		getCoreRowModel: getCoreRowModel(),
	})

	const handleRowClick = (row: any) => {
		router.push(`/tokens/${row.original.id}`)
	}

	return (
		<div className="ju my-10 flex flex-col gap-8">
			<BackButton />
			<div className="flex flex-col  gap-3">
				<div className="flex items-center justify-between">
					<h1 className="text-[28px] text-primary">All Memecoins</h1>
					<Input type="text" label="" placeholder="Search" />
				</div>
			</div>

			<DataTable table={table} onRowClick={handleRowClick} />
		</div>
	)
}
