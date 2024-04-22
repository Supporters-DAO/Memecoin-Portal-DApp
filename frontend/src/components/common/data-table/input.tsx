import { cn } from '@/lib/utils'
import * as React from 'react'

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
	({ className, ...props }, ref) => {
		return <input className={cn('', className)} ref={ref} {...props} />
	}
)
Input.displayName = 'Input'
