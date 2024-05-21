import { useProgramMetadata } from '@/lib/hooks/api'
import { HexString } from '@gear-js/api'
import { useSendMessageWithGas } from '@gear-js/react-hooks'
import meta from '@/lib/assets/fungible/fungible_token.meta.txt'
import { useSendMessageWithReply } from './use-send-message-with-reply'

export function useMessageToken(programId: HexString) {
	const metadata = useProgramMetadata(meta)
	return useSendMessageWithReply(programId, metadata)
}
