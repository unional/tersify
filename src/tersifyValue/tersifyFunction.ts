import { Parser } from 'acorn';
import bigInt from 'acorn-bigint';
import { EOL } from '../constants';
import { isTersible } from '../tersible';
import { tersifyAcorn } from '../tersifyAcorn';
import { defaultTersify } from './defaultTersify';
import { TersifyContext } from './interfaces';

Parser.extend(bigInt)

export function tersifyFunction(context: TersifyContext, fn: Function, length: number): string {
  if (!context.raw && isTersible(fn) && fn.tersify !== defaultTersify) {
    return fn.tersify({ maxLength: context.maxLength, raw: context.raw })
  }

  try {
    return tersifyAcorn(context, fn, context.maxLength)
  }
  catch (e) {
    if (e.name !== 'SyntaxError') throw e
    return tersifyFunctionByString(context, fn, context.maxLength)
  }
}

// Ignore coverage as this is old code just for fallback
// istanbul ignore next
export function tersifyFunctionByString(context: TersifyContext, fn: Function, length: number) {
  if (!context.raw && isTersible(fn) && fn['tersify'] !== defaultTersify)
    return fn.tersify()

  const str = fn.toString()

  if (isArrow(str))
    return formatArrow(str, length)
  else
    return formatFn(str, length)
}

// istanbul ignore next
function isArrow(str: string) {
  const lines = str.split(EOL)

  // https://regex101.com/r/0HtLzb/1
  return /[\(]?.*[\)]? =>/.test(lines[0])
}

// istanbul ignore next
function formatArrow(str: string, maxLength) {
  const lines = str.split(EOL)
  const trimmedlines = lines.map(l => l.trim())
  let singleLine = trimmedlines.join(' ');

  // https://regex101.com/r/1Nv7hN/2
  const matchSingleExpression = /=> { return (.*); }/.exec(singleLine)
  if (matchSingleExpression) {
    const singleExpression = matchSingleExpression[1]
    singleLine = lines[0].slice(0, lines[0].length - 1) + singleExpression
  }

  if (singleLine.length > maxLength) {
    singleLine = trimWithBracket(singleLine, maxLength)
  }
  if (singleLine.length > maxLength) {
    // after trimming it is still too long
    singleLine = singleLine.slice(0, maxLength - 3) + '...'
  }

  // trim `{ }` to `{}` in wallaby environment.
  return singleLine.replace(/{ }/g, '{}')
}

// istanbul ignore next
function trimWithBracket(singleLine, maxLength) {
  // https://regex101.com/r/HrkxfW/1
  const parts = /(.* { )(.*)( })/.exec(singleLine)
  return parts ? parts[1] + parts[2].slice(0, maxLength - parts[1].length - parts[3].length - 3) + '...' + parts[3] : singleLine;
}

// istanbul ignore next
function formatFn(str: string, maxLength) {
  const lines = str.split(EOL)
  const trimmedlines = lines.map(l => l.trim())
  let singleLine = trimmedlines.join(' ');

  if (singleLine.length > maxLength) {
    singleLine = trimWithBracket(singleLine, maxLength)
  }

  if (singleLine.length > maxLength) {
    // after trimming it is still too long
    singleLine = singleLine.slice(0, maxLength - 3) + '...'
  }

  // trim `{ }` to `{}` in wallaby environment.
  return singleLine.replace(/{ }/g, '{}').replace(`function (`, `fn(`)
}
