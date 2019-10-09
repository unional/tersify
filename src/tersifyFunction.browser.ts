import { TersifyContext } from './typesInternal';
import { tersifyFunctionByString } from './tersifyFunctionByString';
import { hasTersifyFn } from './hasTersifyFn';
import { defaultTersify } from './tersify';

// istanbul ignore next
export function tersifyFunction(context: TersifyContext, fn: Function, _length: number): string {
  if (!context.raw && hasTersifyFn(fn) && fn.tersify !== defaultTersify) {
    return fn.tersify({ maxLength: context.maxLength, raw: context.raw })
  }

  return tersifyFunctionByString(fn, context)
}
