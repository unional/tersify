import { defaultTersify } from './defaultTersify'
import { isTersible } from './tersible'
import { tersify } from './tersify'

function stringifyObject(obj, options) {
  const nodes: any[] = []
  Object.keys(obj).forEach(k => {
    const value = obj[k]
    if (value === undefined)
      return
    nodes.push(`${k}: ${tersify(value, options)}`)
  })
  return nodes.length === 0 ? '{}' : `{ ${nodes.join(', ')} }`
}

export function tersifyObject(obj, option) {
  if (obj instanceof RegExp) {
    return obj.toString()
  }
  let str: string = !option.raw && isTersible(obj) && obj['tersify'] !== defaultTersify ?
    obj.tersify(option) :
    stringifyObject(obj, option)
  console.log(obj instanceof RegExp)
  if (str.length > option.maxLength) {
    str = str.slice(0, option.maxLength - 5) + '...' + str.slice(-2)
  }
  return str
}
