import { trim } from './trim.js'
import { TersifyOptions } from './types.js'

export function tersifyFunctionByString(fn: Function, options: TersifyOptions) {
  const str = fn.toString()
  if (options.raw) return str
  const struct = parseFn(str)
  switch (struct.type) {
    case 'function': return formatFn2(struct, options.maxLength)
    case 'arrow': return formatArrow2(struct, options.maxLength)
    case 'unknown': default:
      // istanbul ignore next
      return formatUnknown(struct, options.maxLength)
  }
}

export type FuncStruct = FunctionStruct | ArrowStruct | UnknownStruct

export interface FunctionStruct {
  type: 'function',
  name: string,
  params: string,
  body: string,
  async: boolean,
  generator: boolean
}

export interface ArrowStruct {
  type: 'arrow',
  params: string,
  body: string,
  singleParam: boolean,
  singleLineBody: boolean,
  async: boolean
}

export interface UnknownStruct {
  type: 'unknown',
  value: string
}

/**
 * Note that we don't have to be exhaustive with the regex.
 * The input is from compilers's `fn.toString()`.
 * So they won't be too bad.
 */
const funcRegex = /^(async\s+)?function\s*(\*?)\s*(\w*)\s*\(([^)]*)\)\s*(\{.*\})$/ms
const arrowRegex = /^(async\s*)?\(([^)]*)\)\s*=>(.*)$/ms
const arrowSingleParamRegex = /^(async\s+)?(\w+)\s*=>(.*)$/ms

export function parseFn(input: string): FuncStruct {
  let match = funcRegex.exec(input)
  if (match) {
    const body = getEnclosedBody((match[5] ?? '').trim()).trim()
    return {
      type: 'function',
      async: !!match[1],
      generator: !!match[2],
      name: (match[3] ?? '').trim(),
      params: (match[4] ?? '').trim(),
      body
    }
  }
  match = arrowRegex.exec(input)
  if (match) {
    const params = (match[2] ?? '').trim()
    let body = (match[3] ?? '').trim()
    let singleLineBody = isSingleLineBody(body)
    body = removeLineBreaks(singleLineBody ? getSingleLineBody(body, Infinity) : getEnclosedBody(body)).trim()
    if (!singleLineBody && body.startsWith('return ') && body.endsWith(';')) {
      singleLineBody = true
      body = body.slice(7, -1)
      if (body.startsWith('{')) {
        body = `(${body})`
      }
    }
    return {
      type: 'arrow',
      async: !!match[1],
      params,
      body,
      singleParam: params.length > 0 && params.indexOf(',') === -1,
      singleLineBody
    }
  }
  match = arrowSingleParamRegex.exec(input)
  if (match) {
    let body = (match[3] ?? '').trim()
    let singleLineBody = isSingleLineBody(body)
    body = removeLineBreaks(singleLineBody ? getSingleLineBody(body, Infinity) : getEnclosedBody(body)).trim()
    if (!singleLineBody && body.startsWith('return ') && body.endsWith(';')) {
      singleLineBody = true
      body = body.slice(7, -1)
      if (body.startsWith('{')) {
        body = `(${body})`
      }
    }
    return {
      type: 'arrow',
      async: !!match[1],
      params: `${match[2]}`,
      body,
      singleParam: true,
      singleLineBody
    }
  }
  return {
    type: 'unknown',
    value: input
  }
}

function formatFn2(struct: FunctionStruct, maxLength: number) {
  const template = `${struct.async ? 'async ' : ''}fn${struct.generator ? '*' : ''}${struct.name ? ' ' + struct.name : ''}(${struct.params ? '%1' : ''}) {${struct.body ? ' %2 ' : ''}}`
  const baseLength = struct.params && struct.body ? template.length - 4 :
    struct.params || struct.body ? template.length - 2 : template.length

  struct.params = trim({ raw: false, noTrim: false }, struct.params, Math.max(3, maxLength - baseLength - struct.body.length))
  struct.body = trim({ raw: false, noTrim: false }, struct.body, Math.max(3, maxLength - baseLength - struct.params.length))
  return trim({ raw: false, noTrim: false }, applyTemplate(template, struct), maxLength)
}

function formatArrow2(struct: ArrowStruct, maxLength: number) {
  const template = `${struct.async ? 'async ' : ''}${struct.singleParam ? '%1' : `(${struct.params ? '%1' : ''})`} => ${struct.singleLineBody ? '%2' : `{${struct.body ? ' %2 ' : ''}}`}`
  const baseLength = struct.params && struct.body ? template.length - 4 :
    struct.params || struct.body ? template.length - 2 : template.length

  struct.params = trim({ raw: false, noTrim: false }, struct.params, Math.max(3, maxLength - baseLength - struct.body.length))
  struct.body = trim({ raw: false, noTrim: false }, struct.body, Math.max(3, maxLength - baseLength - struct.params.length))
  return trim({ raw: false, noTrim: false }, applyTemplate(template, struct), maxLength)
}

// istanbul ignore next
function formatUnknown(struct: UnknownStruct, maxLength: number) {
  return trim({ noTrim: false }, struct.value, maxLength)
}

function isSingleLineBody(str: string) {
  return !str.startsWith('{')
}

function getSingleLineBody(str: string, maxLength: number) {
  const struct = parseFn(str)
  switch (struct.type) {
    case 'function': return formatFn2(struct, maxLength)
    case 'arrow': return formatArrow2(struct, maxLength)
    default: return str.replace(/return;/g, '')
      .replace(/([\s([{])Symbol\(\)/g, '$1Sym()')
      .replace(/([\s([{])Symbol\.for\('([\w_]*)'\)/g, '$1Sym($2)')
      .replace(/([\s([{])Symbol\.for\("([\w_]*)"\)/g, '$1Sym($2)')
      .replace(/([\s([{])Symbol\.for\(`([\w_]*)`\)/g, '$1Sym($2)')
      .replace(/{\s+}/g, '{}')
  }
}

function getEnclosedBody(str: string) {
  let count = 1
  str = str.slice(1)
  for (let i = 0; i <= str.length; i++) {
    if (str[i] === '}') count--
    if (str[i] === '{') count++
    if (count === 0) {
      const body = removeLineBreaks(str.slice(0, i))
      str = body.replace(/return;/g, '')
        .replace(/([\s([{])Symbol\(\)/g, '$1Sym()')
        .replace(/([\s([{])Symbol\.for\('([\w_]*)'\)/g, '$1Sym($2)')
        .replace(/([\s([{])Symbol\.for\("([\w_]*)"\)/g, '$1Sym($2)')
        .replace(/([\s([{])Symbol\.for\(`([\w_]*)`\)/g, '$1Sym($2)')
        .replace(/{\s+}/g, '{}')
      break
    }
  }
  return str
}

function removeLineBreaks(value: string) {
  return value.split('\n')
    .map(x => x.trim())
    .filter(x => !!x)
    .map((x, i, a) => {
      return (i < a.length - 1 && /[^({}):;(do|else)]$/.test(x) && /[^)}]/.test(a[i + 1]))
        ? x + ';' : x
    }).join(' ')
}

function applyTemplate(template: string, struct: { params: string, body: string }) {
  if (struct.params) {
    template = template.replace('%1', struct.params)
  }
  if (struct.body) {
    template = template.replace('%2', struct.body)
  }
  return template
}
