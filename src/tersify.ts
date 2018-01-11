import { tersifyArray } from './tersifyArray'
import { tersifyError } from './tersifyError'
import { tersifyObject } from './tersifyObject'
import { tersifyFunction } from './tersifyFunction'

export function tersify(obj, option = { maxLength: 120 }) {
  if (typeof obj === 'function')
    return tersifyFunction(obj, option)
  if (obj instanceof Error)
    return tersifyError(obj, option)
  if (Array.isArray(obj))
    return tersifyArray(obj, option)
  return tersifyObject(obj, option)
}
