import { Parser } from 'acorn';
import bigInt from 'acorn-bigint';
import { defaultTersify } from '../defaultTersify';
import { isTersible } from '../tersible';
import { tersifyAcorn } from '../tersifyAcorn';
import { TersifyContext } from './interfaces';

Parser.extend(bigInt)

export function tersifyFunction(context: TersifyContext, fn: Function, length: number): string {
  if (!context.raw && isTersible(fn) && fn['tersify'] !== defaultTersify) return fn.tersify()

  return tersifyAcorn(context, fn)
}
