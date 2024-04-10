import { HexString } from "@gear-js/api"

export const ADDRESS = {
	NODE: process.env.NEXT_PUBLIC_NODE_ADDRESS,
}

export const CONTRACT_ADDRESS = {
	ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as HexString,
}
