import { TersifyContext } from './typesInternal';
import { tersifyFunctionByString } from './tersifyFunctionByString';
import { isTersible } from './isTersible';
import { defaultTersify } from './tersify';

// istanbul ignore next
export function tersifyFunction(context: TersifyContext, fn: Function, length: number): string {
  if (!context.raw && isTersible(fn) && fn.tersify !== defaultTersify) {
    return fn.tersify({ maxLength: context.maxLength, raw: context.raw })
  }

  return tersifyFunctionByString(context, fn, context.maxLength)
}
