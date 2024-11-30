import {
	Account,
	AlertContainerFactory,
	useAlert,
	useApi,
} from '@gear-js/react-hooks'
import { CONTRACT_ADDRESS } from '../consts'
import { useCallback } from 'react'
import { Program, Init, MemeError } from './meme-factory'
import { TransactionBuilder } from 'sails-js'
import { useAuth } from '../hooks/use-auth'

export enum MessageTypes {
	CREATE_FUNGIBLE_PROGRAM = 'createFungibleProgram',
}

const executeTransaction = async (
	transaction: TransactionBuilder<{ ok: null } | { err: MemeError }>,
	account: Account,
	alert: AlertContainerFactory
) => {
	transaction.withAccount(account.address, { signer: account.signer })
	transaction.withValue(BigInt(1e12))
	await transaction.calculateGas(false, 100)

	const { msgId, blockHash, response, txHash } = await transaction.signAndSend()

	console.log(`msg included in block ${blockHash}. Message id: ${msgId}`)

	try {
		const result = await response()

		if ('err' in result) {
			if ('programInitializationFailedWithContext' in result.err) {
				alert.error(result.err.programInitializationFailedWithContext)
			} else if ('unauthorized' in result.err) {
				alert.error('Unauthorized error occurred')
			} else if ('memeExists' in result.err) {
				alert.error('Meme already exists')
			} else if ('memeNotFound' in result.err) {
				alert.error('Meme not found')
			} else if ('insufficientValue' in result.err) {
				alert.error('Insufficient user balance.')
			} else {
				alert.error('Unknown error occurred')
			}

			return false
		}

		if ('ok' in result) {
			alert.success('Successfully')
			return result
		}

		return result
	} catch (error) {
		console.error('Error response: ', error)
	}
}

export const useMessages = () => {
	const { api, isApiReady } = useApi()
	const { walletAccount: account } = useAuth()
	const alert = useAlert()

	const sendMessage = useCallback(
		async (messageType: string, payload: Init) => {
			if (!account) throw new Error('Account is not found')
			if (!api) throw new Error('Api is not ready')

			const programId = CONTRACT_ADDRESS.ADDRESS

			const program = new Program(api, programId)

			const executeMessage = async (
				transactionBuilder: TransactionBuilder<
					{ ok: null } | { err: MemeError }
				>
			) => {
				const resultTransaction = await executeTransaction(
					transactionBuilder,
					account,
					alert
				)
				return resultTransaction
			}

			switch (messageType) {
				case MessageTypes.CREATE_FUNGIBLE_PROGRAM:
					return executeMessage(
						await program.memeFactory.createFungibleProgram(payload)
					)
				default:
					throw new Error(`Unsupported message type: ${messageType}`)
			}
		},
		[api, isApiReady, account]
	)

	return sendMessage
}
