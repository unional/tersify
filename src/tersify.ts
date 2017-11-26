import { tersifyObject } from './tersifyObject'
import { tersifyFunction } from './tersifyFunction'

export function tersify(obj, option = { maxLength: 120 }) {
  if (typeof obj === 'function')
    return tersifyFunction(obj, option)
  return tersifyObject(obj, option)
}
