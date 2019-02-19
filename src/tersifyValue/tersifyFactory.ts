import { TersifyContext } from './interfaces';
import { tersifyBigint } from './tersifyBigint';
import { tersifyFunction } from './tersifyFunction';
import { tersifyLiteral } from './tersifyLiteral';
import { tersifyRegExp } from './tersifyRegExp';
import { tersifyString } from './tersifyString';
import { tersifySymbol } from './tersifySymbol';

export type TersifyFunc = (context: TersifyContext, value: any, length: number) => string
export const tersifyFactory: Record<string, TersifyFunc> = {
  'undefined': tersifyLiteral,
  'null': tersifyLiteral,
  'boolean': tersifyLiteral,
  'number': tersifyLiteral,
  'bigint': tersifyBigint,
  'string': tersifyString,
  'symbol': tersifySymbol,
  'function': tersifyFunction,
  'RegExp': tersifyRegExp
}
