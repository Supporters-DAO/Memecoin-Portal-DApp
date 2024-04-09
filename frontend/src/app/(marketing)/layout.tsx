import { ReactNode } from 'react'
import { Footer } from '@/components/common/footer'

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<>
			<main className="flex grow flex-col">{children}</main>
			<Footer />
		</>
	)
}
