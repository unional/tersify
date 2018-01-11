// NOTE: May not need stringify-object anymore, just iterate and repeat
import stringifyObject = require('stringify-object')

import { defaultTersify } from './defaultTersify'
import { isTersible } from './tersible'
import { tersify } from './tersify'

export function tersifyObject(obj, option) {
  let str: string = isTersible(obj) && obj['tersify'] !== defaultTersify ?
    obj.tersify(option) :
    stringifyObject(obj, {
      indent: '  ',
      inlineCharacterLimit: Infinity,
      transform: (obj, prop, originalResult) => {
        const value = obj[prop]
        return tersify(value, option)
      }
    })
  str = str.replace(/\{/g, '{ ').replace(/\}/g, ' }').replace(/{\s{2}}/g, '{}').replace(/{\s{2}/g, '{ ').replace(/\s{2}}/g, ' }')
  if (str.length > option.maxLength) {
    str = str.slice(0, option.maxLength - 5) + '...' + str.slice(-2)
  }
  return str
}
