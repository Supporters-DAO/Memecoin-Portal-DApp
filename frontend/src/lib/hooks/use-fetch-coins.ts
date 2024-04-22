import { useEffect, useState } from 'react'
import { HexString } from '@gear-js/api'
import { EXPLORER } from '@/lib/consts'

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
	admins: HexString[]
	holders: string
	circulatingSupply: string
}

export const useFetchCoins = (limit = 20, offset = 0, searchQuery = '') => {
	const [tokenData, setTokenData] = useState([])

	const whereClause = searchQuery.trim()
		? `, where: { name_containsInsensitive: "${searchQuery.trim()}" }`
		: ''

	const query = `{
        coins(limit: ${limit}, offset: ${offset}, orderBy: id_ASC${whereClause}) {
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
            holders
            circulatingSupply
        }
    }`

	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query }),
	}

	useEffect(() => {
		const fetchCoins = async () => {
			try {
				const response = await fetch(endpoint, options)
				const { data } = await response.json()
				setTokenData(data.coins)
			} catch (error) {
				console.error('Failed to fetch coins:', error)
			}
		}

		fetchCoins()
	}, [searchQuery, limit, offset])

	return { tokenData }
}
