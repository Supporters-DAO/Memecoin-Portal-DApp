import * as React from 'react'

import { cn } from '@/lib/utils'

const Table = React.forwardRef<
	HTMLTableElement,
	React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
	<div className="relative w-full overflow-auto">
		<table
			ref={ref}
			className={cn(
				'w-full caption-bottom divide-y divide-neutral-700 text-sm',
				className
			)}
			{...props}
		/>
	</div>
))
Table.displayName = 'Table'

const TableHeader = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<thead
		ref={ref}
		className={cn(
			'whitespace-nowrap align-middle text-xs/5 [&_th:first-child]:pl-5 [&_th]:h-10',
			className
		)}
		{...props}
	/>
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tbody
		ref={ref}
		className={cn('divide-y divide-[#FDFDFD]/[4%] align-middle', className)}
		{...props}
	/>
))
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tfoot
		ref={ref}
		className={cn('bg-primary font-medium', className)}
		{...props}
	/>
))
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<
	HTMLTableRowElement,
	React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
	<tr ref={ref} className={className} {...props} />
))
TableRow.displayName = 'TableRow'

const TableRowClickable = React.forwardRef<
	HTMLTableRowElement,
	React.HTMLAttributes<HTMLTableRowElement> & { onRowClick?: () => void }
>(({ className, onRowClick, ...props }, ref) => (
	<tr
		ref={ref}
		className={className}
		{...props}
		onClick={onRowClick}
		style={{ cursor: 'pointer' }}
	/>
))
TableRowClickable.displayName = 'TableRowClickable'

const TableHead = React.forwardRef<
	HTMLTableCellElement,
	React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<th
		ref={ref}
		className={cn(
			'px-2 py-1 text-left font-medium text-neutral-300 [&:has([role=checkbox])]:pr-0',
			className
		)}
		{...props}
	/>
))
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<
	HTMLTableCellElement,
	React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<td ref={ref} className={cn('px-3.5 py-4', className)} {...props} />
))
TableCell.displayName = 'TableCell'

const TableCaption = React.forwardRef<
	HTMLTableCaptionElement,
	React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
	<caption ref={ref} className={cn('mt-4 text-sm', className)} {...props} />
))
TableCaption.displayName = 'TableCaption'

const Table2 = React.forwardRef<
	HTMLTableElement,
	React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
	<div className="relative w-full overflow-auto">
		<table ref={ref} className={cn('w-full', className)} {...props} />
	</div>
))
Table2.displayName = 'Table2'

const TableHeader2 = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<thead
		ref={ref}
		className={cn(
			'select-none text-left text-[11px]/6 font-bold tracking-[1px] text-black/40',
			className
		)}
		{...props}
	/>
))
TableHeader2.displayName = 'TableHeader2'

const TableBody2 = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tbody
		ref={ref}
		className={cn(
			'[&_td:first-child]:rounded-lg [&_td:first-child]:rounded-r-none [&_td:first-child]:border-l [&_td:first-child]:pl-[11px] [&_td:last-child]:rounded-lg [&_td:last-child]:rounded-l-none [&_td:last-child]:border-r [&_td:last-child]:pr-[11px] [&_td:only-child]:rounded-lg [&_td]:border [&_td]:border-x-0 [&_td]:border-black/[7%] [&_td]:bg-white [&_td]:leading-none',
			className
		)}
		{...props}
	/>
))
TableBody2.displayName = 'TableBody2'

const TableFooter2 = React.forwardRef<
	HTMLTableSectionElement,
	React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
	<tfoot ref={ref} className={className} {...props} />
))
TableFooter2.displayName = 'TableFooter2'

const TableRow2 = React.forwardRef<
	HTMLTableRowElement,
	React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
	<tr ref={ref} className={className} {...props} />
))
TableRow2.displayName = 'TableRow2'

const TableHead2 = React.forwardRef<
	HTMLTableCellElement,
	React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<th ref={ref} className={cn('px-3 pb-px pt-0', className)} {...props} />
))
TableHead2.displayName = 'TableHead2'

const TableCell2 = React.forwardRef<
	HTMLTableCellElement,
	React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
	<td ref={ref} className={cn('px-3 py-[11px]', className)} {...props} />
))
TableCell2.displayName = 'TableCell2'

const TableCaption2 = React.forwardRef<
	HTMLTableCaptionElement,
	React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
	<caption ref={ref} className={className} {...props} />
))
TableCaption2.displayName = 'TableCaption2'

export {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableRowClickable,
	TableCell,
	TableCaption,
	Table2,
	TableHeader2,
	TableBody2,
	TableFooter2,
	TableHead2,
	TableRow2,
	TableCell2,
	TableCaption2,
}
