import { useAlert } from '@gear-js/react-hooks'
import { ProgramMetadata } from '@gear-js/api'
import { useEffect, useState } from 'react'

export function useProgramMetadata(source: string) {
	const alert = useAlert()

	const [metadata, setMetadata] = useState<ProgramMetadata>()

	useEffect(() => {
		fetch(source)
			.then((response) => response.text())
			.then((raw) => ProgramMetadata.from(`0x${raw}`))
			.then((result) => setMetadata(result))
			.catch(({ message }: Error) => alert.error(message))

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return metadata
}
