import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { withProviders } from '@/lib/hocs'
import { Home } from '@/components/pages/Home.tsx'
import { useAccount, useApi } from '@gear-js/react-hooks'
import Create from '@/components/pages/Create.tsx'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />
		,
	},
	{
		path: '/create',
		element: <Create />
		,
	},
])

function App() {
	const { isApiReady } = useApi()
	const { isAccountReady } = useAccount()

	// useWalletSync();
	// useAccountAvailableBalanceSync();

	const isAppReady = isApiReady && isAccountReady

	return (
		<main>
			{isAppReady ? (
				<>
					<RouterProvider router={router} />
				</>
			) : (
				<div className="h-screen flex items-center justify-center">Loading...</div>
			)}
		</main>
	)
}

export const AppWithProviders = withProviders(App)
