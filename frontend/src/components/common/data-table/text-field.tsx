import {
	FieldError,
	FieldPath,
	FieldValues,
	useController,
	UseControllerProps,
} from 'react-hook-form'
import { useId } from 'react'
import { Input } from '@/components/ui/input'

export type FieldTextProps = InputProps & {
	label: string
	help?: string
	error?: FieldError
	classNameWrapper?: string
}

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

type TextFieldProps = InputProps &
	Pick<FieldTextProps, 'label' | 'help' | 'classNameWrapper'>

export function TextField<
	TFieldValues extends FieldValues = FieldValues,
	TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
	name,
	shouldUnregister,
	rules,
	control,
	defaultValue,
	...rest
}: UseControllerProps<TFieldValues, TName> & TextFieldProps) {
	const {
		field: { ref, ...field },
	} = useController({
		name,
		shouldUnregister,
		rules,
		control,
		defaultValue,
	})

	return (
		<Input
			className={rest.className}
			{...rest}
			{...field}
			onChange={(e) => {
				field.onChange(e)
				rest.onChange && rest?.onChange(e)
			}}
		/>
	)
}
