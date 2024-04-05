import { TextareaHTMLAttributes } from 'react'

export interface InputProps
	extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'> {
	size?: 'large' | 'medium' | 'small'
	label?: string
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	error?: any
}
