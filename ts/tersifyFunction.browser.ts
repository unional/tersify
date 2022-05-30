import { hasTersifyFn } from './hasTersifyFn.js'
import { defaultTersify } from './tersify.js'
import { tersifyFunctionByString } from './tersifyFunctionByString.js'
import { TersifyContext } from './typesInternal.js'

// istanbul ignore next
export function tersifyFunction(context: TersifyContext, fn: Function, _length: number): string {
  if (!context.raw && hasTersifyFn(fn) && fn.tersify !== defaultTersify) {
    return fn.tersify({ maxLength: context.maxLength, raw: context.raw })
  }

  return tersifyFunctionByString(fn, context)
}
