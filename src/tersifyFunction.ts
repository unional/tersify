import { Parser } from 'acorn';
import bigInt from 'acorn-bigint';
import { hasTersifyFn } from './hasTersifyFn';
import { defaultTersify } from './tersify';
import { tersifyAcorn } from './tersifyAcorn';
import { tersifyFunctionByString } from './tersifyFunctionByString';
import { TersifyContext } from './typesInternal';

Parser.extend(bigInt)

export function tersifyFunction(context: TersifyContext, fn: Function, length: number): string {
  if (!context.raw && hasTersifyFn(fn) && fn.tersify !== defaultTersify) {
    return fn.tersify({ maxLength: context.maxLength, raw: context.raw })
  }

  try {
    return tersifyAcorn(context, fn, context.maxLength)
  }
  catch (e) {
    if (e.name !== 'SyntaxError') throw e
    return tersifyFunctionByString(fn, context)
  }
}
