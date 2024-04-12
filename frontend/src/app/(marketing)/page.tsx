import { Hero } from '@/components/sections/homepage/hero'
import { HomepageFAQ } from '@/components/sections/homepage/faq'
import { AllCoins } from '@/components/sections/homepage/all-coins'
import { CreateTokenBanner } from '@/components/banners/create-token'
import { About } from '@/components/sections/homepage/about'
import { AboutCreate } from '@/components/sections/homepage/about-create'

export default function Page() {
	return (
		<>
			<Hero />
			<About />
			<AboutCreate />
			<div className="space-y-25 overflow-hidden bg-[#C3C5EA] pb-25 pt-55">
				<AllCoins />
				<CreateTokenBanner />
			</div>
			<HomepageFAQ />
		</>
	)
}
