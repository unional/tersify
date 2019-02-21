import { Parser } from 'acorn';
import bigInt from 'acorn-bigint';
import { isTersible } from '../tersible';
import { tersifyAcorn } from '../tersifyAcorn';
import { TersifyContext } from './interfaces';

Parser.extend(bigInt)

export function tersifyFunction(context: TersifyContext, fn: Function, length: number): string {
  if (!context.raw && isTersible(fn)) {
    return fn.tersify({ maxLength: context.maxLength, raw: context.raw })
  }

  return tersifyAcorn(context, fn, context.maxLength)
}
