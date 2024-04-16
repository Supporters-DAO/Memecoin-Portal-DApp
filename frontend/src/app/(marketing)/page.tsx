import { Hero } from '@/components/sections/homepage/hero'
import { HomepageFAQ } from '@/components/sections/homepage/faq'
import { AllCoins } from '@/components/sections/homepage/all-coins'
import { CreateTokenBanner } from '@/components/banners/create-token'
import { About } from '@/components/sections/homepage/about'
import { AboutCreate } from '@/components/sections/homepage/about-create'
import { EXPLORER } from '@/lib/consts'
import { getLastCoinsQuery, ILastCoinsResponse } from '@/lib/requests'
import notFound from '../not-found'

export default async function Page() {
	const { data } = await getData<ILastCoinsResponse>()

	if (!data) return notFound()

	return (
		<>
			<Hero />
			<About />
			<AboutCreate />
			<div className="space-y-25 overflow-hidden bg-[#C3C5EA] pb-25 pt-55">
				<AllCoins coins={data.coins} />
				<CreateTokenBanner />
			</div>
			<HomepageFAQ />
		</>
	)
}

async function getData<T>() {
	const options = {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ query: getLastCoinsQuery }),
	}

	const res = await fetch(EXPLORER.BACK, { ...options, cache: 'no-store' })

	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error('Failed to fetch data')
	}

	return (await res.json()) as T
}
