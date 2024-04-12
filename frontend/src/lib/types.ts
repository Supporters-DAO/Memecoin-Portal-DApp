// in case Object.entries return value is immutable
// ref: https://stackoverflow.com/a/60142095
import { z } from 'zod'

export type Entries<T> = {
	[K in keyof T]: [K, T[K]]
}[keyof T][]

export type ArrayElement<ArrayType extends readonly unknown[]> =
	ArrayType extends readonly (infer ElementType)[] ? ElementType : never

export type IGQLRequestWrapper<T> = {
	data: T
}
