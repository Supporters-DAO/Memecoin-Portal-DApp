import { useSendMessageHandler } from '@gear-js/react-hooks'
import { useProgramMetadata } from './api'
import { CONTRACT_ADDRESS } from '@/lib/consts'
import meta from '../assets/meta/memefactory.meta.txt'

const programId = CONTRACT_ADDRESS.ADDRESS

export function useMessage() {
	const metadata = useProgramMetadata(meta)
	return useSendMessageHandler(programId, metadata, {
		disableAlerts: true,
		isMaxGasLimit: true,
	})
}
