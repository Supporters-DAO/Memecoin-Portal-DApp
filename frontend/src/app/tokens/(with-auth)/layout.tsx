import { ReactNode } from 'react'
import { WithAuthLayout } from '@/components/common/with-auth-layout'

export default function Layout({ children }: { children: ReactNode }) {
	return <WithAuthLayout>{children}</WithAuthLayout>
}
