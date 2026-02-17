import { defaultTersify } from './tersify.js'
import type { Tersible, TersifyOptions } from './types.js'

/**
 * Inject `tersify()` to subject.
 * NOTE: this does inject directly to `subject`.
 * It is not ideal to modify the argument,
 * but it cannot be done otherwise.
 * How can I "clone" a function or class?
 */
export function tersible<T>(
	subject: T,
	tersify?: string | ((this: T, options: Partial<TersifyOptions>) => string)
): Tersible<T> {
	const tersifyFn =
		tersify === undefined ? defaultTersify : typeof tersify === 'string' ? () => tersify : tersify
	Object.defineProperty(subject, 'tersify', {
		value: tersifyFn,
		enumerable: false,
		writable: false
	})

	return subject as any
}
