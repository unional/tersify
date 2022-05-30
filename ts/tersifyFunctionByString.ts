import { EOL } from './constants.js'
import { trim } from './trim.js'
import { TersifyOptions } from './types.js'

export function tersifyFunctionByString(fn: Function, options: TersifyOptions) {
  const str = fn.toString()
  if (options.raw) return str
  if (isFunc(str))
    return formatFn(str, options.maxLength)
  else
    return formatArrow(str, options.maxLength)
}

function isFunc(str: string) {
  const lines = str.split(EOL)
  return new RegExp('^(async\\s+)?function\\s?\\*?\\s?[(]?.*[)]?').test(lines[0])
}

function isArrow(str: string) {
  const lines = str.split(EOL)
  return new RegExp('^(async\\s+)?[(]?.*[)]?\\s+=>').test(lines[0])
}

function formatArrow(str: string, maxLength: number) {
  const struct = getArrowStruct(str)
  const template = `${struct.async ? 'async ' : ''}${struct.singleParam ? '%1' : `(${struct.params ? '%1' : ''})`} => ${struct.singleLineBody ? '%2' : `{${struct.body ? ' %2 ' : ''}}`}`
  const baseLength = struct.params && struct.body ? template.length - 4 :
    struct.params || struct.body ? template.length - 2 : template.length

  struct.params = trim({ raw: false, noTrim: false }, struct.params, Math.max(3, maxLength - baseLength - struct.body.length))
  struct.body = trim({ raw: false, noTrim: false }, struct.body, Math.max(3, maxLength - baseLength - struct.params.length))
  return trim({ raw: false, noTrim: false }, applyTemplate(template, struct), maxLength)
}

function getArrowStruct(str: string) {
  str = str.trim()
  const isAsync = str.startsWith('async ')
  if (isAsync) str = str.slice(5).trim()

  const arrowIndex = str.indexOf('=>')
  const paramRaw = str.slice(0, arrowIndex).trim()
  const bodyRaw = str.slice(arrowIndex + 2).trim()
  const params = getParams(paramRaw.startsWith('(') ? paramRaw : `(${paramRaw})`)
  let isSingle = isSingleLineBody(bodyRaw)
  let body = removeLineBreaks(isSingle ? getSingleLineBody(bodyRaw, Infinity) : getEnclosedBody(bodyRaw)).trim()
  if (!isSingle && body.startsWith('return ') && body.endsWith(';')) {
    isSingle = true
    body = body.slice(7, -1)
    if (body.startsWith('{')) {
      body = `(${body})`
    }
  }
  return {
    async: isAsync,
    generator: false,
    name: '',
    singleParam: params && params.indexOf(',') === -1,
    params,
    singleLineBody: isSingle,
    body
  }
}

function formatFn(str: string, maxLength: number) {
  const struct = getFuncStruct(str)
  const template = `${struct.async ? 'async ' : ''}fn${struct.generator ? '*' : ''}${struct.name ? ' ' + struct.name : ''}(${struct.params ? '%1' : ''}) {${struct.body ? ' %2 ' : ''}}`
  const baseLength = struct.params && struct.body ? template.length - 4 :
    struct.params || struct.body ? template.length - 2 : template.length

  struct.params = trim({ raw: false, noTrim: false }, struct.params, Math.max(3, maxLength - baseLength - struct.body.length))
  struct.body = trim({ raw: false, noTrim: false }, struct.body, Math.max(3, maxLength - baseLength - struct.params.length))
  return trim({ raw: false, noTrim: false }, applyTemplate(template, struct), maxLength)
}

function getFuncStruct(str: string) {
  str = str.trim()
  const isAsync = str.startsWith('async ')
  if (isAsync) str = str.slice(5).trim()

  const isGenerator = /^function\s*\*/.test(str)
  if (isGenerator) {
    str = str.slice(str.indexOf('*') + 1).trim()
  }
  else {
    str = str.slice(8).trim()
  }

  const indexOfOpenParen = str.indexOf('(')
  const name = str.slice(0, indexOfOpenParen).trim()
  str = str.slice(indexOfOpenParen)
  const paramsNotTrimmed = getParams(str)
  str = str.slice(paramsNotTrimmed.length + 2).trim()
  const body = getEnclosedBody(str).trim()

  return {
    async: isAsync,
    generator: isGenerator,
    name,
    params: paramsNotTrimmed.trim(),
    body
  }
}

function getParams(str: string) {
  let count = 1
  str = str.slice(1)
  for (let i = 0; i <= str.length; i++) {
    if (str[i] === ')') count--
    if (str[i] === '(') count++
    if (count === 0) {
      str = str.slice(0, i)
      break
    }
  }
  return str
}
function isSingleLineBody(str: string) {
  return !str.startsWith('{')
}

function getSingleLineBody(str: string, maxLength: number) {
  return isFunc(str) ? formatFn(str, maxLength)
    : isArrow(str) ? formatArrow(str, maxLength)
      : str.replace(/return;/g, '')
        .replace(/([\s([{])Symbol\(\)/g, '$1Sym()')
        .replace(/([\s([{])Symbol\.for\('([\w_]*)'\)/g, '$1Sym($2)')
        .replace(/([\s([{])Symbol\.for\("([\w_]*)"\)/g, '$1Sym($2)')
        .replace(/([\s([{])Symbol\.for\(`([\w_]*)`\)/g, '$1Sym($2)')
        .replace(/{\s+}/g, '{}')
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
  return value.split('\n').map(x => x.trim()).filter(x => !!x).join(' ')
}

function applyTemplate(template: string, struct: ReturnType<typeof getFuncStruct>) {
  if (struct.params) {
    template = template.replace('%1', struct.params)
  }
  if (struct.body) {
    template = template.replace('%2', struct.body)
  }
  return template
}
