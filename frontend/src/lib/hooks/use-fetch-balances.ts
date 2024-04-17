import { useEffect, useState } from 'react'
import { useAccount } from '@gear-js/react-hooks'
import { EXPLORER } from '@/lib/consts'

const endpoint = EXPLORER.BACK

export type Balances = {
	id: string
	address: string
	balance: string
	coin: {
		id: string
	}
}

export const useFetchBalances = () => {
	const [balances, setBalances] = useState<Balances[]>([])
	const { account } = useAccount()

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

	const fetchBalances = async () => {
		try {
			const response = await fetch(endpoint, { ...options, cache: 'no-store' })
			const { data } = await response.json()

			return data.accountBalances
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		const getBalancesData = async () => {
			const data = await fetchBalances()

			const filterData = data.filter(
				(accountBalances: { address: string | undefined }) =>
					accountBalances.address === account?.decodedAddress
			)

			setBalances(filterData)
		}

		getBalancesData()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [account])

	return { balances }
}
