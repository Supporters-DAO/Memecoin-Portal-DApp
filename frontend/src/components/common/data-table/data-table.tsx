import { Table } from '@tanstack/react-table'
import { Dispatch, SetStateAction } from 'react'
import { TableLayout } from '@/components/common/data-table/table-layout'
import { TableNavigation } from '@/components/common/data-table/table-navigation'
import { TableGlobalFilter } from '@/components/common/data-table/table-global-filter'
import { TableLayoutWrapper } from '@/components/common/data-table/table-layout-wrapper'
import { MobileList } from './mobile-list-coins'
import { Token } from '@/lib/hooks/use-fetch-coins'
import { useCheckMobileSize } from '@/lib/hooks/use-check-mobile-size'

type ContentTableLayoutProps<T> = BaseComponentProps & {
	table: Table<T>
	total?: number
	globalFilter?: string
	setGlobalFilter?: Dispatch<SetStateAction<string>>
	globalFilterPlaceholder?: string
	isLoading?: boolean
	onRowClick?: any
	nameTable?: string
	limit?: number
}

export function DataTable<TData>({
	table,
	total,
	globalFilter,
	setGlobalFilter,
	globalFilterPlaceholder,
	isLoading,
	onRowClick,
	nameTable,
	limit = 10,
}: ContentTableLayoutProps<TData>) {
	const isMobile = useCheckMobileSize()
	return (
		<TableLayoutWrapper>
			<div className="flex items-center justify-between max-sm:flex-col max-sm:gap-5">
				{nameTable && (
					<h1 className="w-full text-[28px] text-primary max-sm:text-center max-sm:text-[16px]">
						{nameTable}
					</h1>
				)}
				{setGlobalFilter && (
					<TableGlobalFilter
						globalFilter={globalFilter}
						setGlobalFilter={setGlobalFilter}
						globalFilterPlaceholder={globalFilterPlaceholder}
					/>
				)}
			</div>
			{isMobile ? (
				<MobileList data={table.options.data as Token[]} />
			) : (
				<TableLayout
					table={table}
					isLoading={isLoading}
					className="rounded-2xl bg-[#1D2C4B] p-8 font-poppins"
					onRowClick={onRowClick}
				/>
			)}

			{table.options.data.length > 0 && (
				<TableNavigation table={table} total={total} limit={limit} />
			)}
		</TableLayoutWrapper>
	)
}
