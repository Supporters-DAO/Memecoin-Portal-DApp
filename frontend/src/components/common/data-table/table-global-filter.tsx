import { Dispatch, SetStateAction } from 'react'
import { cn } from '@/lib/utils'
// import { SearchForm } from '@/components/sections/ecosystem/projects/common/search-form'

type TableGlobalFilterProps = BaseComponentProps & {
	globalFilter?: string
	setGlobalFilter: Dispatch<SetStateAction<string>>
	globalFilterPlaceholder?: string
}

export function TableGlobalFilter({
	setGlobalFilter,
	globalFilterPlaceholder,
	globalFilter,
	className,
}: TableGlobalFilterProps) {
	return (
		// <SearchForm
		// 	className={cn(
		// 		'md:basis-[280px] grow-0 py-0 px-3 bg-white ring-1 ring-inset ring-black/10 rounded [&_svg]:size-4.5',
		// 		className
		// 	)}
		// 	placeholder={globalFilterPlaceholder || 'Search all columns...'}
		// 	onSearch={({ search }) => setGlobalFilter(String(search))}
		// 	value={globalFilter || ''}
		// 	autoSubmit
		// />
		<></>
	)
}
