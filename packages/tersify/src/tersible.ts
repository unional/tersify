import { defaultTersify } from './tersify.js'
import type { Tersible, TersifyOptions } from './types.js'

/**
 * Create a Tersible mixin class
 * NOTE: `this` in `tersify` is not typed.
 * Currently this seems to be a limitation on optional generic.
 * I can't do <T, C extends ...> because user need to specify the constructor,
 * and I can't do <T = any, C extends ... = ?> to make the generic optional.
 * I would like to do <T = any, C extends ...> so that user can do `Tersible(...)` and `Tersible<Foo>(...)`
 * @param Base Base class
 * @param tersify the tersify function
 */
export function Tersiblized<C extends new (...args: any[]) => object>(
	Base: C,
	tersify: (this: InstanceType<C>, options?: Partial<TersifyOptions>) => string
) {
	return class extends Base {
		tersify(this: InstanceType<C>, options?: Partial<TersifyOptions>) {
			return tersify.call(this, options)
		}
	}
}

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
