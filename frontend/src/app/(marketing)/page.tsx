import { Hero } from '@/components/sections/homepage/hero'
import { HomepageFAQ } from '@/components/sections/homepage/faq'
import { AllCoins } from '@/components/sections/homepage/all-coins'
import { CreateTokenBanner } from '@/components/banners/cta-create-token'

export default function Page() {
	return (
		<>
			<Hero />
			<div className="space-y-25 bg-[#C3C5EA] pb-25 pt-55">
				<AllCoins />
				<CreateTokenBanner className="" />
			</div>
			<HomepageFAQ />
		</>
	)
}
