import { HexString } from '@gear-js/api'

export const ADDRESS = {
	NODE: process.env.NEXT_PUBLIC_NODE_ADDRESS,
	IPFS_UPLOAD: process.env.NEXT_PUBLIC_IPFS_UPLOAD_ADDRESS as string,
	IPFS_GETAWAY: process.env.NEXT_PUBLIC_IPFS_GETAWAY as string,
}

export const CONTRACT_ADDRESS = {
	ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as HexString,
}

export const EXPLORER = {
	BACK: process.env.NEXT_PUBLIC_EXPLORER as string,
}
