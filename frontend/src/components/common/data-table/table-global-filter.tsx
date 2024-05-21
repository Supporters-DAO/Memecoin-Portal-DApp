import { Dispatch, SetStateAction } from 'react'
import { cn } from '@/lib/utils'
import { SearchForm } from './search-form'

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
		<SearchForm
			placeholder={globalFilterPlaceholder || 'Search'}
			onSearch={({ search }) => setGlobalFilter(String(search))}
			value={globalFilter || ''}
			autoSubmit
		/>
	)
}
