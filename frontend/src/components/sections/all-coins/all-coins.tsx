'use client'

import React from 'react'
import { useFetchCoins } from './hooks/use-fetch-coins'
import Link from 'next/link'
import { Sprite } from '@/components/ui/sprite'
import { Input } from '@/components/ui/input'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { coinsTypesTableColumns } from './table.columns'
import { DataTable } from '@/components/common/data-table'

export const AllCoins = () => {
	const { tokenData } = useFetchCoins(10, 0)

	const table = useReactTable({
		data: tokenData,
		columns: coinsTypesTableColumns,
		getCoreRowModel: getCoreRowModel(),
	})

	return (
		<div className="ju my-10 flex flex-col gap-8">
			<Link href="/" className="mr-40 flex items-center gap-3 text-xl">
				<Sprite name="arrow-left" className="size-6 " />
				Main page
			</Link>
			<div className="flex flex-col  gap-3">
				<div className="flex items-center justify-between">
					<h1 className="text-[28px] text-primary">All Memecoins</h1>
					<Input type="text" label="" placeholder="Search" />
				</div>
			</div>

			<DataTable table={table} />
		</div>
	)
}
