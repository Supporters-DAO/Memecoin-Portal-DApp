import { Table2 } from '@/components/ui/table'
import { cn } from '@/lib/utils'

type Props = BaseComponentProps & {}

export function TableWrapper({ className, children }: Props) {
	return (
		<div className={cn('text-sm overflow-hidden', className)}>
			<Table2>{children}</Table2>
		</div>
	)
}
