import { useEffect, useState } from 'react'
import { EXPLORER } from '@/lib/consts'
import { useAuth } from './use-auth'

const endpoint = EXPLORER.BACK

export type Balances = {
	id: string
	address: string
	balance: string
	coin: {
		id: string
	}
}

export const useFetchBalances = (trigger?: boolean) => {
	const [balances, setBalances] = useState<Balances[]>([])
	const { walletAccount } = useAuth()

	const query = `{
        accountBalances {
            address
            balance
            coin {
              id
              name
            }
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

	useEffect(() => {
		const fetchBalances = async () => {
			try {
				const response = await fetch(endpoint, {
					...options,
					cache: 'no-store',
					next: { tags: ['balance'] },
				})
				const { data } = await response.json()

				return data.accountBalances
			} catch (error) {
				console.error(error)
			}
		}

		const getBalancesData = async () => {
			const data = await fetchBalances()

			const filterData = data.filter(
				(accountBalances: { address: string | undefined }) =>
					accountBalances.address === walletAccount?.decodedAddress
			)

			setBalances(filterData)
		}

		getBalancesData()
	}, [walletAccount, trigger])

	return { balances }
}
