import { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'

import { Token } from './hooks/use-fetch-coins'
import { copyToClipboard, prettyWord } from '@/lib/utils'
import { Sprite } from '@/components/ui/sprite'

const handleCopyClickAddress = async (address: string) => {
	await copyToClipboard({ value: address })
}

export const coinsTypesTableColumns: ColumnDef<Token>[] = [
	{
		accessorFn: (row) => row.image,
		id: 'image',
		cell: (info) => (
			<>
				<Image
					src={info.row.original.image}
					alt={info.row.original.name}
					width={60}
					height={60}
					className="h-15 w-15 rounded-full object-cover"
					unoptimized={true}
				/>
			</>
		),
		header: 'Image',
		enableSorting: false,
	},
	{
		accessorFn: (row) => row.name,
		id: 'name',
		cell: (info) => (
			<div className="flex h-full flex-col">{info.row.original.name}</div>
		),
		header: () => <div className="group flex items-center">Name</div>,
		enableSorting: false,
	},
	{
		accessorFn: (row) => row.symbol,
		id: 'symbol',
		cell: (info) => (
			<div className="text-center">{info.row.original.symbol}</div>
		),
		header: () => (
			<div className="group flex items-center justify-center">Symbol</div>
		),
		enableSorting: false,
	},
	{
		accessorFn: (row) => row.initialSupply,
		id: 'initialSupply',
		cell: (info) => (
			<div className="text-right">{info.row.original.initialSupply}</div>
		),
		header: () => (
			<div className="group flex items-center justify-end">Initial Supply</div>
		),
		enableSorting: false,
	},
	{
		accessorFn: (row) => row.maxSupply,
		id: 'maxSupply',
		cell: (info) => (
			<div className="text-right">{info.row.original.maxSupply}</div>
		),
		header: () => (
			<div className="group flex items-center justify-end">Total Supply</div>
		),
		enableSorting: false,
	},
	{
		accessorFn: (row) => row.distributed,
		id: 'distributed',
		cell: (info) => (
			<div className="text-right">
				{(
					(Number(info.row.original.distributed) /
						Number(info.row.original.maxSupply)) *
					100
				).toFixed(2)}
				%
			</div>
		),
		header: () => (
			<div className="group flex items-center justify-end">Distributed</div>
		),
		enableSorting: false,
	},
	{
		accessorFn: (row) => row.id,
		id: 'address',
		cell: (info) => (
			<div className="flex items-center justify-center gap-3 text-center">
				{prettyWord(info.row.original.id)}
				<button onClick={() => handleCopyClickAddress(info.row.original.id)}>
					<Sprite name="copy" size={16} />
				</button>
			</div>
		),
		header: () => (
			<div className="group flex items-center justify-center">Address</div>
		),
		enableSorting: false,
	},
]