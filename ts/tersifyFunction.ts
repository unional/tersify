import { hasTersifyFn } from './hasTersifyFn';
import { defaultTersify } from './tersify';
import { tersifyAcorn } from './tersifyAcorn';
import { tersifyFunctionByString } from './tersifyFunctionByString';
import { TersifyContext } from './typesInternal';

export function tersifyFunction(context: TersifyContext, fn: Function, _length: number): string {
  if (!context.raw && hasTersifyFn(fn) && fn.tersify !== defaultTersify) {
    return fn.tersify({ maxLength: context.maxLength, raw: context.raw })
  }

  try {
    return tersifyAcorn(context, fn, context.maxLength)
  }
  catch (e: any) {
    // istanbul ignore next
    if (e.name !== 'SyntaxError') throw e
    // istanbul ignore next
    return tersifyFunctionByString(fn, context)
  }
}
