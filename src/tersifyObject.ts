import stringifyObject = require('stringify-object');

import { tersifyFunction } from './tersifyFunction'

export function tersifyObject(obj, option = { maxLength: Infinity }) {
  let str: string = stringifyObject(obj, {
    indent: '  ',
    inlineCharacterLimit: Infinity,
    transform: (obj, prop, originalResult) => {
      if (typeof obj[prop] === 'function')
        return tersifyFunction(obj[prop], { maxLength: Infinity })
      return originalResult
    }
  })
  str = str.replace(/\{/g, '{ ').replace(/\}/g, ' }').replace(/{\s{2}}/g, '{}')
  if (str.length > option.maxLength) {
    str = str.slice(0, option.maxLength - 5) + '...' + str.slice(-2)
  }
  return str
}
