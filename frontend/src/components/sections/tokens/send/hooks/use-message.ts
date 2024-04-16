import { useProgramMetadata } from '@/lib/hooks/api'
import { HexString } from '@gear-js/api'
import { useSendMessageHandler } from '@gear-js/react-hooks'
import meta from '../assets/meta/fungible_token.meta.txt'

export function useMessageToken(programId: HexString) {
	const metadata = useProgramMetadata(meta)
	return useSendMessageHandler(programId, metadata, {
		disableAlerts: true,
	})
}
