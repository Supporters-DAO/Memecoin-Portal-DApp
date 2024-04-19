import { ColumnDef } from '@tanstack/react-table'
import { type AlertContainerFactory, useAlert } from '@gear-js/react-hooks'
import Image from 'next/image'

import { copyToClipboard, prettyWord } from '@/lib/utils'
import { Sprite } from '@/components/ui/sprite'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useFetchBalances } from '@/lib/hooks/use-fetch-balances'
import { Token } from '@/lib/hooks/use-fetch-coins'
import { Mint } from '@/components/common/token-mint'

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
					// unoptimized={true}
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
	{
		accessorFn: (row) => row.id,
		id: 'Balance',
		cell: (info) => Balance(info.row.original.id),
		header: () => (
			<div className="group flex items-center justify-center">Balance</div>
		),
		enableSorting: false,
	},
	{
		accessorFn: (row) => row.id,
		id: 'buttons',
		header: () => <div className="items-right justify-right group flex"></div>,
		cell: (info) =>
			Buttons(
				info.row.original.id,
				parseFloat(info.row.original.maxSupply) -
					parseFloat(info.row.original.circulatingSupply)
			),
		enableSorting: false,
	},
]

function TokenId(id: string) {
	const alert = useAlert()

	return (
		<div className="flex items-center justify-center gap-3 text-center">
			{prettyWord(id)}
			<button onClick={() => handleCopyClickAddress(id, alert)}>
				<Sprite name="copy" size={16} />
			</button>
		</div>
	)
}

function Balance(id: string) {
	const { balances } = useFetchBalances()

	return (
		<div className="flex items-center justify-center gap-3 text-center">
			{balances.find((b) => b.coin.id === id)?.balance || 0}
		</div>
	)
}

function Buttons(id: string, availableMint: number) {
	const [isOpenMintModal, setIsOpenMintModal] = useState(false)
	const [open, setOpen] = useState(false)
	const router = useRouter()

	return (
		<>
			<Mint
				isMintModalOpen={isOpenMintModal}
				available={availableMint}
				id={id}
				mintModalHandler={setIsOpenMintModal}
			/>

			<DropdownMenu open={open} onOpenChange={setOpen}>
				<DropdownMenuTrigger asChild>
					<button type="button" className="link-primary -mr-2 inline-flex p-2 ">
						<Sprite name="more" color="white" className="size-6" />
					</button>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					align="end"
					side="bottom"
					className="min-w-35 rounded-lg border-2 border-[#2E3B55] bg-[#1D2C4B] font-poppins text-[14px] leading-none tracking-[0.03em] md:mt-2"
				>
					<DropdownMenuItem
						onClick={(e: { stopPropagation: () => void }) => {
							e.stopPropagation()
							router.push(`/tokens/${id}/send/`)
						}}
						className="flex gap-4"
					>
						<Sprite
							name="arrow-right-up"
							color="#FDFDFD/[30%]"
							className="size-5"
						/>
						Send
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={(e: { stopPropagation: () => void }) => {
							e.stopPropagation()
							setIsOpenMintModal(true)
						}}
						className="flex gap-4"
					>
						<Sprite name="coins" color="#FDFDFD/[30%]" className="size-5" />
						Mint Tokens
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem
						onClick={(e: { stopPropagation: () => void }) => {
							e.stopPropagation()
							router.push('/tokens')
						}}
						className="flex gap-4"
					>
						<Sprite name="fire" color="#FDFDFD/[30%]" className="size-5" />
						Burn
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}
