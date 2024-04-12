declare module '*.txt' {
	const value: string
	export default value
}

type BaseComponentProps = {
	children?: ReactNode
	className?: string
}