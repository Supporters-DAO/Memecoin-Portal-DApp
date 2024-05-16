import { z } from 'zod'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDebounce } from '@/lib/hooks/use-debounce'
import { useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Sprite } from '@/components/ui/sprite'
import { TextField } from './text-field'

const schema = z.object({
	search: z.string(),
})

type IFormData = z.infer<typeof schema>

type Props = BaseComponentProps & {
	onSearch(data: IFormData): void
	value?: string
	placeholder?: string
	autoSubmit?: boolean
}

export function SearchForm({
	onSearch,
	value,
	autoSubmit = false,
	className,
	placeholder,
}: Props) {
	const { control, handleSubmit, getFieldState } = useForm<IFormData>({
		resolver: zodResolver(schema),
		values: { search: value || '' },
	})

	const onSubmit = useCallback(
		async (data: IFormData) => {
			onSearch && onSearch(data)
		},
		[onSearch]
	)

	const search = useWatch({
		control: control,
		name: 'search',
	})

	const debouncedValue = useDebounce(search, 500)

	// Trigger form submit
	useEffect(() => {
		if (!autoSubmit) return

		const search = getFieldState('search')
		if (search.isDirty) handleSubmit(onSubmit)()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [debouncedValue, getFieldState])

	return (
		<form
			className={cn('flex grow items-center', className)}
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="grow">
				<TextField
					control={control}
					name="search"
					label=""
					placeholder={placeholder || 'Search by user name, address'}
					autoComplete="off"
				/>
			</div>
		</form>
	)
}
