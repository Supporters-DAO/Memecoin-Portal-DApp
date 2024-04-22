'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'

import { DataTable } from '@/components/common/data-table'
import { BackButton } from '@/components/common/back-button'
import { coinsTypesTableColumns } from './table.columns'
import { useFetchCoins } from '@/lib/hooks/use-fetch-coins'
import { fuzzyFilter } from '@/components/common/data-table/fuzzy-filter'

export const AllCoins = () => {
	const router = useRouter()
	const [globalFilter, setGlobalFilter] = useState('')
	const { tokenData } = useFetchCoins(20, 0, globalFilter)

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
				nameTable="All Memecoins"
				table={table}
				onRowClick={handleRowClick}
				setGlobalFilter={setGlobalFilter}
				globalFilter={globalFilter}
			/>
		</div>
	)
}

// A debounced input react component
function DebouncedInput({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}: {
	value: string | number
	onChange: (value: string | number) => void
	debounce?: number
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
	const [value, setValue] = React.useState(initialValue)

	React.useEffect(() => {
		setValue(initialValue)
	}, [initialValue])

	React.useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value)
		}, debounce)

		return () => clearTimeout(timeout)
	}, [value])

	return (
		<input
			{...props}
			value={value}
			onChange={(e) => setValue(e.target.value)}
		/>
	)
}
