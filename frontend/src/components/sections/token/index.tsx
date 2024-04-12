'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { EXPLORER } from '@/lib/consts'

const endpoint = EXPLORER.BACK

interface Token {
	description: string
	decimals: number
	distributed: string
	image: string
	id: string
	name: string
	symbol: string
}

export const Token = () => {
	const idParams = useSearchParams()
	const id = idParams.get('id')
	const [tokenData, setTokenData] = useState<Token | null>(null)

	const query = `{
        coinById(id: "${id}") {
            description
            decimals
            distributed
            image
            id
            name
            symbol
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

	const fetchToken = async () => {
		try {
			const response = await fetch(endpoint, options)
			const { data } = await response.json()
			return data.coinById
		} catch (error) {
			console.error(error)
		}
	}

	useEffect(() => {
		const getTokenData = async () => {
			const data = await fetchToken()
			setTokenData(data)
		}

		getTokenData()
	}, [])

	console.log('fetchToken', tokenData)
	return <div>Post: {id}</div>
}
