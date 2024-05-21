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
	id: `0x${string}`
	name: string
	symbol: string
	initialSupply: string
	maxSupply: string
	admins: HexString[]
	holders: string
	circulatingSupply: string
	balance: string
	address: string
	isAdmin: boolean
}

export type Balance = {
	balance: string
	address: string
	id: string
	coin: Omit<Token, 'balance' | 'address' | 'isAdmin'> & { createdBy: string }
}

export type CoinResponse = {
	balances: Balance[]
}

export type FetchCoinsResponse = {
	data: {
		coins: CoinResponse[]
		coinsConnection: {
			totalCount: number
		}
	}
}

export const useFetchMyCoins = (limit = 20, offset = 0, searchQuery = '') => {
	const [totalCoins, setTotalCoins] = useState(0)
	const [tokenData, setTokenData] = useState<Token[]>([])
	const { walletAccount } = useAuth()

	const whereClause = searchQuery.trim()
		? `, where: { name_containsInsensitive: "${searchQuery.trim()}" }`
		: ''

	const query = `{
    coins(limit: ${limit}, offset: ${offset}, orderBy: id_ASC${whereClause}) {
      balances {
        balance
        address
        id
        coin {
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
      }
    }
    coinsConnection(orderBy: id_ASC${whereClause}) {
      totalCount
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

	const fetchCoins = async (): Promise<CoinResponse[]> => {
		try {
			const response = await fetch(endpoint, options)
			const { data }: FetchCoinsResponse = await response.json()

			setTotalCoins(data.coinsConnection.totalCount)
			return data.coins
		} catch (error) {
			console.error(error)
			return []
		}
	}

	useEffect(() => {
		const getTokenData = async () => {
			const coins = await fetchCoins()
			const walletAddress = walletAccount?.decodedAddress

			if (!walletAddress) return

			const filteredData = coins.flatMap((coinResponse) =>
				coinResponse.balances.filter(
					(balance) =>
						balance.address === walletAddress ||
						balance.coin.createdBy === walletAddress
				)
			)

			const myTokens: Token[] = []
			const otherTokens: Token[] = []

			filteredData.forEach((current) => {
				const token: Token = {
					...current.coin,
					balance: current.balance,
					address: current.address,
					isAdmin: current.coin.admins.includes(walletAddress),
				}

				if (current.coin.createdBy === walletAddress) {
					myTokens.push(token)
				} else {
					otherTokens.push(token)
				}
			})

			setTokenData([...myTokens, ...otherTokens])
		}

		getTokenData()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [walletAccount, searchQuery, limit, offset])

	return { tokenData, totalCoins }
}
