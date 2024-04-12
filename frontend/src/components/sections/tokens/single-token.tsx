export interface IToken {
	description: string
	decimals: number
	distributed: string
	image: string
	id: string
	name: string
	symbol: string
}

type Props = {
	token: IToken
}

export function Token({ token: { id, ...token } }: Props) {
	return (
		<section>
			<h2>{token.name}</h2>
		</section>
	)
}
