import {
	Account,
	AlertContainerFactory,
	useAlert,
	useApi,
} from '@gear-js/react-hooks'
import { web3FromSource } from '@polkadot/extension-dapp'
import { useCallback } from 'react'
import { Program } from './meme-ft'
import { TransactionBuilder } from 'sails-js'
import { useAuth } from '../hooks/use-auth'

export enum MessageTypes {
	TRANSFER_TO_USERS = 'transferToUsers',
	MINT = 'mint',
	BURN = 'burn',
	TRANSFER = 'transfer',
}

type TransferToUsersPayload = {
	toUsers: `0x${string}`[]
	value: number | string
}

type MintPayload = {
	to: `0x${string}`
	value: number | string
}

type BurnPayload = {
	from: `0x${string}`
	value: number | string
}

type TransferPayload = {
	to: `0x${string}`
	value: number | string
}

const executeTransaction = async (
	transaction: TransactionBuilder<boolean>,
	account: Account,
	injector: any,
	alert: AlertContainerFactory
) => {
	transaction.withAccount(account.address, { signer: injector.signer })

	await transaction.calculateGas(false, 100)

	const { msgId, blockHash, response } = await transaction.signAndSend()

	console.log(`msg included in block ${blockHash}. Message id: ${msgId}`)

	try {
		const result = await response()

		if (!result) {
			alert.error('Unknown error occurred')
		}

		if (result) {
			alert.success('Successfully')
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
		async (
			messageType: string,
			programId: `0x${string}`,
			payload:
				| TransferToUsersPayload
				| MintPayload
				| BurnPayload
				| TransferPayload
		) => {
			if (!isApiReady) throw new Error('API is not initialized')
			if (!account) throw new Error('Account is not found')

			const program = new Program(api, programId)
			const injector = await web3FromSource(account.meta.source)

			const executeMessage = async (
				transactionBuilder: TransactionBuilder<boolean>
			) => {
				const resultTransaction = await executeTransaction(
					transactionBuilder,
					account,
					injector,
					alert
				)
				return resultTransaction
			}

			switch (messageType) {
				case MessageTypes.TRANSFER_TO_USERS:
					const transferToUsersPayload = payload as TransferToUsersPayload
					return executeMessage(
						await program.vft.transferToUsers(
							transferToUsersPayload.toUsers,
							transferToUsersPayload.value
						)
					)

				case MessageTypes.MINT:
					const mintPayload = payload as MintPayload
					return executeMessage(
						await program.vft.mint(mintPayload.to, mintPayload.value)
					)

				case MessageTypes.BURN:
					const burnPayload = payload as BurnPayload
					return executeMessage(
						await program.vft.burn(burnPayload.from, burnPayload.value)
					)

				case MessageTypes.TRANSFER:
					const transferPayload = payload as TransferPayload
					return executeMessage(
						await program.vft.transfer(
							transferPayload.to,
							transferPayload.value
						)
					)

				default:
					throw new Error(`Unsupported message type: ${messageType}`)
			}
		},
		[api, isApiReady, account]
	)

	return sendMessage
}
