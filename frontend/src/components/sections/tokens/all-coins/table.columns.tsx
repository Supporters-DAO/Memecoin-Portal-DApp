import { ColumnDef } from '@tanstack/react-table'
import { type AlertContainerFactory, useAlert } from '@gear-js/react-hooks'
import Image from 'next/image'

import { copyToClipboard, prettyWord } from '@/lib/utils'
import { Sprite } from '@/components/ui/sprite'
import { Token } from '@/lib/hooks/use-fetch-coins'

const handleCopyClickAddress = async (
	address: string,
	alert?: AlertContainerFactory
) => {
	await copyToClipboard({ value: address, alert })
}

export const coinsTypesTableColumns: ColumnDef<Token>[] = [
	{
		accessorFn: (row) => row.image,
		id: 'image',
		cell: (info) => (
			<>
				<Image
					src={info?.row?.original?.image}
					alt={info?.row?.original?.name}
					width={60}
					height={60}
					className="size-15 rounded-full object-cover"
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
			<div className="text-right">
				{Number(info.row.original.initialSupply).toLocaleString('us')}
			</div>
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
			<div className="text-right">
				{Number(info.row.original.maxSupply).toLocaleString('us')}
			</div>
		),
		header: () => (
			<div className="group flex items-center justify-end">Total Supply</div>
		),
		enableSorting: false,
	},
	{
		accessorFn: (row) => row.circulatingSupply,
		id: 'circulatingSupply',
		cell: (info) => (
			<div className="text-right">
				{Number(info.row.original.circulatingSupply).toLocaleString('us')}
			</div>
		),
		header: () => (
			<div className="group flex items-center justify-center">Circ. Supply</div>
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
		accessorFn: (row) => row.holders,
		id: 'holders',
		cell: (info) => (
			<div className="text-right">
				{Number(info.row.original.holders).toLocaleString('us')}
			</div>
		),
		header: () => (
			<div className="group flex items-center justify-center">Holders</div>
		),
		enableSorting: false,
	},
	{
		accessorFn: (row) => row.id,
		id: 'address',
		cell: (info) => TokenId(info.row.original.id),
		header: () => (
			<div className="group flex items-center justify-center">Address</div>
		),
		enableSorting: false,
	},
]

function TokenId(id: string) {
	const alert = useAlert()

	return (
		<div className="flex items-center justify-center gap-3 text-center">
			{prettyWord(id)}
			<button
				onClick={(e) => {
					e.stopPropagation()
					handleCopyClickAddress(id, alert)
				}}
			>
				<Sprite name="copy" size={16} />
			</button>
		</div>
	)
}
