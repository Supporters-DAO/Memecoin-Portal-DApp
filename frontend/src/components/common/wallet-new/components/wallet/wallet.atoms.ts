import { atom, useAtom } from 'jotai'

const atomWalletOpenState = atom<boolean>(false)

export function useWalletOpenState() {
	return useAtom(atomWalletOpenState)
}
