import type { Tersible } from './types.js'

export function hasTersifyFn<T>(obj: T): obj is Tersible<T> {
	return typeof obj['tersify'] === 'function'
}
