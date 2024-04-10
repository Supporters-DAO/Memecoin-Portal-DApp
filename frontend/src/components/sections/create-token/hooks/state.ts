import { useEffect } from 'react'
import { useProgramMetadata, useReadState } from './api'
import { CONTRACT_ADDRESS } from '@/lib/consts'
import { useAccount, useSendMessageHandler } from '@gear-js/react-hooks'
import meta from '../assets/meta/memefactory.meta.txt'

const programId = CONTRACT_ADDRESS.ADDRESS

function useState() {
	const { state, error } = useReadState<any>({ programId, meta, payload: '0x' })

	return { state, error }
}

export const useInit = () => {
	const { account } = useAccount()
	const { state, error } = useState()

	useEffect(() => {
		console.log('state', state)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [account?.decodedAddress, state])

	return {
		isGameReady: programId ? Boolean(state) : true,
		errorGame: error,
	}
}

export function useMessage() {
	const metadata = useProgramMetadata(meta)
	return useSendMessageHandler(programId, metadata, {
		disableAlerts: true,
		isMaxGasLimit: true,
	})
}
