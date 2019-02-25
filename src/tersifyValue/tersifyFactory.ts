import { TersifyContext } from './interfaces';
import { tersifyArray } from './tersifyArray';
import { tersifyBigint } from './tersifyBigint';
import { tersifyBuffer } from './tersifyBuffer';
import { tersifyDate } from './tersifyDate';
import { tersifyFunction } from './tersifyFunction';
import { tersifyLiteral } from './tersifyLiteral';
import { tersifyObject } from './tersifyObject';
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
  'object': tersifyObject,
  'Buffer': tersifyBuffer,
  'Date': tersifyDate,
  'RegExp': tersifyRegExp,
  'Array': tersifyArray
}
