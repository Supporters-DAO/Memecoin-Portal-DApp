import { ReactNode } from 'react'
import { Footer } from '@/components/common/footer'

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<>
			<main className="relative flex grow flex-col">{children}</main>
			<Footer />
		</>
	)
}
