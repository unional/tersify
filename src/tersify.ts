import { unpartial } from 'unpartial'

import { defaultOptions } from './constants'
import { tersifyArray } from './tersifyArray'
import { tersifyError } from './tersifyError'
import { tersifyObject } from './tersifyObject'
import { tersifyFunction } from './tersifyFunction'

export interface TersifyOptions {
  maxLength: number,
  /**
   * Raw mode will skip over any .tersify() defined on the object/function.
   * This ensure the tersify() result can be understand by language (JavaScript) parser.
   */
  raw: boolean
}

export function tersify(obj, options?: Partial<TersifyOptions>) {
  const opt = unpartial(defaultOptions, options)
  if (obj === undefined || obj === null)
    return obj + ''
  if (typeof obj === 'function')
    return tersifyFunction(obj, opt)
  if (obj instanceof Error)
    return tersifyError(obj, opt)
  if (Array.isArray(obj))
    return tersifyArray(obj, opt)
  const type = typeof obj
  if (type === 'string')
    return `'${obj}'`
  if (type === 'number' || type === 'boolean')
    return String(obj)
  return tersifyObject(obj, opt)
}
