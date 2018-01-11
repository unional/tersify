import { unpartial } from 'unpartial'

import { defaultOptions } from './constants'
import { tersifyArray } from './tersifyArray'
import { tersifyError } from './tersifyError'
import { tersifyObject } from './tersifyObject'
import { tersifyFunction } from './tersifyFunction'

export interface TersifyOptions {
  maxLength: number
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
  return tersifyObject(obj, opt)
}
