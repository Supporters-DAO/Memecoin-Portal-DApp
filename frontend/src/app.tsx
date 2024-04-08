import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { withProviders } from './app/hocs'
import { Home } from './pages/Home'
import { useAccount, useApi } from '@gear-js/react-hooks'
import Create from './pages/Create'

const router = createBrowserRouter([
	{
		path: '/',
		element: <Home />,
	},
	{
		path: '/create',
		element: <Create />,
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
				<div className="h-screen flex items-center justify-center">
					Loading...
				</div>
			)}
		</main>
	)
}

export const AppWithProviders = withProviders(App)
