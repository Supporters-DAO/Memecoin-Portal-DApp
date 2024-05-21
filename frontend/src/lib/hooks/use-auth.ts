import { atom, useAtom } from 'jotai'
import { Account } from '@gear-js/react-hooks'

export const walletAccountAtom = atom<Account | undefined>(undefined)
export const accountReadyAtom = atom<boolean>(false)
export const adminAtom = atom<boolean>(false)

export const useAuth = () => {
	const [walletAccount, setWalletAccount] = useAtom(walletAccountAtom)
	const [isAccountReadyAtom, setsAccountReadyAtom] = useAtom(accountReadyAtom)
	const [isAdmin, setIsAdmin] = useAtom(accountReadyAtom)

	return {
		walletAccount,
		isAccountReadyAtom,
		isAdmin,
		setWalletAccount,
		setsAccountReadyAtom,
		setIsAdmin,
	}
}

export const useAuthAdmin = () => {
	const [isAdmin, setIsAdmin] = useAtom(adminAtom)

	return {
		isAdmin,
		setIsAdmin,
	}
}
