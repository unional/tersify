import { tersifyArray } from './tersifyArray'
import { tersifyError } from './tersifyError'
import { tersifyObject } from './tersifyObject'
// import { tersifyFunction } from './tersifyNode/tersifyFunction'
import { TersifyOptions } from './interfaces';


export function tersifyAny(obj, options: TersifyOptions) {
  if (obj === undefined || obj === null)
    return obj + ''
  // if (typeof obj === 'function')
    // return tersifyFunction(obj, options as any)
  if (obj instanceof Error)
    return tersifyError(obj, options)
  if (Array.isArray(obj))
    return tersifyArray(obj, options)
  const type = typeof obj
  if (type === 'string') {
    if (obj.length > options.maxLength)
      return `'${obj.slice(0, options.maxLength - 3)}...'`
    return `'${obj}'`
  }
  if (type === 'number' || type === 'boolean')
    return String(obj)
  return tersifyObject(obj, options)
}
