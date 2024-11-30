'use client'

import { type ProviderProps } from '@gear-js/react-hooks'
import { Alert, alertStyles } from '@/components/ui/alert'
import { ADDRESS } from '@/lib/consts'
import dynamic from 'next/dynamic'
import { ReactNode, useEffect, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

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

const LazyAccountProvider = ({ children }: Props) => {
	return <LazyAccount appName="Vara Tokenator">{children}</LazyAccount>
}

function LazyAlertProvider({ children }: Props) {
	return (
		<LazyAlert template={Alert} containerClassName={alertStyles.root}>
			{children}
		</LazyAlert>
	)
}

const QUERY_CLIENT = new QueryClient()

export function GearApiProvider({ children }: ProviderProps) {
	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		if (typeof window !== 'undefined') {
			setIsReady(true)
		}
	}, [])

	if (!isReady) return null

	return (
		<QueryClientProvider client={QUERY_CLIENT}>
			<LazyApi initialArgs={{ endpoint: ADDRESS.NODE! }}>
				<LazyAlertProvider>
					<LazyAccountProvider>{children}</LazyAccountProvider>
				</LazyAlertProvider>
			</LazyApi>
		</QueryClientProvider>
	)
}
