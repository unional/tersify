import stringifyObject = require('stringify-object');

import { formatFunction } from './formatFunction'

export function formatObject(obj, option = { maxLength: 120 }) {
  let str: string = stringifyObject(obj, {
    indent: '  ',
    inlineCharacterLimit: Infinity,
    transform: (obj, prop, originalResult) => {
      if (typeof obj[prop] === 'function')
        return formatFunction(obj[prop], { maxLength: Infinity })
      return originalResult
    }
  })
  str = str.replace(/\{/g, '{ ').replace(/\}/g, ' }').replace(/{\s{2}}/g, '{}')
  if (str.length > option.maxLength) {
    str = str.slice(0, option.maxLength - 5) + '...' + str.slice(-2)
  }
  return str
}
