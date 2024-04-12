import { Token, type IToken } from '@/components/sections/tokens/single-token'
import { notFound } from 'next/navigation'
import { EXPLORER } from '@/lib/consts'

async function getData(id: string) {
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
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query: query }),
	}

	const res = await fetch(EXPLORER.BACK, options)

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error('Failed to fetch data')
	}

	return res.json()
}

type ITokenResponse = {
	data: {
		coinById: IToken
	}
}

export default async function Page({
	params: { id },
}: {
	params: { id: string }
}) {
	const data = (await getData(id)) as ITokenResponse

	if (!data || !data.data.coinById) return notFound()

	const {
		data: { coinById },
	} = data

	return (
		<div className="container">
			<Token token={coinById} />
		</div>
	)
}
