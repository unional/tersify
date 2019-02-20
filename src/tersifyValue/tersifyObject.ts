import { TersifyContext } from './interfaces';
import { isTersible } from '../tersible';
import { tersifyValue } from './tersifyValue';
import { trim } from './trim';
export function tersifyObject(context: TersifyContext, value: object, length: number) {
  // if (context.references.find(x => x === value)) {
  //   return `[circular]`
  // }

  // context.references.push(value)

  if (!context.raw && isTersible(value)) {
    return value.tersify({ maxLength: length })
  }
  let remaining = length
  const props = Object.keys(value).reduce((p, k) => {
    if (remaining > 0) {
      const v = value[k]
      const propValue = tersifyValue(context, v, length)

      if (typeof v === 'function' && !(/^(.*) => /.test(propValue))) {
        const propStr = `${k}${propValue.slice(propValue.indexOf('('))}` 
        remaining -= propStr.length
        p.push(propStr)
      }
      else {
        const propStr = `${k}: ${propValue}`
        remaining -= propStr.length
        p.push(propStr)
      }
    }
    return p
  }, [] as string[])

  return props.length === 0 ? '{}' : `{ ${trim(props.join(', '), length - 4)} }`
}
