import { useSendMessageWithGas } from '@gear-js/react-hooks'

import { CONTRACT_ADDRESS } from '@/lib/consts'
import meta from '@/lib/assets/factory/memefactory.meta.txt'
import { useProgramMetadata } from '@/lib/hooks/api'
import { useSendMessageWithReply } from './use-send-message-with-reply'

const programId = CONTRACT_ADDRESS.ADDRESS

export function useMessage() {
	const metadata = useProgramMetadata(meta)
	return useSendMessageWithReply(programId, metadata)
}
