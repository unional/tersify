import stringifyObject = require('stringify-object');

import { tersifyFunction } from './tersifyFunction'
import { tersifyError } from './tersifyError';

export function tersifyObject(obj, option = { maxLength: Infinity }) {
  let str: string = stringifyObject(obj, {
    indent: '  ',
    inlineCharacterLimit: Infinity,
    transform: (obj, prop, originalResult) => {
      const value = obj[prop]
      if (typeof value === 'function')
        return tersifyFunction(value, option)
      if (value instanceof Error)
        return tersifyError(value, option)
      return originalResult
    }
  })
  str = str.replace(/\{/g, '{ ').replace(/\}/g, ' }').replace(/{\s{2}}/g, '{}').replace(/{\s{2}/g, '{ ').replace(/\s{2}}/g, ' }')
  if (str.length > option.maxLength) {
    str = str.slice(0, option.maxLength - 5) + '...' + str.slice(-2)
  }
  return str
}
