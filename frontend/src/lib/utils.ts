import { AlertContainerFactory } from '@gear-js/react-hooks'
import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

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
