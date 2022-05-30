import isBuffer from 'is-buffer'
import { required } from 'unpartial'
import { defaultOptions } from './constants.js'
import { hasTersifyFn } from './hasTersifyFn.js'
import { tersifyFunction } from './tersifyFunction.js'
import { trim } from './trim.js'
import { TersifyOptions } from './types.js'
import { TersifyContext } from './typesInternal.js'

export function defaultTersify(this: any, options: Partial<TersifyOptions>) {
  return tersify(this, options)
}

export function tersify(obj: any, options?: Partial<TersifyOptions>): string {
  const context = required<TersifyContext>(defaultOptions, options, { path: [], references: [] })
  return tersifyValue(context, obj, context.maxLength)
}

function tersifyValue(context: TersifyContext, value: any, length: number) {
  const valueType = getType(value)
  const func = tersifyFactory[valueType]
  // istanbul ignore next
  if (!func) throw new Error(`Can't find fn for ${JSON.stringify(value)}`)

  return func(context, value, length)
}

function getType(value: any) {
  if (value === undefined || value === null) return String(value)
  if (value instanceof RegExp) return 'RegExp'
  if (value instanceof Date) return 'Date'
  if (Array.isArray(value)) return 'Array'
  if (value instanceof Error) return 'Error'
  if (isBuffer(value)) return 'Buffer'

  const type = typeof value
  if (type === 'object' && Object.getPrototypeOf(value) !== Object.prototype) return 'instance'
  return type
}

type TersifyFunc = (context: TersifyContext, value: any, length: number) => string

const tersifyFactory: Record<string, TersifyFunc> = {
  'undefined': tersifyLiteral,
  'null': tersifyLiteral,
  'boolean': tersifyLiteral,
  'number': tersifyLiteral,
  'bigint': tersifyBigint,
  'instance': tersifyInstance,
  'string': tersifyString,
  'symbol': tersifySymbol,
  'function': tersifyFunction,
  'object': tersifyObject,
  'Buffer': tersifyBuffer,
  'Date': tersifyDate,
  'RegExp': tersifyRegExp,
  'Array': tersifyArray,
  'Error': tersifyError
}

function tersifyLiteral(context: TersifyContext, node: undefined | null | boolean | number, length: number) {
  return trim(context, String(node), length)
}

function tersifyDate(context: TersifyContext, node: Date, length: number) {
  return trim(context, node.toISOString(), length)
}

function tersifyRegExp(context: TersifyContext, node: RegExp, length: number) {
  return trim(context, String(node), length)
}

function tersifyString(context: TersifyContext, value: string, length: number) {
  return trim(context, `'${value}'`, length)
}

function tersifySymbol(context: TersifyContext, node: symbol, length: number) {
  if (context.raw) return node.toString()
  return trim(context, node.toString().replace('Symbol(', 'Sym('), length)
}

function tersifyBigint(context: TersifyContext, value: any, length: number) {
  return trim(context, String(value) + 'n', length)
}

function tersifyError(context: TersifyContext, node: Error, length: number) {
  const errorName = node.constructor.name
  // 7 = length of `Error()`
  const trimmedMsg = trim(context, `'${node.message}'`, length - 7)
  if (!node.message) return trim(context, `${errorName}()`, length)

  if (trimmedMsg.length === 0) return trim(context, `${errorName}( )`, length)
  return trim(context, `${errorName}(${trimmedMsg})`, length)
}

function tersifyBuffer(context: TersifyContext, node: any, length: number) {
  return trim(context, node.inspect(), length)
}

function tersifyArray(context: TersifyContext, value: any[], length: number) {
  const ref = context.references.find(r => r.value === value)
  if (ref) {
    return `ref(${ref.path.join(', ')})`
  }

  context.references.push({ value, path: context.path })

  if (!context.raw && hasTersifyFn(value) && value.tersify !== defaultTersify) {
    return value.tersify({ maxLength: length })
  }

  if (value.length === 0) return `[]`

  const bracketLen = 2
  let entriesLen = 0
  const commaAndSpaceLen = 2
  const entries = value.reduce((entries: string[], v, i) => {
    const path = [...context.path, i]
    const str = tersifyValue({ ...context, path }, v, length - entriesLen)
    entriesLen += str.length
    if (i !== value.length - 1) entriesLen += commaAndSpaceLen
    entries.push(str)
    return entries
  }, [] as string[])
  const content = trim(context, entries.join(', '), length - bracketLen)
  if (content.length === 0) return trim(context, `[ ]`, length)
  return `[${content}]`
}

function tersifyObject(context: TersifyContext, value: object, length: number) {
  const ref = context.references.find(r => r.value === value)
  if (ref) {
    return `ref(${ref.path.join(', ')})`
  }

  context.references.push({ value, path: context.path })

  if (!context.raw && hasTersifyFn(value) && value.tersify !== defaultTersify) {
    return value.tersify({ maxLength: length })
  }

  const bracketLen = 4
  let remaining = length - bracketLen
  const keys = Object.keys(value)
  const props = keys.reduce((p, k, i) => {
    if (remaining > 0) {
      const isLastKey = i === keys.length - 1
      const propStr = getPropStr(context, value, k, remaining, isLastKey)
      remaining -= propStr.length
      p.push(propStr)
    }
    return p
  }, [] as string[])

  const hasSkippedProps = keys.length > props.length
  const content = hasSkippedProps ? props.join(', ') + ' ' : props.join(', ')
  const trimmedContent = trim(context, content, length - bracketLen)

  return keys.length === 0 ? '{}' :
    trimmedContent.length === 0 ?
      trim(context, `{   }`, length) :
      `{ ${trimmedContent} }`
}

function tersifyInstance(context: TersifyContext, value: object, length: number) {
  const ref = context.references.find(r => r.value === value)
  if (ref) {
    return `ref(${ref.path.join(', ')})`
  }

  context.references.push({ value, path: context.path })

  if (!context.raw && hasTersifyFn(value) && value.tersify !== defaultTersify) {
    return value.tersify({ maxLength: length })
  }

  if (length <= 4) switch (length) {
    case 4: return '. {}'
    case 3: return '...'
    case 2: return '..'
    case 1: return '.'
    case 0: return ''
  }

  const proto = Object.getPrototypeOf(value)
  const name: string = proto.constructor.name
  const bracketLen = 2 // `{}`
  const spaceLen = 1 // ' '

  const [nameLength, valueLength] = length < (name.length + spaceLen + bracketLen) ?
    [length - spaceLen - bracketLen, bracketLen] :
    [name.length, length - name.length - spaceLen]

  const nameStr = trim(context, name, nameLength)

  let remaining = valueLength
  const keys = Object.keys(value)
  const props = keys.reduce((p, k, i) => {
    if (remaining > 0) {
      const isLastKey = i === keys.length - 1
      const propStr = getPropStr(context, value, k, remaining, isLastKey)
      remaining -= propStr.length
      p.push(propStr)
    }
    return p
  }, [] as string[])

  const hasSkippedProps = keys.length > props.length
  const content = hasSkippedProps ? props.join(', ') + ' ' : props.join(', ')
  const trimmedContent = trim(context, content, valueLength - bracketLen - 2)

  return keys.length === 0 ? `${nameStr} {}` :
    trimmedContent.length === 0 ?
      trim(context, `${nameStr} {   }`, length) :
      `${nameStr} { ${trimmedContent} }`
}

function getPropStr(context: TersifyContext, bag: Record<any, any>, key: string, length: number, isLastKey: boolean) {
  const commaAndSpaceLen = isLastKey ? 0 : 2
  const colonAndSpaceLen = 2
  const path = [...context.path, key]

  const d = Object.getOwnPropertyDescriptor(bag, key)!
  const accessor: string[] = []
  if (d.get) accessor.push('Get')
  if (d.set) accessor.push('Set')
  if (accessor.length > 0) {
    return `${getPropKey(key)}: [${accessor.join('/')}]`
  }

  const value = bag[key]
  if (typeof value === 'function') {
    const fnLen = 2
    if ((/^(.*)\s?=>\s?/.test(value.toString()))) {
      const propValue = tersifyValue(
        { ...context, path },
        value,
        length - key.length - commaAndSpaceLen - colonAndSpaceLen)
      return `${getPropKey(key)}: ${propValue}`
    }
    else {
      const propValue = tersifyValue(
        { ...context, path },
        value,
        length - key.length - commaAndSpaceLen + fnLen)
      const asyncToken = /^async fn/.test(propValue) ? 'async ' : ''
      const generatorToken = /^(async )?fn\*/.test(propValue) ? '*' : ''
      return `${asyncToken}${generatorToken}${getPropKey(key)}${propValue.slice(propValue.indexOf('('))}`
    }
  }
  else {
    // console.log(remaining, k.length, colonAndSpaceLen, commaAndSpaceLen, remaining - k.length - colonAndSpaceLen - commaAndSpaceLen)
    const propValue = tersifyValue(
      { ...context, path, noTrim: true },
      value,
      length - key.length - colonAndSpaceLen - commaAndSpaceLen)
    return `${getPropKey(key)}: ${propValue}`
  }
}

function getPropKey(key: string) {
  return key.indexOf('-') >= 0 ? `'${key}'` : key
}
