import { HexString } from '@gear-js/api'
import { AlertContainerFactory } from '@gear-js/react-hooks'
import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ADDRESS } from './consts'

export const copyToClipboard = async ({
	alert,
	value,
	successfulText,
}: {
	alert?: AlertContainerFactory
	value: string
	successfulText?: string
}) => {
	const onSuccess = () => {
		if (alert) {
			alert.success(successfulText || 'Copied')
		}
	}
	const onError = () => {
		if (alert) {
			alert.error('Copy error')
		}
	}

	function unsecuredCopyToClipboard(text: string) {
		const textArea = document.createElement('textarea')
		textArea.value = text
		document.body.appendChild(textArea)
		textArea.focus()
		textArea.select()
		try {
			document.execCommand('copy')
			onSuccess()
		} catch (err) {
			console.error('Unable to copy to clipboard', err)
			onError()
		}
		document.body.removeChild(textArea)
	}

	if (window.isSecureContext && navigator.clipboard) {
		navigator.clipboard
			.writeText(value)
			.then(() => onSuccess())
			.catch(() => onError())
	} else {
		unsecuredCopyToClipboard(value)
	}
}

export const isMobileDevice = () =>
	/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
		navigator.userAgent
	)

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const prettyWord = (word: string, length: number = 8) => {
	return word.slice(0, length) + '...' + word.slice(-4)
}

export const isValidHexString = (value: string): value is HexString => {
	return /^0x[0-9A-Fa-f]+$/.test(value)
}

export function compactFormatNumber(
	num: number,
	options: Intl.NumberFormatOptions = {
		notation: 'compact',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	}
) {
	return Intl.NumberFormat('en-US', options).format(num)
}

export const getGatewayUrl = (ipfsUrl: string) => {
	const ipfsHash = ipfsUrl.split('ipfs://')[1]
	return `${ADDRESS.IPFS_GETAWAY}${ipfsHash}`
}

export const uploadToIpfs = async (files: File[]) => {
	const formData = new FormData()
	files.forEach((file) => formData.append('file', file))

	const response = await fetch(ADDRESS.IPFS_UPLOAD, {
		method: 'POST',
		body: formData,
	})
	if (!response.ok) throw new Error(response.statusText)

	const result = await (response.json() as Promise<
		Record<'ipfsHash', string>[]
	>)
	return result.map(({ ipfsHash }) => `ipfs://${ipfsHash}`)
}
