import type { TersifyOptions } from './types.js'

export type TersifyContext = TersifyOptions & {
	path: (keyof any)[]
	noTrim: boolean
	references: { value: any; path: (keyof any)[] }[]
}
