import { hasTersifyFn } from './hasTersifyFn.js'
import { defaultTersify } from './tersify.js'
import { tersifyAcorn } from './tersifyAcorn/index.js'
import { tersifyFunctionByString } from './tersifyFunctionByString.js'
import type { TersifyContext } from './typesInternal.js'

export function tersifyFunction(context: TersifyContext, fn: Function, _length: number): string {
	if (!context.raw && hasTersifyFn(fn) && fn.tersify !== defaultTersify) {
		return fn.tersify({ maxLength: context.maxLength, raw: context.raw })
	}

	try {
		return tersifyAcorn(context, fn, context.maxLength)
	} catch (e: any) {
		// istanbul ignore next
		if (e.name !== 'SyntaxError') throw e
		// istanbul ignore next
		return tersifyFunctionByString(fn, context)
	}
}
