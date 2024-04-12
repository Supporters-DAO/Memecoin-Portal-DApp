import { EXPLORER } from '@/lib/consts'
import { useEffect, useState } from 'react'

const endpoint = EXPLORER.BACK

export interface Token {
	description: string
	decimals: number
	distributed: string
	image: string
	id: string
	name: string
	symbol: string
	initialSupply: string
	maxSupply: string
}

export const useFetchCoins = (limit: 10, offset: 0) => {
	const [tokenData, setTokenData] = useState<Token[]>([])

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
			setTokenData(data)
		}

		getTokenData()
	}, [])

	return { tokenData }
}
