import { cn } from '@/lib/utils'

type TableLayoutWrapperProps = BaseComponentProps & {}

export function TableLayoutWrapper({
	children,
	className,
}: TableLayoutWrapperProps) {
	return <div className={cn('space-y-4', className)}>{children}</div>
}
