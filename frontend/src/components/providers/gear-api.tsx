'use client'

import { type ProviderProps } from '@gear-js/react-hooks'
import { Alert, alertStyles } from '@/components/ui/alert'
import { ADDRESS } from '@/lib/consts'
import dynamic from 'next/dynamic'
import { ReactNode } from 'react'

type Props = {
	children: ReactNode
}

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

function LazyAlertProvider({ children }: Props) {
	return (
		<LazyAlert template={Alert} containerClassName={alertStyles.root}>
			{children}
		</LazyAlert>
	)
}

export function GearApiProvider({ children }: ProviderProps) {
	return (
		<LazyApi initialArgs={{ endpoint: ADDRESS.NODE }}>
			<LazyAlertProvider>
				<LazyAccount>{children}</LazyAccount>
			</LazyAlertProvider>
		</LazyApi>
	)
}
