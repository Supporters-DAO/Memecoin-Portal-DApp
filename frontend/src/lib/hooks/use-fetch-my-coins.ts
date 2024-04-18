import { EXPLORER } from '@/lib/consts'
import { HexString } from '@gear-js/api'
import { useEffect, useState } from 'react'
import { useAuth } from './use-auth'

const endpoint = EXPLORER.BACK

export type Token = {
	description: string
	decimals: number
	distributed: string
	image: string
	id: string
	name: string
	symbol: string
	initialSupply: string
	maxSupply: string
	admins: HexString[]
	holders: string
	circulatingSupply: string
}

export const useFetchMyCoins = (limit: 20, offset: 0) => {
	const [tokenData, setTokenData] = useState<Token[]>([])
	const { walletAccount } = useAuth()

	const query = `{
        coins(limit: ${limit}, offset: ${offset}, orderBy: id_ASC) {
            description
            decimals
            distributed
            image
            id
            name
            symbol
			initialSupply
			maxSupply
			admins
			createdBy
			holders
			circulatingSupply
          }
      }`

	const options = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: query,
		}),
	}

	const fetchCoins = async () => {
		try {
			const response = await fetch(endpoint, options)
			const { data } = await response.json()
			return data.coins
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		const getTokenData = async () => {
			const data = await fetchCoins()
			const filterData = data.filter(
				(coin: { createdBy: string | undefined }) =>
					coin.createdBy === walletAccount?.decodedAddress
			)

			setTokenData(filterData)
		}

		getTokenData()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [walletAccount])

	return { tokenData }
}
