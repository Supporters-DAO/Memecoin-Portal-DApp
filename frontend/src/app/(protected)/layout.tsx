import { ReactNode } from 'react'
import { GearApiProvider } from '@/components/providers'

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<GearApiProvider>
			<main className="relative flex grow flex-col">{children}</main>
		</GearApiProvider>
	)
}
