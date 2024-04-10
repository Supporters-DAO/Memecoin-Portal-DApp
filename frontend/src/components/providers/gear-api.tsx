'use client'

import { type ProviderProps } from '@gear-js/react-hooks'
import { ADDRESS } from '@/lib/consts'
import dynamic from 'next/dynamic'

const LazyApi = dynamic(
	() => import('@gear-js/react-hooks').then((mod) => mod.ApiProvider),
	{ ssr: false }
)
const LazyAccount = dynamic(
	() => import('@gear-js/react-hooks').then((mod) => mod.AccountProvider),
	{ ssr: false }
)
const LazyAlert = dynamic(
	() => import('@gear-js/react-hooks').then((mod) => mod.AlertProvider),
	{ ssr: false }
)

export function GearApiProvider({ children }: ProviderProps) {
	return (
		<LazyApi initialArgs={{ endpoint: ADDRESS.NODE }}>
			<LazyAlert>
				<LazyAccount>{children}</LazyAccount>
			</LazyAlert>
		</LazyApi>
	)
}
