import { Table } from '@tanstack/react-table'
import { Dispatch, SetStateAction } from 'react'
import { TableLayout } from '@/components/common/data-table/table-layout'
import { TableNavigation } from '@/components/common/data-table/table-navigation'
import { TableGlobalFilter } from '@/components/common/data-table/table-global-filter'
import { TableLayoutWrapper } from '@/components/common/data-table/table-layout-wrapper'

type ContentTableLayoutProps<T> = BaseComponentProps & {
	table: Table<T>
	total?: number
	globalFilter?: string
	setGlobalFilter?: Dispatch<SetStateAction<string>>
	globalFilterPlaceholder?: string
	isLoading?: boolean
	onRowClick?: any
}

export function DataTable<TData>({
	table,
	total,
	globalFilter,
	setGlobalFilter,
	globalFilterPlaceholder,
	isLoading,
	onRowClick,
}: ContentTableLayoutProps<TData>) {
	return (
		<TableLayoutWrapper>
			{setGlobalFilter && (
				<TableGlobalFilter
					globalFilter={globalFilter}
					setGlobalFilter={setGlobalFilter}
					globalFilterPlaceholder={globalFilterPlaceholder}
				/>
			)}

			<TableLayout
				table={table}
				isLoading={isLoading}
				className="rounded-2xl bg-[#1D2C4B] p-8 font-poppins"
				onRowClick={onRowClick}
			/>

			<TableNavigation table={table} total={total} />
		</TableLayoutWrapper>
	)
}
