import { HexString, ProgramMetadata, UserMessageSent } from '@gear-js/api'
import {
	useApi,
	useAccount,
	useAlert,
	useSendMessageWithGas,
} from '@gear-js/react-hooks'
import { UnsubscribePromise } from '@polkadot/api/types'
import { AnyJson } from '@polkadot/types/types'
import { isObject } from '@polkadot/util'

const useSendMessageWithReply = (
	programId: HexString,
	metadata: ProgramMetadata | undefined
) => {
	const { api, isApiReady } = useApi()
	const { account } = useAccount()
	const alert = useAlert()

	const sendMessage = useSendMessageWithGas(programId, metadata, {
		disableAlerts: true,
		gasMultiplier: 1.1,
	})

	return ({
		onSuccess = () => {},
		onError = () => {},
		onFinally = () => {},
		...sendMessageArgs
	}: {
		payload: AnyJson
		value?: string | number
		onSuccess?: (value: any) => void
		onError?: () => void
		onFinally?: () => void
	}) => {
		if (!isApiReady) throw new Error('API is not initialized')
		if (!account) throw new Error('Account is not found')

		let unsub: UnsubscribePromise | undefined = undefined
		let replyPayload: any | undefined = undefined

		const unsubscribe = () => {
			// for dev purposes only, since unsub is tricky
			if (!unsub) throw new Error('Failed to unsubscribe from reply')

			unsub
				.then((unsubCallback) => unsubCallback())
				.catch((error: Error) => alert.error(error.message))
		}

		const _onFinally = () => {
			unsubscribe()
			onFinally()
		}

		const _onError = () => {
			_onFinally()
			onError()
		}

		const _onSuccess = () => {
			_onFinally()

			if (!replyPayload) return
			onSuccess(replyPayload)
		}

		const handleUserMessageSent = ({ data }: UserMessageSent) => {
			try {
				if (!metadata)
					throw new Error(
						'Failed to get transaction result: metadata is not found'
					)

				const typeIndex = metadata.types.handle.output
				if (typeIndex === null)
					throw new Error(
						'Failed to get transaction result: handle.output type index is not found'
					)
				const { message } = data
				const { source, destination, payload, details, value } = message

				const isUtilMessage = !value.isEmpty // treat carefully, currently all user messages are the ones without value
				if (
					source.toHex() !== programId ||
					destination.toHex() !== account.decodedAddress ||
					isUtilMessage
				)
					return

				const isSuccess = details.isSome
					? details.unwrap().code.isSuccess
					: true
				if (!isSuccess) throw new Error(payload.toHuman()?.toString())

				const decodedPayload = metadata.createType(typeIndex, payload).toJSON()

				if (!isObject(decodedPayload))
					throw new Error(
						'Failed to get transaction result: payload is not an object'
					)
				// if ('err' in decodedPayload) throw new Error(decodedPayload.err?.toString());
				if ('err' in decodedPayload)
					throw new Error('Reply came with non success reply code Error')
				if (!('ok' in decodedPayload))
					throw new Error(
						'Failed to get transaction result: ok property is not found'
					)

				replyPayload = decodedPayload.ok as any
			} catch (error) {
				const errorMessage =
					error instanceof Error ? error.message : String(error)
				alert.error(errorMessage)

				_onError()
			}
		}

		unsub = api.gearEvents.subscribeToGearEvent(
			'UserMessageSent',
			handleUserMessageSent
		)

		sendMessage({
			...sendMessageArgs,
			onError: _onError,
			onSuccess: _onSuccess,
		})
	}
}

export { useSendMessageWithReply }
